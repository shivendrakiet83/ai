# AI Coding Agent (Node.js Version)

A web-based AI Coding Agent that transforms natural language descriptions into functional code. This application uses OpenAI's GPT-4 to generate code based on user prompts and creates a project structure for the generated code.

## Features

- Natural language to code conversion
- Modern React-based web interface
- Real-time code generation
- Project structure creation
- MongoDB integration for saving projects
- Support for multiple programming languages and frameworks

## Prerequisites

- Node.js 14.x or higher
- MongoDB
- OpenAI API key
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-coding-agent
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory and add your environment variables:
```
OPENAI_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/ai-coding-agent
PORT=5000
```

## Usage

1. Start the MongoDB server:
```bash
mongod
```

2. Start the development server (in the root directory):
```bash
npm run dev
```
This will start both the backend server and the React frontend.

3. Open your web browser and navigate to `http://localhost:3000`

4. Enter your application description in the text area and click "Generate Code"

5. The AI will generate the code and create a project structure based on your description

## Project Structure

```
ai-coding-agent/
├── server.js           # Express server
├── package.json        # Server dependencies
├── .env               # Environment variables
├── client/            # React client
│   ├── src/
│   │   └── App.js     # Main React component
│   └── package.json   # Client dependencies
└── README.md          # This file
```

## API Endpoints

- `POST /api/generate` - Generate code from a prompt
- `GET /api/projects` - Get all saved projects

## Example Prompts

- "Create a to-do app with user authentication and a modern UI"
- "Build a weather application that shows current weather and forecast"
- "Generate a REST API for a blog system with user management"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 