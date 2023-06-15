import axios from 'axios'

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

const uploadImages = async (userToken: string, files: [File]) => {
  const formData = new FormData()
  for (var i = 0; i < files.length; i++) {
    formData.append('imageFiles', files[i]);
  }

  const response = await axios.post(`${SERVER_URL}/post/images/`, formData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

const getListBoard = async (menu: string, page: number) => {
  const response = await axios.get(`${SERVER_URL}/board`, {
    params: {
      boardType: menu.toUpperCase(),
      // page: page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const getPost = async (id: number) => {
  const response = await axios.get(`${SERVER_URL}/post/${id}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const postBoard = async (boardType: string, boardTitle: string, boardContent: string, userToken: string) => {

  const data = {
    'boardType': boardType.toUpperCase(),
    'title': boardTitle,
    'content': boardContent
  }

  const response = await axios.post(`${SERVER_URL}/board`, data, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  });
  return response
}

const postComment = async (boardId: number, content: string, userToken: string) => {
  const data = {
    'content': content
  }

  const response = await axios.post(`${SERVER_URL}/comment/${boardId}`, data, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  });
  return response
}

export { uploadImages, getListBoard, getPost, postBoard, postComment }