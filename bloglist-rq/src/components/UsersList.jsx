import { useEffect, useState } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

const UsersList = () => {
  const [users, setUsers] = useState([])
  // userService.getAll().then((users) => {console.log(users); setUsers(users) })
  useEffect(() => {
    userService.getAll().then((users) => {
      console.log(users)
      setUsers(users)
    })
  }, [])
  return (
    <div>
      {/* <h1>Users</h1> */}
      <Typography variant="h4">Users</Typography>
      {/* <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{<Link to={`/users/${user.id}`}>{user.username}</Link>}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="left">blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* <TableCell component="th" scope="row">
                  {<Link to={`/users/${user.id}`}>{user.username}</Link>}
                </TableCell> */}
                <TableCell component={Link} to={`/users/${user.id}`}>
                  {user.username}
                </TableCell>
                <TableCell align="left">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default UsersList
