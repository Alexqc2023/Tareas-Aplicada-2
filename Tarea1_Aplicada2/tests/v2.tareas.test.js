import request from 'supertest'
import app from '../src/app.js'
import { prisma } from '../src/db.js'

let userToken, adminToken

let userId, adminId

let tareaUserId

beforeAll(async () => {
  
  await prisma.tarea.deleteMany()
  await prisma.usuario.deleteMany()

  
  const normalUser = await request(app).post('/auth/registro').send({
    nombre: 'Normal User',
    email: 'normal@test.com',
    password: '123',
    rol: 'usuario'
  })
  userId = normalUser.body.id

 
  const adminUser = await request(app).post('/auth/registro').send({
    nombre: 'Admin User',
    email: 'admin@test.com',
    password: '123',
    rol: 'admin'
  })
  adminId = adminUser.body.id


  const loginUser = await request(app).post('/auth/login').send({ email: 'normal@test.com', password: '123' })
  userToken = loginUser.body.token

  const loginAdmin = await request(app).post('/auth/login').send({ email: 'admin@test.com', password: '123' })
  adminToken = loginAdmin.body.token


  const tarea = await prisma.tarea.create({
    data: { titulo: 'Tarea de usuario', usuarioId: userId }
  })
  tareaUserId = tarea.id
})

afterAll(async () => {
  await prisma.$disconnect()
})


describe('GET /v2/tareas', () => {
  it('deberia rechazar sin token', async () => {
    const res = await request(app).get('/v2/tareas')
    expect(res.status).toBe(401)
  })

  it('deberia rechazar con token invalido', async () => {
    const res = await request(app).get('/v2/tareas')
      .set('Authorization', 'Bearer token_falso')
    expect(res.status).toBe(401)
  })

  it('deberia devolver las tareas al usuario normal', async () => {
    const res = await request(app).get('/v2/tareas')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deberia devolver todas las tareas al admin', async () => {
    const res = await request(app).get('/v2/tareas')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})


describe('DELETE /v2/tareas/:id', () => {
  it('usuario no puede borrar tarea de otro', async () => {
   
    const tareaAdmin = await prisma.tarea.create({
      data: { titulo: 'Secreta Admin', usuarioId: adminId }
    })
    
  
    const res = await request(app).delete(`/v2/tareas/${tareaAdmin.id}`)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.status).toBe(403) 
  })

  it('usuario puede borrar su propia tarea', async () => {
    const res = await request(app).delete(`/v2/tareas/${tareaUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('mensaje')
  })

  it('admin puede borrar cualquier tarea', async () => {
    
    const otraTarea = await prisma.tarea.create({
      data: { titulo: 'Otra tarea', usuarioId: userId }
    })

   
    const res = await request(app).delete(`/v2/tareas/${otraTarea.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.status).toBe(200)
  })
})



