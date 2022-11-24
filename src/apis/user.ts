import axios from 'axios'

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT
  }`

const registerUser = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${SERVER_URL}/user`, { username, email, password })
  return response.data
}

export { registerUser }