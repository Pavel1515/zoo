const {Op} = require('sequelize');
const User = require('../models/User')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const generateAccessToken = (id, role) => {
    const payloud = {
        id, role,
    };
    return jwt.sign(payloud, secret, {expiresIn: "24h"});
};

class AuthControler {
    async registerAndVerify(req, res) {
        try {
            const {mail, phone, password, code} = req.body;

            if (mail && phone && password) {
                // Проверьте, существует ли пользователь с такой почтой или телефоном
                const candidate = await User.findOne({
                    where: {
                        [Op.or]: [{mail: mail}, {phone: phone}],
                    },
                });

                if (candidate) {
                    return res.status(404).json({message: 'Error registration'});
                }

                // Генерируйте случайный код подтверждения
                const confirmationCode = randomstring.generate(6);

                // Создайте учетную запись пользователя
                const hash = bcrypt.hashSync(password, 3);
                const user = await User.create({
                    mail: mail, phone: phone, password: hash, codeVerification: confirmationCode
                });

                // Отправьте письмо с кодом подтверждения
                const transporter = nodemailer.createTransport({
                    service: 'SMTP', // Укажите свой SMTP-сервер или используйте другой метод
                    host: "smtp.gmail.com", port: 465, secure: true, auth: {
                        user: 'ppvr3407@gmail.com', // Ваш email для отправки кода
                        pass: 'Pavel1515', // Пароль от вашей почты
                    },
                });

                const mailOptions = {
                    from: 'your_email@example.com', to: mail, // Отправить код на адрес, указанный при регистрации
                    subject: 'Код подтверждения', text: `Ваш код подтверждения: ${confirmationCode}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({error: 'Не удалось отправить код на почту'});
                    } else {
                        console.log('Код отправлен');
                        return res.status(200).json({message: 'oK'})
                    }
                });
            } else {
                res.status(404).json({message: 'Error registration'});
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async authentication(req, res) {
        try {
            const {phone, password} = req.body;
            if (phone && password) {
                const user = await User.findOne({
                    where: {
                        phone: phone
                    }
                })
                if (!user) res.status(404).json({"message": "Error authentication "});
                if (user.statusVerification) res.status(404).json({"message": "Error Verification "});

                if (bcrypt.compareSync(password, user.password)) {
                    const token = generateAccessToken(user.id, user.role)
                    res.status(200).json({token})
                } else {
                    res.status(404).json({"message": "Error authentication pasword"});
                }
            } else {
                res.status(404).json({"message": "Error authentication "});
            }

        } catch (e) {
            console.log(e)
        }
    }

    async resetPasword(req, res) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const {password, newPassword} = req.body;
            const {id} = jwt.verify(token, secret);
            if (!id) {
                return res.json({"messege": "resetPasword"});
            }
            const userData = await User.findOne({
                where: {
                    id: id,
                },
            });
            if (!userData) {
                return res.json({"messege": "resetPasword"});
            }
            const hash = userData.password;
            if (bcrypt.compareSync(password, hash)) {
                const hashPassword = bcrypt.hashSync(newPassword, 3);
                await Users.update({
                    password: hashPassword,
                }, {
                    where: {
                        id: id,
                    },
                });
                return res.status(200).json({"message": "ok"});

            }
        } catch (e) {
            console.log(e)
        }
    }

    async verificate(req, res) {
        const {mail, code} = req.body;
        const user = await User.findOne({
            where: {
                mail: mail
            }
        })
        if (!user) {
            return res.status(404).json({"messege": "verificate"});
        }
        if (!user.codeVerification === code) {
            return res.status(404).json({"messege": "verificate"});
        }
        await user.update({
            statusVerification: true,
        })
        return res.status(200).json({"messege": "ok"})
    }

    // Изменить пароль
    async changePassword(req, res) {
        const token = req.headers.authorization.split(" ")[1];
        const {id} = jwt.verify(token, secret);
        const {password} = req.body;
        const hash = bcrypt.hashSync(password, 3);
        const user = await User.findOne({
            where: {
                id: id
            }
        })
        if (hash === user.password) {
            await User.update({
                password: hash
            }, {
                where: {
                    id: id
                }
            })
            return res.status(200).json({"message": "ok"});


        } else {
            return res.status(400).json({"message": "Erorr changePassword"});
        }
    }
}

module.exports = new AuthControler();