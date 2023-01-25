import axios from 'axios'

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

const uploadImages = async (userToken: string, files: [File]) => {
  const formData = new FormData()
  for (var i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await axios.post(`${SERVER_URL}/board/images/`, formData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

const getListBoard = async (menu: string, page: number) => {
  const response = await axios.get(`${SERVER_URL}/board/${menu}/`, {
    params: {
      page: page
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const getPost = async (id: number) => {
  const response = await axios.get(`${SERVER_URL}/board/post/${id}/`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

const postBoard = async (boardType: string, boardTitle: string, boardContent: string, userToken: string) => {
  console.log(boardType, boardTitle, boardContent, userToken)
  console.log(SERVER_URL)

  const data = {
    'board_type': boardType,
    'title': boardTitle,
    'content': boardContent
  }

  const response = await axios.post(`${SERVER_URL}/board/`, data, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  });
  return response
}

export { getBoardList, uploadImages, getListBoard, getPost, postBoard }