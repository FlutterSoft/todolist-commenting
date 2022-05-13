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

app.post('/createTodo', (req, res)=>{ // post request to create a new item
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // goes to the collection called 'todos' and inserts a new item, the todo being the body of the request and completed being false
    .then(result =>{ // after that
        console.log('Todo has been added!') // log message
        res.redirect('/') // refresh page by running the get 
    })
})

app.put('/markComplete', (req, res)=>{  // put request to change item 'completed' to true
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  // go to the database, find collections 'todos' update one item, by finding the todo with the property of the request body
        $set: {
            completed: true // set the completed property to true
        }
    })
    .then(result =>{
        console.log('Marked Complete') // then log a message
        res.json('Marked Complete') // then respond with the json message
    })
})

app.put('/undo', (req, res)=>{ // put request to mark item is not completed 
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // finds the 'todo's collection in the database, updates one item that matches the request body
        $set: {
            completed: false  // sets the completed property to false
        }
    })
    .then(result =>{ // after that is completed 
        console.log('Marked Complete') // log a message
        res.json('Marked Complete') // respond with json message
    })
})

app.delete('/deleteTodo', (req, res)=>{ // request to delete an item 
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // finds the 'todos' collection in the database, deletes one item that matches the request body 
    .then(result =>{
        console.log('Deleted Todo') // then logs a message
        res.json('Deleted It') // then returns json message
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{  // what port to listen for requests
    console.log('Server is running, you better catch it!') //logs message when server starts
})    