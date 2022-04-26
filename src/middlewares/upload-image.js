const path = require('path');
const multer = require('multer');

// [Multer]
// Handling multipart/form-data for file uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/upload/avatar/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage});

module.exports = upload;