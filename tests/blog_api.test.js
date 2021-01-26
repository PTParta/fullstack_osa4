const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('database / router tests', () => {
  test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
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

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(authors).toContain('Lauri')
    expect(urls).toContain('lauri.com')
    expect(likes).toContain(55)
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

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.blogsInDb()

    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const ids = notesAtEnd.map(r => r.id)

    expect(ids).not.toContain(blogToDelete.id)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdateAtStart = blogsAtStart[0]
    const likesAtStart = blogToUpdateAtStart.likes

    await api
      .put(`/api/blogs/${blogToUpdateAtStart.id}`)
      .expect(200)

    const blogToUpdateAtEnd = await Blog.findById(blogToUpdateAtStart.id)
    expect(blogToUpdateAtEnd.likes).toBe(likesAtStart + 1)
  })
})
afterAll(() => {
  mongoose.connection.close()
})