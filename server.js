const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-coding-agent', mongoOptions)
.then(() => {
    console.log('MongoDB Connected');
    // Set up error handling for MongoDB
    mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit if we can't connect to MongoDB
});

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000
});

// Project Schema
const projectSchema = new mongoose.Schema({
    prompt: String,
    generatedCode: String,
    projectStructure: String,
    createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Create a temporary directory for generated files
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Function to generate meaningful file name based on content analysis
function generateFileName(content) {
    // Detect file type based on content
    let fileExtension = '';
    let fileName = '';

    // Determine file extension based on content
    if (content.trim().startsWith('<!DOCTYPE html') || content.includes('<html')) {
        fileExtension = '.html';
    } else if (content.includes('@media') || content.includes('{') && content.includes('}')) {
        fileExtension = '.css';
    } else if (content.includes('function') || content.includes('const') || content.includes('let')) {
        fileExtension = '.js';
    } else if (content.includes('<?php')) {
        fileExtension = '.php';
    } else if (content.includes('import') && content.includes('from')) {
        fileExtension = '.jsx';
    } else {
        fileExtension = '.txt'; // Default extension
    }

    // Generate file name based on content analysis
    if (fileExtension === '.html') {
        // Extract title or main heading for HTML files
        const titleMatch = content.match(/<title>(.*?)<\/title>/i) ||
                         content.match(/<h1[^>]*>(.*?)<\/h1>/i) ||
                         content.match(/<div[^>]*class=["']([^"']*title[^"']*)["'][^>]*>(.*?)<\/div>/i);
        
        if (titleMatch) {
            fileName = titleMatch[1].toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace special characters with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
        }

        // Check for specific page types
        if (content.includes('reservation-form') || content.includes('Make a Reservation')) {
            fileName = 'reservation';
        } else if (content.includes('about-content') || content.includes('Why Choose Us')) {
            fileName = 'about';
        } else if (content.includes('contact-form') || content.includes('Get In Touch')) {
            fileName = 'contact';
        } else if (!fileName) {
            fileName = 'index';
        }
    } else {
        // For non-HTML files, analyze content for meaningful names
        const firstLine = content.split('\n')[0].trim();
        if (firstLine.startsWith('//') || firstLine.startsWith('/*')) {
            // Use comment as file name
            fileName = firstLine.replace(/^\/\/|^\/\*|\*\/$|[^a-zA-Z0-9]+/g, '')
                .toLowerCase()
                .slice(0, 30); // Limit length
        } else {
            // Generate name based on content purpose
            if (fileExtension === '.css') {
                fileName = content.includes('main') ? 'main' : 'styles';
            } else if (fileExtension === '.js') {
                fileName = content.includes('script') ? 'script' : 'main';
            } else {
                fileName = 'file-' + Date.now().toString().slice(-6);
            }
        }
    }

    return fileName + fileExtension;
}

// Routes
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI API key is not configured',
                details: 'Please check your .env file'
            });
        }

        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB is not connected');
        }

        // Generate code using OpenAI with enhanced design focus
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert web developer and UI/UX designer. Generate a modern, visually appealing website with the following features:
                    - Modern, clean design with attention to typography and spacing
                    - Responsive layout using modern CSS Grid and Flexbox
                    - Smooth animations and transitions
                    - Consistent color scheme and visual hierarchy
                    - Interactive elements with hover effects
                    - Modern UI components (cards, buttons, forms)
                    - Optimized for mobile devices
                    - Loading animations and visual feedback
                    - Modern CSS features (variables, gradients, shadows)
                    - Accessibility features (ARIA labels, semantic HTML)

                    Format the code in separate blocks using \`\`\` for HTML, CSS, and JavaScript files.
                    Include detailed comments for maintainability.`
                },
                {
                    role: "user",
                    content: `Create a beautiful, modern website with these requirements: ${prompt}. Focus on creating an engaging user experience with smooth animations and professional design.`
                }
            ],
            temperature: 0.7,
            max_tokens: 3000
        });

        if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            throw new Error('Invalid response from OpenAI');
        }

        const generatedCode = completion.choices[0].message.content;
        
        // Create project files
        const projectId = Date.now().toString();
        const projectDir = path.join(tempDir, projectId);
        fs.mkdirSync(projectDir);

        // Parse and save files
        const files = generatedCode.split("```");
        const fileStructure = [];
        // Store all CSS files and their content for later processing
        const cssFiles = [];
        const htmlFiles = [];
        
        for (let i = 0; i < files.length; i++) {
            const content = files[i].trim();
            if (!content) continue;

            // Extract the file type and content
            const firstLine = content.split('\n')[0].toLowerCase();
            const actualContent = content.split('\n').slice(1).join('\n');
            
            if (firstLine === 'html') {
                let htmlFileName = generateFileName(actualContent);
                htmlFiles.push({
                    name: htmlFileName,
                    content: actualContent
                });
                fileStructure.push(htmlFileName);
            } else if (firstLine === 'css') {
                // Generate CSS filename based on content
                let cssContent = actualContent.toLowerCase();
                let cssFileName = 'style.css'; // default name

                // Check for specific CSS content patterns
                if (cssContent.includes('navbar') || cssContent.includes('navigation')) {
                    cssFileName = 'nav.css';
                } else if (cssContent.includes('footer')) {
                    cssFileName = 'footer.css';
                } else if (cssContent.includes('form') || cssContent.includes('input')) {
                    cssFileName = 'forms.css';
                } else if (cssContent.includes('@media')) {
                    cssFileName = 'responsive.css';
                } else if (cssContent.includes('animation') || cssContent.includes('@keyframes')) {
                    cssFileName = 'animations.css';
                } else {
                    // Look for main section identifiers
                    const mainSectionMatch = cssContent.match(/[.#]([a-z-]+)\s*{/i);
                    if (mainSectionMatch) {
                        cssFileName = mainSectionMatch[1].toLowerCase() + '.css';
                    }
                }

                cssFiles.push({
                    name: cssFileName,
                    content: actualContent
                });
                fileStructure.push(cssFileName);
            } else if (firstLine === 'javascript') {
                fs.writeFileSync(path.join(projectDir, 'script.js'), actualContent);
                fileStructure.push('script.js');
            }
        }

        // First write all CSS files
        for (const cssFile of cssFiles) {
            fs.writeFileSync(path.join(projectDir, cssFile.name), cssFile.content);
        }

        // Then update HTML files to include all CSS files
        for (const htmlFile of htmlFiles) {
            let updatedContent = htmlFile.content;
            
            // Find the closing </head> tag
            const headEndIndex = updatedContent.indexOf('</head>');
            if (headEndIndex !== -1) {
                // Insert all CSS file links before </head>
                const cssLinks = cssFiles
                    .map(css => `    <link rel="stylesheet" href="${css.name}">\n`)
                    .join('');
                
                updatedContent = 
                    updatedContent.slice(0, headEndIndex) +
                    cssLinks +
                    updatedContent.slice(headEndIndex);
            }

            fs.writeFileSync(path.join(projectDir, htmlFile.name), updatedContent);
        }

        // Create a zip file
        const zipPath = path.join(tempDir, `${projectId}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Archive created: ${archive.pointer()} bytes`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(projectDir, false);
        archive.finalize();

        // Save to MongoDB with timeout
        try {
            const project = new Project({
                prompt,
                generatedCode,
                projectStructure: JSON.stringify(fileStructure)
            });

            await Promise.race([
                project.save(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('MongoDB operation timed out')), 5000)
                )
            ]);

            res.json({
                code: generatedCode,
                projectStructure: project.projectStructure,
                downloadUrl: `/api/download/${projectId}`
            });
        } catch (dbError) {
            console.error('Database Error:', dbError);
            // Even if database save fails, return the generated code
            res.json({
                code: generatedCode,
                projectStructure: JSON.stringify(fileStructure),
                downloadUrl: `/api/download/${projectId}`
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Error generating website',
            details: error.message
        });
    }
});

// Download route
app.get('/api/download/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const zipPath = path.join(tempDir, `${projectId}.zip`);
    
    if (fs.existsSync(zipPath)) {
        res.download(zipPath, 'website.zip', (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Clean up files
            const projectDir = path.join(tempDir, projectId);
            if (fs.existsSync(projectDir)) {
                fs.rmSync(projectDir, { recursive: true });
            }
            if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
            }
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 