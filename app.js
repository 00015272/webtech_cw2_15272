//THIRD-PARTY APIs
const express = require('express')
const app = express()
const PORT = 3000

// DATABASE SETUP
let db = require('./database')
let Worker = require('./models')

db.sync({force: true }).then(() => 'DB is ready...')

// SET UP
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug')

// ROOT-URL
app.get('/', function(req,res) {
    res.render('index')
})


// APP LISTEN PORT
app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server is running on port ${PORT}`)
});