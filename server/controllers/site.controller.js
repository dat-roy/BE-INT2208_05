const QRcode = require('qrcode');
const dotenv = require('dotenv');
dotenv.config();

const {FRONTEND_HOST, FE_PORT} = process.env;

class siteController {
    // [GET] /
    home(req, res) {
        res.render('index');
    }
    // [POST] /share/qr
    shareByQR(req, res) {
        const url = `http://${FRONTEND_HOST}:${FE_PORT}`;
        QRcode.toDataURL(url, function (err, qr_url) {    
            if (err) {
                res.status(500).json({
                    message: `Error when generate a QR code`,
                    error: err,
                })
            } else {
                //res.send('<img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src=' + qr_url + '>');
                res.status(200).json({
                    message: `Generate a QR code successfully`,
                    qr_url: qr_url,
                })
            }
        });
    }
}

module.exports = new siteController();
