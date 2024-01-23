const express = require('express')
const app = express()
const { Todo } = require('./models')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.set('views', './views');


app.set("view engine","ejs");

app.get("/", async (request,response)=>{
  const allTodos = await Todo.getTodos();
  if(request.accepts('html')){
    response.render('index',{allTodos});
  }
  else{
    response.json({allTodos})
  }
})

app.get('/todos', async (request, response) => {
  console.log('todo list')
 
  try {
    const todos = await Todo.findAll();
    const formattedTodos = todos.map(todo => ({
      id: todo.id,
      name: todo.title, 
      dueDate: todo.dueDate,
      completed: todo.completed
    }));

    return response.json(formattedTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/todos', async (request, response) => {
  console.log('creating todo list', request.body)

  try {
    const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false })
    return response.json(todo)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.put('/todos/:id/markAsCompleted', async (request, response) => {
  console.log('we have to upadate todo with ID', request.params.id)
  const todo = await Todo.findByPk(request.params.id)
  try {
    const updatedTodo = await todo.markAsCompleted()
    return response.json(updatedTodo)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.delete('/todos/:id', async (request, response) => {
  console.log('delete todo by ID', request.params.id)
    const todoId = request.params.id;
    console.log('delete todo by ID', todoId);
  
    try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        return response.status(404).json({ success: false, message: 'Todo not found' });
      }
  
      await todo.destroy();
  
      return response.json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


module.exports=app;
