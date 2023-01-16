import axios from 'axios'

const SERVER_URL = `
${import.meta.env.VITE_SERVER_PROTOCOL}://
${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT
  }`

const getBoardList = async (boardType: string) => {
  const response = await axios.get(`${SERVER_URL}/board/${boardType}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  })
  return response
}

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

const postBoard = async (boardType: string, boardTitle: string, boardContent: string, userToken: string) => {

  const response = await axios.post(`${SERVER_URL}/board/${boardType}`,
    {
      title: boardTitle,
      content: boardContent
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
  return response
}

export { getBoardList, uploadImages, postBoard }