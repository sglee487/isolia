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

const loginUser = async (loginType: string, email: string, password: string, snsToken: string) => {
  const data = {
    'login_type': loginType,
    'email': email,
    'password': password,
    'sns_token': snsToken
  }

  const response = await axios.post(`${SERVER_URL}/login/`, data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const checkToken = async (userToken: string) => {
  const response = await axios.get(`${SERVER_URL}/token/`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    }
  })
  console.log(response)
  return response
}

const updateUser = async (user: any, displayName: string, password: string, newPassword: string) => {
  const data = {
    'login_type': user.data.login_type,
    'email': user.data.email,
    'display_name': displayName,
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

export { registerUser, loginUser, checkToken, updateUser }