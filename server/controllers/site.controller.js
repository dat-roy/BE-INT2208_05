const QRcode = require('qrcode');
const dotenv = require('dotenv');
dotenv.config();

const {FRONTEND_HOST} = process.env;

class siteController {
    // [GET] /
    home(req, res) {
        res.render('index');
    }
    // [POST] /share/qr
    shareByQR(req, res) {
        //const url = `https://${FRONTEND_HOST}`;
        const {url} = req.body;
        if (! url) {
            return res.status(404).json({
                message: `URL is empty`,
                error: `empty`,
                qr_url: null,
            })
        }
        QRcode.toDataURL(url, function (err, qr_url) {    
            if (err) {
                res.status(500).json({
                    message: `Error when generate a QR code`,
                    error: err,
                    qr_url: null,
                })
            } else {
                //res.send('<img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src=' + qr_url + '>');
                res.status(200).json({
                    message: `Generate a QR code successfully`,
                    error: null,
                    qr_url: qr_url,
                })
            }
        });
    }
}

module.exports = new siteController();
