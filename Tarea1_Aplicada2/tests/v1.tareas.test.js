import request from 'supertest'
import app from '../src/app.js'
import { prisma } from '../src/db.js'

let testUser

beforeAll(async () => {
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()

  testUser = await prisma.usuario.create({
    data: {
      nombre: 'User V1',
      email: 'v1@test.com',
      password: '123'
    }
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})


describe('GET /v1/tareas', () => {
  it('deberia devolver tareas con API Key valida', async () => {
    const res = await request(app)
      .get('/v1/tareas')
      .set('x-api-key', 'Alexis123') 

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deberia rechazar sin API Key', async () => {
    const res = await request(app)
      .get('/v1/tareas')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('deberia rechazar con API Key incorrecta', async () => {
    const res = await request(app)
      .get('/v1/tareas')
      .set('x-api-key', 'llave_falsa_inventada')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})


describe('POST /v1/tareas', () => {
  it('deberia crear una tarea exitosamente', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', 'Alexis123')
      .send({
        titulo: 'Aprobar Aplicada 2',
        usuarioId: testUser.id
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('titulo', 'Aprobar Aplicada 2')
  })

  it('deberia rechazar sin titulo', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', 'Alexis123')
      .send({
        usuarioId: testUser.id
      })

    expect(res.status).toBeGreaterThanOrEqual(400)
  })

  it('deberia rechazar sin API Key aunque este completo', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .send({
        titulo: 'Tarea secreta',
        usuarioId: testUser.id
      })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})