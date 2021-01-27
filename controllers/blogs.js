const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const user = await User.findById(request.body.userId)

  let blog
  if (request.body.likes !== '') {
    blog = new Blog(request.body)
    blog.user = user._id
  } else {
    request.body.likes = 0
    blog = new Blog(request.body)
    blog.user = user._id
  }

  if (blog.title === '' || blog.url === '') {
    response.status(400).json(blog.toJSON())
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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