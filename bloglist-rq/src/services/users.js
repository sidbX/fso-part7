import axios from 'axios'

const baseUrl = '/api/users'

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data)
}

const getUserWithId = (id) => {
  return axios.get(baseUrl).then((res) => {
    return res.data.find(user => user.id === id)
  })
}

export default { getAll, getUserWithId }
