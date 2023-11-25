const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const restAPI = (app) => {
    router.get('/say-hello', (req, res) => {
        return res.json({ msg: "Hello bro" });
    })

    router.post('/create-user', async (req, res) => {
        const { firstName, lastName, email, passWord } = req.body;
        if (!firstName || !lastName || !email || !passWord) {
            return res.status(404).json({ err: "Vui lòng nhập đầy đủ thông tin" });
        }
        if (email == "admin@gmail.com") {
            return res.status(400).json({ err: "Không thể đặt email này" });
        }
        const hashedPassword = await argon2.hash(passWord);
        User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            passWord: hashedPassword,
        })
            .then(user => {
                return res.status(200).json({ msg: 'Tạo tài khoản thành công' })
            })
            .catch(err => { return res.status(500).json({ err: err }) });

    })
    app.use(router);
}

module.exports = restAPI;