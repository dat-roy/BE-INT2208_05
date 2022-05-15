const userRouter = require('./user.route.js');
const postRouter = require('./post.route.js');
const siteRouter = require('./site.route.js');
const conversationRouter = require('./conversation.route.js');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/dashboard', postRouter);
    app.use('/', siteRouter);
    app.use('/chat', conversationRouter);
}

module.exports = initRoutes;
