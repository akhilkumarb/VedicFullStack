const request = require('supertest')
const db = require('../models/index')
const app = require('../app')
var cheerio=require("cheerio")
const { application } = require('express')

let server
let agent
function extractCsrfToken(res){
  var $=cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe('Todo test suite', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(4040, () => { })
    agent = request.agent(server)
  })
  afterAll(async () => {
    await db.sequelize.close()
    server.close()
  })
  test('create a new Todo', async () => {
    const res=await agent.get("/");
    const csrfToken=extractCsrfToken(res);
    const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    })
    expect(response.statusCode).toBe(302)
    // expect(response.header['content-type']).toBe(
    //   'application/json; charset=utf-8'
    // )
    // const parsedResponse = JSON.parse(response.text)
    // expect(parsedResponse.id).toBeDefined()
  })


  test('Mark a todo as complete', async () => {
    let res=await agent.get("/");
    let csrfToken=extractCsrfToken(res);
    const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    })
    const groupedTodoResponse=await agent.get("/").set("Accept","application/json")
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo= parsedGroupedResponse.dueToday[dueTodayCount-1];
    res= await agent.get("/");
    csrfToken=extractCsrfToken(res);
    
    const markCompleteResponse=await agent.put(`/todos/${latestTodo.id}/markAsCompleted`).send({
      _csrf:csrfToken,
    })

    const parsedUpdateResponse=JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true  )
    // const parsedResponse = JSON.parse(response.text)
    // const todoID = parsedResponse.id

    // expect(parsedResponse.completed).toBe(false)

    // const markCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send()
    // const parsedUpdateResponse = JSON.parse(markCompleteResponse.text)
    // expect(parsedUpdateResponse.completed).toBe(true)
  })

//   test('Delete a todo by ID', async () => {
//     // Create a new todo
//     const createResponse = await agent.post('/todos').send({
//       title: 'Buy groceries',
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });

//     const createdTodo = JSON.parse(createResponse.text);

//     const deleteResponse = await agent.delete(`/todos/${createdTodo.id}`).send();

//     expect(deleteResponse.statusCode).toBe(200);
//     expect(deleteResponse.header['content-type']).toBe('application/json; charset=utf-8');

//     const parsedDeleteResponse = JSON.parse(deleteResponse.text);
//     expect(parsedDeleteResponse.success).toBe(true);
//     expect(parsedDeleteResponse.message).toBe('Todo deleted successfully');
//   });
})
