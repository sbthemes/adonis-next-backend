module.exports = {
    apps: [
        {
            name: 'adonis',
            script: './build/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
        },
    ],
};
