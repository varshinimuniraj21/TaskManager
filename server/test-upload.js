const http = require('http');
const path = require('path');
const fs = require('fs');
const { start } = require('./server');

async function testUpload() {
  console.log('\n--- TESTING MULTER IMAGE UPLOAD ---');
  const server = await start();

  // Create a minimal 1x1 test PNG buffer
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

  // 1. Register a test user
  const regPayload = JSON.stringify({
    name: 'Test Artist',
    email: `artist_${Date.now()}@taskflow.dev`,
    password: 'password123',
  });

  const regRes = await new Promise((resolve) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(regPayload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(JSON.parse(body)));
      }
    );
    req.write(regPayload);
    req.end();
  });

  const token = regRes.token;

  // Build multipart form data for project with image
  let multipartBody = '';
  multipartBody += `--${boundary}\r\n`;
  multipartBody += `Content-Disposition: form-data; name="title"\r\n\r\n`;
  multipartBody += `Multer Test Project\r\n`;
  multipartBody += `--${boundary}\r\n`;
  multipartBody += `Content-Disposition: form-data; name="category"\r\n\r\n`;
  multipartBody += `Sci-Fi\r\n`;
  multipartBody += `--${boundary}\r\n`;
  multipartBody += `Content-Disposition: form-data; name="image"; filename="cover.png"\r\n`;
  multipartBody += `Content-Type: image/png\r\n\r\n`;

  const bodyHead = Buffer.from(multipartBody, 'utf-8');
  const bodyTail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
  const fullBody = Buffer.concat([bodyHead, samplePngBuffer, bodyTail]);

  const uploadRes = await new Promise((resolve) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/projects',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': fullBody.length,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
      }
    );
    req.write(fullBody);
    req.end();
  });

  console.log('Project with Image Upload Result:', uploadRes.status, uploadRes.data);

  if (uploadRes.status === 201 && uploadRes.data.project.coverImage.startsWith('/uploads/')) {
    const savedPath = path.join(__dirname, uploadRes.data.project.coverImage);
    const fileExists = fs.existsSync(savedPath);
    console.log(`[PASS] Multer saved image file to disk: ${savedPath} (Exists: ${fileExists})`);
  } else {
    console.error('[FAIL] Multer upload failed');
  }

  server.close();
  process.exit(0);
}

testUpload();
