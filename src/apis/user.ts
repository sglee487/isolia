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
  return response
}

const uploadProfilePicture = async (user: any, blob: Blob) => {
  const form = new FormData()
  form.append('file', blob)

  const response = await axios.post(`${SERVER_URL}/upload/profile_picture/`, form, {
    headers: {
      Authorization: `Bearer ${user.data.token}`
    }
  })
  return response.data

}

const updateUser = async (user: any, picture32: string, picture96: string, displayName: string, password: string, newPassword: string) => {
  const data = {
    'login_type': user.data.login_type,
    'picture_32': picture32,
    'picture_96': picture96,
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
  return response.data
}

export { registerUser, loginUser, checkToken, updateUser, uploadProfilePicture }