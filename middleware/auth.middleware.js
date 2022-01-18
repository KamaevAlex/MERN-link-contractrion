const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]

        if(!token) {
           return  res.status(401).json({ message: 'Рет авторизации' })
        }
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded
        next()
    }catch (e) {
        res.status(401).json({ message: 'Рет авторизации' })
    }
}

// next - метод, который позволяет продолжитьт выполнение запроса
// метод 'OPTIONS' это метод rest API, проверяющий доступность сервера.
// req.headers.authorization строка "Bearer TOKEN" далее распарсиваем split и забираем первый элемент - TOKEN