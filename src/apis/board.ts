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

export { getBoardList, postBoard }