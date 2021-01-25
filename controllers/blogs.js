const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

  let blog
  if (request.body.likes !== '') {
    blog = new Blog(request.body)
  } else {
    request.body.likes = 0
    blog = new Blog(request.body)
  }

  if (blog.title === '' || blog.url === '') {
    response.status(400).json(blog.toJSON())
  } else {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  }
})

module.exports = blogsRouter