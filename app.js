const express = require('express');
const app = express();
const PORT = 3000

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug')

app.get('/', function(req,res) {
    res.render('index')
})


app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server is running on port ${PORT}`)
});