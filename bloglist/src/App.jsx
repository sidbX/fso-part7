import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import {
  showNotification as showNotif,
  removeNotification,
} from './reducers/notificationReducer'
import {
  initializeBlogs,
  addBlog,
  likeBlog as like,
  deleteBlog as deleteB,
} from './reducers/blogReducer'
import { login, logout } from './reducers/userReducer'

const App = () => {
  // const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  const createBlogRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    // blogService.getAll().then((blogs) => setBlogs(blogs))
    blogService.getAll().then((blogs) => dispatch(initializeBlogs(blogs)))
  }, [])

  useEffect(() => {
    const cachedUser = window.localStorage.getItem('loggedInUser')
    if (cachedUser) {
      // setUser(JSON.parse(cachedUser))
      dispatch(login(JSON.parse(cachedUser)))
      blogService.setToken(JSON.parse(cachedUser).token)
    }
  }, [])

  const showNotification = (notificationMessage) => {
    dispatch(showNotif(notificationMessage))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ' + username + ' ' + password)
    try {
      const loggedInUser = await loginService.login({ username, password })
      // setUser(loggedInUser)
      dispatch(login(loggedInUser))
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('Wrong username or password')
    }
  }

  const createBlog = async (blogToBeCreated) => {
    try {
      const createdBlog = await blogService.create(blogToBeCreated)
      createBlogRef.current.toggleVisibility()
      // setBlogs(blogs.concat(createdBlog))
      dispatch(addBlog(createdBlog))
      showNotification(
        `A new blog '${createdBlog.title}' by ${createdBlog.author} added`,
      )
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const deleteBlog = async (blogToBeDeleted) => {
    try {
      await blogService.deleteBlog(blogToBeDeleted)
      dispatch(deleteB(blogToBeDeleted))
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const likeBlog = async (blogToBeLiked) => {
    try {
      const updatedBlog = await blogService.addLike(
        blogToBeLiked.id,
        blogToBeLiked.likes + 1,
      )
      dispatch(like({ blogToBeLiked, updatedBlog }))
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const loginForm = () => (
    <>
      <h1>log in to application</h1>
      <form id="loginForm" onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="loginButton" type="submit">
          Login
        </button>
      </form>
    </>
  )

  const blogs = [...useSelector((state) => state.blogs)]
  const user = useSelector((state) => state.user)
  const blogsList = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button
            type="button"
            onClick={() => {
              // setUser(null)
              dispatch(logout())
              window.localStorage.removeItem('loggedInUser')
            }}
          >
            logout
          </button>
        </p>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              loggedInUser={user}
              deleteBlog={deleteBlog}
              likeBlog={likeBlog}
            />
          ))}
      </>
    )
  }
  return (
    <div>
      <Notification />
      {user === null && loginForm()}
      {/* {user !== null && createBlogForm()} */}
      {user !== null && (
        <Togglable buttonLabel="create new blog" ref={createBlogRef}>
          <CreateBlogForm createBlog={createBlog} />
        </Togglable>
      )}

      {user !== null && blogsList()}
    </div>
  )
}

export default App
