class siteController {
    // [GET] /
    home(req, res) {
        res.render('index');
    }
}

module.exports = new siteController();
