const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  if (blogs.length === 0) {
    return 0
  } else {
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    return blogs.map(blog => blog.likes).reduce(reducer)
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0]
  } else {
    let maxLikes = 0
    let maxLikesIndex = 0
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].likes > maxLikes) {
        maxLikes = blogs[i].likes
        maxLikesIndex = i
      }
    }
    return blogs[maxLikesIndex]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}