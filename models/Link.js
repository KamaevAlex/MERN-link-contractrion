const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
    from: {type: String, required: true},
    to: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now},
    clicks: {type: Number, default: 0},
    owner: {type: Types.ObjectId, ref: 'User'}
})

// экспортируем из файла результат работы функции model, где мы даем название нашей модели 'User',
// который работает по схеме schema
module.exports = model('Link', schema)
