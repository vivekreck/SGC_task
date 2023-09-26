const User = require('../models/user');
const { hashSync, compareSync } = require("bcrypt-nodejs");
const { constants } = require("../configs/constants");
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res, next) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.send(400, {
                msg: "Email and password required"
            })
        } else {
            email = String(email).toLowerCase().trim()
            if (!/^([+.-\w]+)([@])([\w+.-]+\w)([.])(\w+)$/.test(email)) {
                return res.send(400, {
                    msg: "Invalid email"
                })
            }

            password = String(password).trim()
            if (
                !(
                    password.match(/[a-z]/g) &&
                    password.match(/[A-Z]/g) &&
                    password.match(/[0-9]/g) &&
                    password.match(/[^a-zA-Z\d]/g) &&
                    password.length >= 8 &&
                    password.length <= 30
                )) {

                return res.send(400, {
                    msg: "Password should contain at-least one capital letter, at-least one small letter, a number and should be greater than 8 characters."
                })
            }
        }

        const user = await User.findOne({
            where: {
                email: email,
            }
        });
        if (!user) {
            return res.send(400, {
                msg: "There is not any account with this email Id!"
            })
        }
        if (!compareSync(password, user.password)) {
            return res.send(401, {
                msg: `Password must be correct!`
            })
        }
        const jwtToken = jwt.sign({ email: user.email }, constants.JWT_SECRET, { expiresIn: '1d' });

        return res.send(200, {
            email: user.email,
            jwtToken,
            msg: `Sign In successfully!`
        })

    } catch (err) {
        console.log(err)
        return res.send(500, {
            msg: `Something went wrong, Plese try again later!`
        });
    }
};

module.exports.signup = async (req, res, next) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.send(400, {
                msg: "Email and password required"
            })
        } else {
            email = String(email).toLowerCase().trim()
            if (!/^([+.-\w]+)([@])([\w+.-]+\w)([.])(\w+)$/.test(email)) {
                res.send(400, {
                    msg: "Invalid email"
                })
            }

            password = String(password).trim()
            if (
                !(
                    password.match(/[a-z]/g) &&
                    password.match(/[A-Z]/g) &&
                    password.match(/[0-9]/g) &&
                    password.match(/[^a-zA-Z\d]/g) &&
                    password.length >= 8 &&
                    password.length <= 30
                )) {

                return res.send(400, {
                    msg: "Password should contain at-least one capital letter, at-least one small letter, a number and should be greater than 8 characters."
                })
            }
        }
        const userExist = await User.findOne({
            where: {
                email: email,
            }
        });
        if (userExist) {
            return res.send(400, {
                msg: "`User already Exist`"
            });
        }

        let newUser = await User.create({
            email,
            password: hashSync(password)
        })

        return res.send(201, {
            msg: "User created succefully"
        });
    } catch (err) {
        console.log(err)
        return res.send(500, {
            msg: `Something went wrong, Plese try again later!`
        });
    }
};

module.exports.updateUserData = async (req, res, next) => {
    let { name, about_artist, email, shop_banner, about_store, academics, exhibitions } = req.body;
    try {
        const data = {};

        if (name) data.name = name;
        if (about_artist) data.about_artist = about_artist;
        if (shop_banner) data.shop_banner = shop_banner;
        if (about_store) data.about_store = about_store;

        if (email) {
            email = String(email).toLowerCase().trim()
            if (!/^([+.-\w]+)([@])([\w+.-]+\w)([.])(\w+)$/.test(email)) {
                return res.send(400, {
                    msg: "Invalid email"
                })
            }
            data.email = email
        }
        if (academics)
            data.academics = JSON.stringify(academics);

        if (exhibitions)
            data.exhibitions = JSON.stringify(exhibitions);

        if (req.file) {
            data.profile_photo = req.file.originalname
        }

        await User.update(data, {
            where: {
                email: req.email,
            },
        });

        // updated data
        const user = await User.findOne({
            where: {
                email: data.email || req.email,
            },
            attributes: [
                ['profile_photo', 'profile_photo'],
                ['name', 'name'],
                ['email', 'email'],
                ['about_artist', 'about_artist'],
                ['shop_banner', 'shop_banner'],
                ['about_store', 'about_store'],
                ['academics', 'academics'],
                ['exhibitions', 'exhibitions'],
            ]
        });
        if (user.academics) user.academics = JSON.parse(user.academics)
        if (user.exhibitions) user.exhibitions = JSON.parse(user.exhibitions)

        if (user.profile_photo) {
            user.profile_photo =
                constants.host + '/' + user.profile_photo
        }

        return res.send(200, {
            user,
            msg: "User updated successfully",
        });
    } catch (err) {
        console.log(err)
        return res.send(500, {
            msg: `Something went wrong, Plese try again later!`
        });
    }
};

module.exports.fetchUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.email,
            },
            attributes: [
                ['profile_photo', 'profile_photo'],
                ['name', 'name'],
                ['email', 'email'],
                ['about_artist', 'about_artist'],
                ['shop_banner', 'shop_banner'],
                ['about_store', 'about_store'],
                ['academics', 'academics'],
                ['exhibitions', 'exhibitions'],
            ]
        });
        if (!user) {
            return res.send(400, {
                msg: `User doesn't Exist`
            });
        }
        if (user.academics) user.academics = JSON.parse(user.academics)
        if (user.exhibitions) user.exhibitions = JSON.parse(user.exhibitions)

        if (user.profile_photo) {
            user.profile_photo =
                constants.host + user.profile_photo
        }
        return res.send(200, {
            msg: "User fetched successfully",
            user
        });
    } catch (err) {
        console.log(err)
        return res.send(500, {
            msg: `Something went wrong, Plese try again later!`
        });
    }
};

