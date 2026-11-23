const http = require('http');
const path = require('path');
const fs = require('fs');

const { app, start } = require('./server');

const testPort = process.env.PORT || 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n=============================================');
  console.log('--- TASKFLOW INTEGRATION TEST SUITE ---');
  console.log('=============================================\n');

  const serverInstance = await start();
  await sleep(1000);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.body.status === 'OK', 'Health check endpoint responds 200 OK');

    // 2. Register user
    const testEmail = `author_${Date.now()}@taskflow.dev`;
    const regPayload = JSON.stringify({
      name: 'Arthur Conan Doyle',
      email: testEmail,
      password: 'password123',
    });
    const regRes = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(regPayload),
        },
      },
      regPayload
    );
    assert(regRes.status === 201 && regRes.body.token, 'User registration with bcrypt and JWT creation');

    const token = regRes.body.token;

    // 3. User login
    const loginPayload = JSON.stringify({
      email: testEmail,
      password: 'password123',
    });
    const loginRes = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginPayload),
        },
      },
      loginPayload
    );
    assert(loginRes.status === 200 && loginRes.body.user.name === 'Arthur Conan Doyle', 'User login and JWT credential verification');

    // 4. Authenticated profile
    const profileRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/auth/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(profileRes.status === 200 && profileRes.body.user.email === testEmail, 'Protected route /api/auth/profile verifies JWT');

    // 5. Create Project
    const projectPayload = JSON.stringify({
      title: 'The Silent Hours',
      category: 'Mystery',
      description: 'A detective locked-room manuscript in Victorian London',
    });
    const projRes = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/projects',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(projectPayload),
        },
      },
      projectPayload
    );
    assert(projRes.status === 201 && projRes.body.project.title === 'The Silent Hours', 'Project CRUD: Created new project');

    const projectId = projRes.body.project._id;

    // 6. Create Tasks linked to Project
    const task1Payload = JSON.stringify({
      title: 'Book 1: Opening Scene Outline',
      description: 'Establish foggy riverbank mood and murder mystery clue',
      priority: 'High',
      status: 'In Progress',
      projectId: projectId,
    });
    const task1Res = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/tasks',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(task1Payload),
        },
      },
      task1Payload
    );
    assert(task1Res.status === 201 && task1Res.body.task.priority === 'High', 'Task CRUD: Created high priority task');

    const taskId = task1Res.body.task._id;

    // 7. Update Task Status & verify Project Progress
    const updatePayload = JSON.stringify({
      status: 'Completed',
    });
    const updateRes = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: `/api/tasks/${taskId}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(updatePayload),
        },
      },
      updatePayload
    );
    assert(updateRes.status === 200 && updateRes.body.task.status === 'Completed', 'Task CRUD: Marked task completed');

    // 8. Verify Project Progress updated to 100%
    const projectsList = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/projects',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedProj = projectsList.body.projects.find((p) => p._id === projectId);
    assert(updatedProj && updatedProj.progress === 100, 'Project progress automatically recalculated (100% completed)');

    // 9. Create Idea Note
    const notePayload = JSON.stringify({
      title: 'Story Ideas',
      content: 'Story ideas are tweets in story ideas.',
    });
    const noteRes = await request(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/notes',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(notePayload),
        },
      },
      notePayload
    );
    assert(noteRes.status === 201 && noteRes.body.note.title === 'Story Ideas', 'Idea Board CRUD: Saved note');

    // 10. Dashboard Stats
    const statsRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(
      statsRes.status === 200 && statsRes.body.stats.completedTasks >= 1,
      'Productivity Dashboard: Retrieved live metrics from MongoDB'
    );

    console.log(`\nTests completed: ${passed} PASSED, ${failed} FAILED.`);
    serverInstance.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    if (serverInstance) serverInstance.close();
    process.exit(1);
  }
}

runTests();
