const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
    email: {type: String, required: true, unique: true},    // unique - может быть только один пользователь
    password: {type: String, required: true},               // с таким e-mail
    links: [{type: Types.ObjectId, ref: 'Link'}]            // ref - к какой модели мы привязываемся
})

// экспортируем из файла результат работы функции model, где мы даем название нашей модели 'User',
// который работает по схеме schema
module.exports = model('User', schema)
