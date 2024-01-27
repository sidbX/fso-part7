import { useEffect, useState } from 'react'
import userService from '../services/users'
import { useMatch } from 'react-router-dom'
import { List, ListItem, ListItemText, Typography } from '@mui/material'

const UserDetails = () => {
  const match = useMatch('/users/:id')
  const [user, setUser] = useState(null)
  useEffect(() => {
    userService.getUserWithId(match.params.id).then((user) => {
      console.log(user)
      setUser(user)
    })
  }, [])
  return (
    user !== null && (
      <div>
        <Typography variant="h4">{user.username}</Typography>
        <Typography variant="h6">added blogs</Typography>
        {/* <h1>{user.username}</h1> */}
        {/* <h2>added blogs</h2> */}
        {/* <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul> */}
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <ListItemText primary={blog.title} />
            </ListItem>
          ))}
        </List>
      </div>
    )
  )
}

export default UserDetails
