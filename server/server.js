const app = require('./app');

const port = 3001;
const server = app.listen(port, () => {});

module.exports = server;
