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
//Tulevan varalta funktio nonExistingId,
//jonka avulla on mahdollista luoda tietokanta-id, joka ei kuulu millekään kannassa olevalle oliolle.
/* const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
} */

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}