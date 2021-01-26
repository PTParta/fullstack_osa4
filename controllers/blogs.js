const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  const likesIncrementedByOne = Number(blog.likes) + 1

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.author,
    likes: likesIncrementedByOne
  }

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(blog.toJSON)
})

module.exports = blogsRouter