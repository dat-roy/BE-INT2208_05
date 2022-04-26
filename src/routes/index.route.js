const userRouter = require('./user.route.js');
const siteRouter = require('./site.route.js');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = initRoutes;
