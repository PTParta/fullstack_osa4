const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'ruokablogi 111',
    author: 'Eeva',
    url: 'eeva.com',
    likes: '11'
  },
  {
    title: 'ruokablogi 222',
    author: 'Maija',
    url: 'maija.com',
    likes: '22'
  },
  {
    title: 'ruokablogi 333',
    author: 'Mikko',
    url: 'mikko.com',
    likes: '33'
  },
  {
    title: 'ruokablogi 444',
    author: 'Hanna',
    url: 'hanna.com',
    likes: '44'
  },

]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


describe('database tests', () => {
  test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
  })

  test('blog identifier name is "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('adding a blog increases the blogs amount by one and the added blog is among the blogs', async () => {
    const newBlog = {
      title: 'ruokablogi 555',
      author: 'Lauri',
      url: 'lauri.com',
      likes: '55'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const authors = response.body.map(r => r.author)
    const urls = response.body.map(r => r.url)
    const likes = response.body.map(r => r.likes)

    expect(response.body).toHaveLength(2 + 1)
    expect(authors).toContain('Lauri')
    expect(urls).toContain('lauri.com')
    expect(likes).toContain(55)

  })
})

test('when adding a new blog if "likes" has no value it is set to 0', async () => {
  const newBlog = {
    title: 'ruokablogi 555',
    author: 'Lauri',
    url: 'lauri.com',
    likes: ''
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const addedBlog = await Blog.find({ title: newBlog.title })
  expect(addedBlog[0].likes).toBe(0)
})

test('when adding a new blog if both "title" and "url" are not given response will be "400 Bad request"', async () => {
  const newBlog1 = {
    title: '',
    author: 'Lauri',
    url: 'lauri.com',
    likes: ''
  }
  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const newBlog2 = {
    title: 'ruokablogi 555',
    author: 'Lauri',
    url: '',
    likes: ''
  }
  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const newBlog3 = {
    title: '',
    author: 'Lauri',
    url: '',
    likes: ''
  }
  await api
    .post('/api/blogs')
    .send(newBlog3)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})