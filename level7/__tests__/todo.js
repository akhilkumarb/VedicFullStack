const request = require('supertest')
const db = require('../models/index')
const app = require('../app')


let server
let agent
describe('Todo test suite', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(3000, () => { })
    agent = request.agent(server)
  })
  afterAll(async () => {
    await db.sequelize.close()
    server.close()
  })
  test('responds with json at /todos', async () => {
    const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false
    })
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8'
    )
    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse.id).toBeDefined()
  })
  test('Mark a todo as complete', async () => {
    const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false
    })
    const parsedResponse = JSON.parse(response.text)
    const todoID = parsedResponse.id

    expect(parsedResponse.completed).toBe(false)

    const markCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send()
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text)
    expect(parsedUpdateResponse.completed).toBe(true)
  })

  test('Delete a todo by ID', async () => {
    // Create a new todo
    const createResponse = await agent.post('/todos').send({
      title: 'Buy groceries',
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const createdTodo = JSON.parse(createResponse.text);

    const deleteResponse = await agent.delete(`/todos/${createdTodo.id}`).send();

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.header['content-type']).toBe('application/json; charset=utf-8');

    const parsedDeleteResponse = JSON.parse(deleteResponse.text);
    expect(parsedDeleteResponse.success).toBe(true);
    expect(parsedDeleteResponse.message).toBe('Todo deleted successfully');
  });
})
