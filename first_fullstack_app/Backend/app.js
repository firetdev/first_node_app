import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

http.createServer((request, response) => {
  // Only handle POST /api/createData
  if (request.method === 'POST' && request.url === '/api/createData') {

    let body = '';

    // Collect incoming data
    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      let data;

      try {
        data = JSON.parse(body);
      } catch (err) {
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        return response.end('Invalid JSON');
      }

      const { folderName, fileName, textContent } = data;

      // Validate fields
      if (!folderName || !fileName || !textContent) {
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        return response.end('Missing required data');
      }

      // Create folder
      try {
        await fs.mkdir(folderName, { recursive: true });
      } catch (err) {
        console.error(err);
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        return response.end(err.message);
      }

      // Create file with content
      const filePath = path.join(folderName, fileName);
      await fs.writeFile(filePath, textContent, 'utf8');
      console.log('File written successfully');

      // Respond success
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({
        success: true,
        message: 'Data received successfully'
      }));
    });

    // Error handling
    request.on('error', err => {
      console.error('Request error:', err);
      response.writeHead(400);
      response.end();
    });

    response.on('error', err => {
      console.error('Response error:', err);
    });

    return;
  }

  // Default response for unknown routes
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.end('Route not found');
}).listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});