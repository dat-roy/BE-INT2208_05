const userRouter = require('./user.route.js');
const siteRouter = require('./site.route.js');
const testRouter = require('./test.route.js');

//======================//
function initRoutes(app) {
    app.use('/test', testRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = initRoutes;
