const express = require('express')              /* подключаем пакет express */
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()                           /* app (сервер) является результатом работы express*/


// middleware для парсинга в json 1:33:00
app.use(express.json({ extended : true }))

// Регистрируем роуты для обработки запросов с frontend
app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/link', require('./routes/link.routes'))


if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = config.get('port') || 5000         /* если порт не определен, то по умолчанию - 5000 */


async function start() {
    try{
        await mongoose.connect(config.get('mongoUri'), {    /* 1 параметр - uri БД*/
            //useNewUrlParser: true,
            //useUnifiedTopology: true,

        })
        app.listen(PORT, ()=> console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()


