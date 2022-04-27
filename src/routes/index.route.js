const userRouter = require('./user.route.js');
const postRouter = require('./post.route.js');
const siteRouter = require('./site.route.js');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/dashboard', postRouter);
    app.use('/', siteRouter);
}

module.exports = initRoutes;
