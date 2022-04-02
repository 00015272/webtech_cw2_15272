//THIRD-PARTY APIs
const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator');

// PORT
const PORT = 3000

// DATABASE SETUP
let db = require('./database')
let Worker = require('./models')

db.sync({force: false }).then(() => 'DB is ready...')


// SET UP
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug')

// ROOT-URL
app.get('/', async function(req,res) {
    let workers = null;
    // ERROR HANDLING
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
app.post('/create-new-record',
// FORM VALIDATION
body("fullName").isLength({ min: 5 }).withMessage("Name must contain at least 4 letters"),
body("department").isLength({ min: 1 }).withMessage("Department must not be empty"),
body("bio").isLength({ min: 10 }).withMessage("Bio must contain at least 10 letters"),
// HANDLING
async (req, res) => {
    
    const err = validationResult(req)
    let nameError = null
    let departmentError = null
    let bioError = null
    if(!err.isEmpty()) {
        const errors = err.array()
        for (error of errors){
            console.log(error);
            if (error.param == "fullName") {
                nameError = error.msg
            }
            if (error.param == "department") {
                departmentError = error.msg
            }
            if (error.param == "bio") {
                bioError = error.msg
            }
        }
        
        res.render('create-update', { 
            nameError: nameError,
            departmentError: departmentError,
            bioError: bioError
         })
    } else {
        let worker = await Worker.create(req.body)
        res.redirect(`/?id=${ worker.id }`)
    }
})


// EDIT
app.get('/edit/:id', async (req, res) => {
    let id = req.params.id
    let worker = await Worker.findByPk(id)
    res.render('create-update', { worker: worker })
})

// UPDATE
app.post('/update/:id',
// FORM VALIDATION
body("fullName").isLength({ min: 5 }).withMessage("Name must contain at least 4 letters"),
body("department").isLength({ min: 1 }).withMessage("Department must not be empty"),
body("bio").isLength({ min: 10 }).withMessage("Bio must contain at least 10 letters"),
async (req, res) => {
    
    const err = validationResult(req)
    let nameError = null
    let departmentError = null
    let bioError = null
    if(!err.isEmpty()) {
        const errors = err.array()
        for (error of errors){
            if (error.param == "fullName") {
                nameError = error.msg
            }
            if (error.param == "department") {
                departmentError = error.msg
            }
            if (error.param == "bio") {
                bioError = error.msg
            }
        }
        
        let id = req.params.id
        let worker = await Worker.findByPk(id)

        res.render('create-update', { 
            worker: worker,
            nameError: nameError,
            departmentError: departmentError,
            bioError: bioError
        })
    
    } else {    
        let id = req.params.id
        let result = await Worker.update(req.body, {
            where: {
                id: id
            }
        })
        
        res.redirect('/?updated=true')    
    }
    
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