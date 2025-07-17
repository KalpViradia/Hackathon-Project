const axios = require('axios');
const { routes } = require('./routes/allRoutes');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let testUserId = '';
let testPostId = '';
let testStoryId = '';

const testObjects = {
    signup: {
        username: `testuser${Date.now()}`,
        email: `testuser${Date.now()}@example.com`,
        password: "TestPass123!"
    },
    post: {
        content: "Test post content " + Date.now(),
        image: "https://picsum.photos/200/300"
    },
    story: {
        media: "https://picsum.photos/200/300",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    comment: {
        content: "Test comment " + Date.now()
    },
    message: {
        content: "Test message " + Date.now()
    }
};

const testRoute = async (route) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && { Authorization: `Bearer ${authToken}` })
            }
        };

        let response;
        const url = `${BASE_URL}${route.path}`;
        
        // Replace path parameters with actual test IDs
        const finalUrl = url.replace(/:id/g, testPostId || testUserId)
                           .replace(/:userId/g, testUserId)
                           .replace(/:messageId/g, '123456789012345678901234')
                           .replace(/:groupId/g, '123456789012345678901234');

        // Select appropriate test data
        let testData = {};
        if (route.path === '/api/auth/signup') {
            testData = testObjects.signup;
        } else if (route.path === '/api/auth/login') {
            testData = {
                email: testObjects.signup.email,
                password: testObjects.signup.password
            };
        } else if (route.path.includes('posts')) {
            testData = testObjects.post;
        } else if (route.path.includes('stories')) {
            testData = testObjects.story;
        } else if (route.path.includes('messages')) {
            testData = testObjects.message;
        }

        switch (route.method) {
            case 'GET':
                response = await axios.get(finalUrl, config);
                break;
            case 'POST':
                response = await axios.post(finalUrl, testData, config);
                break;
            case 'PUT':
                response = await axios.put(finalUrl, testData, config);
                break;
            case 'DELETE':
                response = await axios.delete(finalUrl, config);
                break;
        }

        // Store auth token and user ID from login response
        if (route.path === '/api/auth/login' && response.data.token) {
            authToken = response.data.token;
            testUserId = response.data.user.id;
        }
        // Store post ID from create post response
        else if (route.path === '/api/posts' && route.method === 'POST') {
            testPostId = response.data._id;
        }
        // Store story ID from create story response
        else if (route.path === '/api/stories' && route.method === 'POST') {
            testStoryId = response.data._id;
        }

        return {
            route: route.path,
            method: route.method,
            status: 'SUCCESS',
            statusCode: response.status,
            data: response.data
        };
    } catch (err) {
        return {
            route: route.path,
            method: route.method,
            status: 'FAILED',
            statusCode: err.response?.status || 500,
            error: err.response?.data?.message || err.message
        };
    }
};

// Group routes by dependency
const routeGroups = {
    auth: routes.filter(r => r.path.startsWith('/api/auth')),
    user: routes.filter(r => r.path.startsWith('/api/user')),
    post: routes.filter(r => r.path.startsWith('/api/posts')),
    story: routes.filter(r => r.path.startsWith('/api/stories')),
    message: routes.filter(r => r.path.startsWith('/api/messages')),
    notification: routes.filter(r => r.path.startsWith('/api/notifications')),
    admin: routes.filter(r => r.path.startsWith('/api/admin')),
    upload: routes.filter(r => r.path.startsWith('/api/upload'))
};

const runTests = async () => {
    console.log('🚀 Starting API route tests...\n');

    // Test auth routes first
    for (const route of routeGroups.auth) {
        const result = await testRoute(route);
        logResult(result);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test other routes in sequence
    const otherRouteGroups = ['user', 'post', 'story', 'message', 'notification', 'admin', 'upload'];
    for (const group of otherRouteGroups) {
        console.log(`\nTesting ${group.toUpperCase()} routes:`);
        for (const route of routeGroups[group]) {
            const result = await testRoute(route);
            logResult(result);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('\n✅ Route testing completed!');
};

const logResult = (result) => {
    const statusColor = result.status === 'SUCCESS' ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';
    const methodColor = '\x1b[36m';
    
    console.log(
        `${methodColor}${result.method.padEnd(6)}${resetColor}` +
        `${result.route.padEnd(40)}` +
        `${statusColor}${result.status}${resetColor} ` +
        `(${result.statusCode})` +
        (result.error ? ` - ${result.error}` : '')
    );
};

// Run tests
runTests().catch(console.error);
