const userRouter = require('./user.route.js');
const adminRouter = require('./admin.route.js');
const postRouter = require('./post.route.js');
const siteRouter = require('./site.route.js');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/post', postRouter);
    app.use('/', siteRouter);
}

module.exports = initRoutes;
