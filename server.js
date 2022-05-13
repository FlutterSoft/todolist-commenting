const express = require('express') //imports express framework
const app = express() // sets variable app to be express so we can use express by simply typing app
const MongoClient = require('mongodb').MongoClient // imports mongodb 
const PORT = 2121 // sets port to a variable
require('dotenv').config() // processes password key

let db, // creates variable db
    dbConnectionStr = process.env.DB_STRING, // creates variable database connection string to connect to the database needed
    dbName = 'todo' // creates variable dbName (database name)

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // connects to database in mongodb
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)  // logs a message when connected
        db = client.db(dbName)  // sets db to be the database connected in previous step
    })
    .catch(err =>{
        console.log(err) // logs error if connection issue
    })

app.set('view engine', 'ejs') // sets express template language engine to be ejs (embedded java script)
app.use(express.static('public')) // allows express to servce up any files in public folder as needed
app.use(express.urlencoded({ extended: true })) // unsure
app.use(express.json()) // allows express to use json

app.get('/', async (req,res)=>{ // get request for homepage
    const todoItems = await db.collection('todos').find().toArray() // sets variable todoItems to be the array of items from the database collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets variable itemsLeft to be the count of the items that have the property completed as false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // renders ejs, tells ejs what data to use
})

app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    