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
app.get('/', async function(req,res) {
    let workers = null;
    try {
        workers = await Worker.findAll()

        let id = req.query.id != undefined ? req.query.id : undefined
        let deleted = req.query.deleted == 'true' ? true : false
        let updated = req.query.updated == 'true' ? true : false

        res.render('index', {
            workers: workers,
            id: id,
            deleted: deleted,
            updated: updated
        })

    } catch {
        workers= []
        res.render('index', { workers: workers })
    }
})

// GET : /CREATE
app.get('/Create', (req, res) => {
    res.render('create-update')
})

// POST : /CREATE-NEW-RECORD
app.post('/create-new-record', async (req, res) => {
    let worker = await Worker.create(req.body)
    res.redirect(`/?id=${ worker.id }`)
})

// EDIT
app.get('/edit/:id', async (req, res) => {
    let id = req.params.id
    let worker = await Worker.findByPk(id)
    res.render('create-update', { worker: worker })
})

// UPDATE
app.post('/update/:id', async (req, res) => {
    let id = req.params.id
    let result = await Worker.update({
        fullName: req.body.fullName,
        department: req.body.department,
        bio: req.body.bio 
    }, {
        where: {
            id: id
        }
    })

    res.redirect('/?updated=true')
})

// DELETE
app.get('/delete/:id', async (req, res) => {
    let id = req.params.id

    let result = await Worker.destroy({
        where: {
            id: id
        }
    })

    res.redirect(`/?deleted=true`)
})

// SINGLE WORKER
app.get('/:id', async function(req,res){
    let id = req.params.id

    let worker = await Worker.findByPk(id)

    res.render('worker', {
        worker: worker
    })

})


// APP LISTEN PORT
app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server is running on port ${PORT}`)
});