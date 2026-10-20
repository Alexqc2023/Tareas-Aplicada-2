import request from 'supertest';
import app from '../src/app.js';
import{prisma} from '../src/db.js'

beforeAll(async () => {
  
  await prisma.tarea.deleteMany();
  
  await prisma.usuario.deleteMany();
})

afterAll(async () => {
    await prisma.$disconnect();
})

describe('POST /auth/registro', () => {


  if ('deberia hacer login exitosamente', async () => {

    const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password123'
    })


    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('deberia rechazar con password incorrecta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'clave_equivocada'
      })

    
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('deberia rechazar si el email no existe', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'fantasma@test.com',
        password: 'password123'
      })

    
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('deberia rechazar sin credenciales', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({}) 

    
    expect(res.status).toBeGreaterThanOrEqual(400)
  })
})

  
  
  it('deberia registrar un usuario exitosamente', async () => {
    
    const res = await request(app)
      .post('/auth/registro')
      .send({
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        rol: 'usuario'
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('nombre', 'Test User')
      expect(res.body).not.toHaveProperty('password')
    })

    it('deberia rechazar un email duplicado', async () => {
      const res = await request(app)
      .post('/auth/registro')
      .send({
        nombre: 'Otro User',
        email: 'test@test.com', 
        password: 'password123',
        rol: 'usuario'
      })


      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it('deberia rechazar registro sin email', async () => {
    const res = await request(app)
      .post('/auth/registro')
      .send({
        nombre: 'Test User',
        password: 'password123'
        
      })


      expect(res.status).toBeGreaterThanOrEqual(400) 
  })

  it('deberia rechazar registro sin password', async () => {
    const res = await request(app)
      .post('/auth/registro')
      .send({
        nombre: 'Test User',
        email: 'test2@test.com'
        
      })

    expect(res.status).toBeGreaterThanOrEqual(400)
  })


