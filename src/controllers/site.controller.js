class siteController {
    // [GET] /home
    home(req, res) {
        res.render('index');
    }
}

module.exports = new siteController();
