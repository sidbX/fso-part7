import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import UserContext from './UserContext'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import UsersList from './components/UsersList'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
} from '@mui/material'

const App = () => {
  // const [blogs, setBlogs] = useState([])
  const match = useMatch('/blogs/:id')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  // const [message, setMessage] = useState('')
  const user = useContext(UserContext)[0]
  const userDispatch = useContext(UserContext)[1]
  const createBlogRef = useRef()

  const queryClient = useQueryClient()
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const likeBlogMutation = useMutation({
    mutationFn: (blogToBeLiked) =>
      blogService.addLike(blogToBeLiked.id, blogToBeLiked.likes + 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

  useEffect(() => {
    const cachedUser = window.localStorage.getItem('loggedInUser')
    if (cachedUser) {
      // setUser(JSON.parse(cachedUser))
      userDispatch({ type: 'login', payload: JSON.parse(cachedUser) })
      blogService.setToken(JSON.parse(cachedUser).token)
    }
  }, [])

  const notificationDispatch = useContext(NotificationContext)[1]

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }
  const blogs = result.data
  console.log(blogs)

  const showNotification = (notificationMessage) => {
    // setMessage(notificationMessage)
    // setTimeout(() => {
    //   setMessage('')
    // }, 5000)
    notificationDispatch({
      type: 'showNotifcation',
      payload: notificationMessage,
    })
    setTimeout(() => notificationDispatch({ type: 'removeNotification' }), 5000)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ' + username + ' ' + password)
    try {
      const loggedInUser = await loginService.login({ username, password })
      // setUser(loggedInUser)
      userDispatch({ type: 'login', payload: loggedInUser })
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
      // const createdBlog = await blogService.create(blogToBeCreated)
      createBlogMutation.mutate(blogToBeCreated)
      createBlogRef.current.toggleVisibility()
      // tobe changed
      // setBlogs(blogs.concat(createdBlog))
      showNotification(
        `A new blog '${blogToBeCreated.title}' by ${blogToBeCreated.author} added`,
      )
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const deleteBlog = async (blogToBeDeleted) => {
    try {
      // await blogService.deleteBlog(blogToBeDeleted)
      deleteBlogMutation.mutate(blogToBeDeleted)
      // const updatedBlogs = _.without(blogs, blogToBeDeleted)
      // tobe changed
      // setBlogs(_.without(blogs, blogToBeDeleted))
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const likeBlog = async (blogToBeLiked) => {
    try {
      console.log('blogToBeLiked', blogToBeLiked)
      // likeBlogMutation.mutate( blogToBeLiked.id, blogToBeLiked.likes + 1 )
      likeBlogMutation.mutate(blogToBeLiked)
      // const updatedBlog = await blogService.addLike(
      //   blogToBeLiked.id,
      //   blogToBeLiked.likes + 1,
      // )
      // const newBlogs = _.without(blogs, blogToBeLiked).concat(updatedBlog)
      // tobe changed
      // setBlogs(newBlogs)
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

  const blogsList = () => {
    const listStyle = {
      py: 0,
      width: '100%',
      // maxWidth: 360,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }

    return (
      <>
        {user !== null && (
          <Togglable buttonLabel="create new blog" ref={createBlogRef}>
            <CreateBlogForm createBlog={createBlog} />
          </Togglable>
        )}
        <List sx={listStyle}>
          {blogs
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
        </List>
      </>
    )
  }

  return (
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            {/* <Link style={{ padding: 5 }} to="/">
              blogs
            </Link>
            <Link style={{ padding: 5 }} to="/users">
              users
            </Link> */}
          </Toolbar>
        </AppBar>
        <Notification />
        {user === null && loginForm()}
        {user !== null && (
          <>
            {/* <h2>blogs</h2> */}
            <Typography variant="h2">blogs</Typography>
            {/* <p>
              {user.name} logged in
            </p> */}
            <Typography variant="body1" sx={{ mb:2 }}>
              {user.name} logged in
              <Button
                sx={{ mx:2 }}
                variant="contained"
                type="button"
                onClick={() => {
                  // setUser(null)
                  userDispatch({ type: 'logout' })
                  window.localStorage.removeItem('loggedInUser')
                }}
              >
                logout
              </Button>
            </Typography>
          </>
        )}
        <Routes>
          <Route path="/" element={user !== null && blogsList()} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetails
                blog={
                  match
                    ? blogs.find((blog) => blog.id === match.params.id)
                    : null
                }
                loggedInUser={user}
                deleteBlog={deleteBlog}
                likeBlog={likeBlog}
              />
            }
          />
        </Routes>
      </div>
    </Container>
  )
}

export default App
