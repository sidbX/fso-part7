import { useMatch } from 'react-router-dom'
import BlogService from '../services/blogs'
import { useState } from 'react'
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material'

const CommentSection = ({ comments }) => {
  return (
    // <ul>
    //   {comments.map((comment) => (
    //     <li key={comment._id}>{comment.body}</li>
    //   ))}
    // </ul>
    <List>
      {comments.map((comment) => (
        <ListItem key={comment._id}>
          <ListItemText primary={comment.body} />
        </ListItem>
      ))}
    </List>
  )
}

const BlogDetails = ({ blog, deleteBlog, likeBlog, loggedInUser }) => {
  const [comments, setComments] = useState(blog.comments)

  const handleClickLike = async () => {
    // try {
    //   const updatedBlog = await blogService.addLike(blogId, likes + 1)
    //   setLikes(likes + 1)
    //   console.log(updatedBlog)
    // } catch (exception) {
    //   alert(exception.message)
    // }
    await likeBlog(blog)
  }

  const handleRemoveBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      // await blogService.deleteBlog(blog)
      await deleteBlog(blog)
    }
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    const res = await BlogService.addComment(blog, event.target.comment.value)
    // console.log(res)
    setComments(res.comments)
    event.target.comment.value = ''
  }

  const fullDetails = () => (
    <>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <br />
        <span>{blog.likes} likes</span>
        {/* <button
          id="likeButton"
          type="button"
          onClick={() => handleClickLike(blog)}
        >
          like
        </button> */}
        <Button
          variant="contained"
          id="likeButton"
          type="button"
          onClick={() => handleClickLike(blog)}
        >
          like
        </Button>
        <br />
        added by {blog.user.username}
        {loggedInUser.username === blog.user.username && (
          <div>
            <button type="button" onClick={handleRemoveBlog}>
              remove
            </button>
          </div>
        )}
      </div>
      <Typography sx={{ mt:3,mb:1 }} variant='h6'>comments</Typography>
      <form onSubmit={handleCommentSubmit}>
        {/* <input id="comment" type="text" name="comment" /> */}
        {/* <button type="submit">add comment</button> */}
        <TextField
          variant="outlined"
          id="comment"
          name="comment"
          size="small"
        />
        <Button sx={{ ml:2 }} variant="contained" type="submit">
          add comment
        </Button>
      </form>
      <CommentSection comments={comments} />
    </>
  )

  return fullDetails()
  // <div>
  //   <h1>{blog.title}</h1>
  //   <div>
  //     <a href={blog.url}>{blog.url}</a>
  //   </div>
  //   {blog.likes} likes
  //   <button>like</button>
  //   <div>added by {blog.user.username}</div>
  // </div>
}

export default BlogDetails
