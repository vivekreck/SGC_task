const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();
const { isAuth } = require('../middleware/is-auth');
const multer = require("multer");
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname + "/../documents"));
        },
        filename: (req, file, cb) => {
            cb(null, file?.originalname?.replace(' ', '_'));
        }
    }),
    limits: { fileSize: 52428800 }, // 50 MB
    fileFilter: (req, file, cb) => {
        const formates = ['png', 'jpeg', "jpg"];
        if (!formates.includes(file?.originalname?.split('.')[1])) {
            req.fileValidationError = true;
            return cb(null, false);
        }
        cb(null, true);
    }
})

// /user/signup => POST
router.post('/signup', userController.signup);

// /user/login => POST
router.post('/login', userController.login);

// /user/update => PATCH
router.patch('/update', upload.single("img"), isAuth, userController.updateUserData);

// /user/get => GET
router.get('/get', isAuth, userController.fetchUser);

module.exports = router;
