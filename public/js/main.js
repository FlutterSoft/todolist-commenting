const deleteBtn = document.querySelectorAll('.del') // creates array of delete buttons (from class del)
const todoItem = document.querySelectorAll('.todoItem span') // creates array of todoItems from all spans in todoItem class
const todoComplete = document.querySelectorAll('.todoItem span.completed') // creates array of todo items that are completed from the spans with a completed class inside a todoItem class 

Array.from(deleteBtn).forEach((el)=>{ // for each delete button do the following 
    el.addEventListener('click', deleteTodo) // add a click event listener to the element (the button) that runs the function deleteTodo
})

Array.from(todoItem).forEach((el)=>{ // for each todo item do the following 
    el.addEventListener('click', markComplete) // add a click event listener to the element (the span) that runs the function markComplete
})

Array.from(todoComplete).forEach((el)=>{ // array from the completed todo items
    el.addEventListener('click', undo) // add a click even listener to each element (the span) that runs the function undo
})

async function deleteTodo(){ // delete function 
    const todoText = this.parentNode.childNodes[1].innerText // sets variable todoText to be the text of the item clicked
    try{
        const response = await fetch('deleteTodo', { // sets the variable response to be the response of the fetch
            method: 'delete', // sets the fetch to be a delete request
            headers: {'Content-type': 'application/json'}, // sets the content type to be json
            body: JSON.stringify({ // turns the body into json
                'rainbowUnicorn': todoText // sets the rainbowUnicorn property to the todoText variable ( the todo item )
            })
        })
        const data = await response.json() // sets the variable 'data' to be the json of response
        console.log(data) // logs message
        location.reload() // reloads the page
    }catch(err){
        console.log(err) // logs error 
    }
}

async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}