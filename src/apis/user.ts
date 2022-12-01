import axios from 'axios'

const SERVER_URL = `
${import.meta.env.VITE_SERVER_PROTOCOL}://
${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT
  }`

const registerUser = async (loginType: string, username: string, email: string, password?: string) => {
  const data = {
    'login_type': loginType,
    'display_name': username,
    'email': email,
  }

  if (password) {
    data['password'] = password
  }

  const response = await axios.post(`${SERVER_URL}/user/`, data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const loginUser = async (loginType: string, email: string, password?: string) => {
  const data = {
    'login_type': loginType,
    'email': email,
  }

  if (password) {
    data['password'] = password
  }

  const response = await axios.post(`${SERVER_URL}/login/`, data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const refreshToken = async (userToken: string) => {
  const response = await axios.get(`${SERVER_URL}/token/`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    }
  })
  return response
}

const updateUser = async (user: any, name: string, password: string, newPassword: string) => {
  const data = {
    'email': user.data.email,
    'display_name': name,
    'password': password,
    'new_password': newPassword
  }

  const response = await axios.patch(`${SERVER_URL}/user/`, data, {
    headers: {
      Authorization: `Bearer ${user.data.token}`
    }
  })
  return response
}

export { registerUser, loginUser, refreshToken, updateUser }