from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv
import json
import subprocess
import tempfile
import shutil

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_code(prompt):
    """Generate code based on user prompt using OpenAI"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional software developer. Generate complete, working code based on the user's requirements. Include all necessary files, dependencies, and setup instructions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating code: {str(e)}"

def create_project_structure(code_response):
    """Create project structure based on generated code"""
    try:
        # Create a temporary directory for the project
        temp_dir = tempfile.mkdtemp()
        
        # Parse the code response and create files
        # This is a simplified version - in a real app, you'd need more sophisticated parsing
        files = code_response.split("```")
        for i in range(1, len(files), 2):
            if i + 1 < len(files):
                file_content = files[i]
                if file_content.startswith("python") or file_content.startswith("javascript"):
                    file_content = file_content.split("\n", 1)[1]
                file_path = os.path.join(temp_dir, f"file_{i//2}.py")
                with open(file_path, "w") as f:
                    f.write(file_content)
        
        return temp_dir
    except Exception as e:
        return f"Error creating project structure: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    # Generate code
    code_response = generate_code(prompt)
    
    # Create project structure
    project_dir = create_project_structure(code_response)
    
    return jsonify({
        "code": code_response,
        "project_dir": project_dir
    })

if __name__ == '__main__':
    app.run(debug=True) 