const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')          // модуль для хеширования и сравнивания пароля
const {check, validationResult} = require('express-validator')     // пакет для валидации, метод check и функция validationResult
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')      // подключаем модель User


// Обрабатываем post-запросы:
// api/auth/register
router.post('/register',

    // middle-wares для валидации (из пакета express-validator)
    [
        check('email', 'Некорректный eMail').isEmail(), //isEmail - встроен. из express-validator
        check('password', 'Минимальная длина пароля - 6 символов').isLength({min: 6})
    ],


    async (req, res) => {
    try {
    const errors = validationResult(req)        // обработка валидатора
        if (!errors.isEmpty()){                     // если errors не пустой (есть ошибки)
            return res.status(400).json({           // отпр на frontend статус ошибки и объект (кастомизируется)
                errors: errors.array(),             // приводим errors к массиву
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body         // получаем данные с frontend

        const candidate = await User.findOne({ email: email }) // ждем, пока модель пользователя будет искать пользователя по E-mail

        if (candidate) {
           return res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 12) //хешируем пароль. 2 параметр - salt, для лучшей защиты

        const user = new User ({email, password: hashedPassword}) // создаем нового пользователя

        await user.save()  // ждем, пока сохранится
        res.status(201).json({message: 'Пользователь создан'}) // код 201 - при создании

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})



// api/auth/login
router.post('/login',

    [
        check('email', 'Введите корректный eMail').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()

    ],

    async (req, res) => {
        try {
            const errors = validationResult(req)        // обработка валидатора
            if (!errors.isEmpty()) {                     // если errors не пустой (есть ошибки)
                return res.status(400).json({           // отпр на frontend статус ошибки и объект (кастомизируется)
                    errors: errors.array(),             // приводим errors к массиву
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})  // ищем ОДНОГО пользователя по eMail

            if (!user) {
                return res.status(400).json({message: 'пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password) // (пароль с frontEnd, пароль из базы)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль'})
            }

    // Авторизация через jwt-token (генер. через библиотеку jsonwebtoken)

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),    // from default.json
            {expiresIn: '1h'}    // token will expire in 1 hour
        )

            res.json({token, userId: user.id})


        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })



module.exports = router