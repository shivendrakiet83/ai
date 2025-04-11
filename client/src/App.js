import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [projectStructure, setProjectStructure] = useState('');
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCode('');
    setProjectStructure('');
    setDownloadUrl('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate', { prompt });
      setCode(response.data.code);
      setProjectStructure(response.data.projectStructure);
      setDownloadUrl(response.data.downloadUrl);
    } catch (err) {
      console.error('API Error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error: ${err.response.data.error || 'Unknown error'}\nDetails: ${err.response.data.details || 'No details available'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Error: No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(`http://localhost:5000${downloadUrl}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">AI Code Generator</h1>
          <p className="text-gray-600 mt-2">Transform your ideas into a complete Code</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-gray-700 font-medium mb-2">
                Describe your Code:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Create a personal portfolio website with a dark theme, about section, projects gallery, and contact form"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>
          </form>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg whitespace-pre-wrap">
              {error}
            </div>
          )}

          {code && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generated Code:</h2>
                {downloadUrl && (
                  <button
                    onClick={handleDownload}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Download
                  </button>
                )}
              </div>
              <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono">{code}</pre>
              </div>
            </div>
          )}

          {projectStructure && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Project Structure:</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono">
                  {JSON.stringify(JSON.parse(projectStructure), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 