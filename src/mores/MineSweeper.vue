<!-- eslint-disable camelcase -->
<script setup lang="ts">
// import { ref, onMounted, onUnmounted, nextTick } from 'vue'
// import {
//   FlagIcon
// } from '@heroicons/vue/20/solid'
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client/dist/sockjs'

import ButtonBox from '@/components/ButtonBox.vue'

// // const SOCKET_URL = `${import.meta.env.VITE_SOCKET_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

// // const wsConnect = new WebSocket('http://localhost:8080/ws-connect')

const socket = new SockJS('http://localhost:8080/ws-connect')
console.log(socket)
const stompClient = Stomp.over(socket)
console.log(stompClient)
stompClient.connect({}, (frame) => {
  console.log('Connected: ' + frame)
  console.log(frame.headers)
  console.log(frame.headers['user-name'])
  console.log(frame.body)
  console.log(frame['user-name'])
  const username = frame.headers['user-name']
  stompClient.subscribe('/subscribe/mine', (greeting) => {
    console.log(`from /subscribe/mine: ${greeting}`)
  })
  stompClient.subscribe('/subscribe/mine-personal', (greeting) => {
    console.log(`from /subscribe/mine-personal: ${greeting}`)
  })
  stompClient.subscribe('/subscribe/queue/reply', (greeting) => {
    console.log(`from /queue/reply: ${greeting}`)
  })
  stompClient.subscribe(`/subscribe/${username}/queue/reply`, (greeting) => {
    console.log(`from /subscribe/${username}/queue/reply: ${greeting}`)
  })
  stompClient.subscribe(`/subscribe/user/${username}/queue/reply`, (greeting) => {
    console.log(`from /subscribe/user/${username}/queue/reply: ${greeting}`)
  })
})

const sendHello = () => {
  stompClient.send('/publish/hello', JSON.stringify({ name: 'hello' }))
}

const requestName = () => {
  stompClient.send('/publish/join')
}

const requestUserReply = () => {
  stompClient.send('/publish/message', JSON.stringify({ name: 'message' }))
}

// // console.log(wsConnect)
// interface PlayerInfo {
//   sid: string;
//   name: string;
//   color: string;
// }

// interface History {
//   type: 'action'
//   sid: string
//   action: 'reveal' | 'flag'
//   x: number
//   y: number
//   color: string
//   name: string
// }

// interface Coords {
//   x: number
//   y: number
// }

// const myPlayerInfo = ref<PlayerInfo>({ sid: '', name: '', color: '' })
// const players = ref<any[]>([])
// const localHistory = ref<History[]>([])

// const gameStatus = ref<'playing' | 'complete' | 'fail' | 'miss'>('playing')
// const gameBoard = ref<any>(null)
// const localSize = ref<number>(0)
// const localBombs = ref<number>(0)
// let board = []
// const flags = ref<number>(0)
// const isGameCompleted = ref<boolean>(true)

// const sendAction = (action: 'reveal' | 'flag', x: number, y: number) => {
//   const data = {
//     type: 'action',
//     sid: myPlayerInfo.value.sid,
//     action,
//     x,
//     y
//   }
//   // wsConnect.send(JSON.stringify(data))
// }

// const sendReset = async () => {
//   const data = {
//     type: 'reset'
//   }
//   // wsConnect.send(JSON.stringify(data))
// }

// const gameStart = (sizeServer: number, bombCoords: Array<Coords>) => {
//   localSize.value = sizeServer
//   gameStatus.value = 'playing'
//   // isGameCompleted.value = false
//   isGameCompleted.value = true
//   flags.value = 0
//   board = []
//   for (let i = 0; i < localSize.value; i++) {
//     board.push([])
//     for (let j = 0; j < localSize.value; j++) {
//       board[i].push({
//         isRevealed: false,
//         isBomb: false,
//         isFlagged: false,
//         flagColor: '',
//         count: 0
//       })
//     }
//   }
//   for (const i in Object.keys(bombCoords)) {
//     board[bombCoords[i].x][bombCoords[i].y].isBomb = true
//   }
//   for (let i = 0; i < localSize.value; i++) {
//     for (let j = 0; j < localSize.value; j++) {
//       if (board[i][j].isBomb) {
//         for (let k = -1; k <= 1; k++) {
//           for (let l = -1; l <= 1; l++) {
//             if (i + k >= 0 && i + k < localSize.value && j + l >= 0 && j + l < localSize.value) {
//               board[i + k][j + l].count++
//             }
//           }
//         }
//       }
//     }
//   }
// }

// const isAllRevealed = () => {
//   for (let i = 0; i < localSize.value; i++) {
//     for (let j = 0; j < localSize.value; j++) {
//       if (!board[i][j].isRevealed && !board[i][j].isBomb) {
//         return false
//       }
//     }
//   }
//   return true
// }

// const revealAll = () => {
//   for (let i = 0; i < localSize.value; i++) {
//     for (let j = 0; j < localSize.value; j++) {
//       board[i][j].isRevealed = true
//     }
//   }
// }

// // reveal cell
// const reveal = (x, y, followMode: boolean = false) => {
//   if (board[x][y].isRevealed) {
//     return
//   }
//   board[x][y].isRevealed = true
//   if (board[x][y].isBomb && !isGameCompleted.value) {
//     if (!followMode) {
//       gameStatus.value = 'miss'
//       setTimeout(() => {
//         if (!isGameCompleted.value) {
//           gameStatus.value = 'playing'
//         }
//       }, 2000)
//     }
//   } else if (board[x][y].count === 0) {
//     for (let i = -1; i <= 1; i++) {
//       for (let j = -1; j <= 1; j++) {
//         if (x + i >= 0 && x + i < localSize.value && y + j >= 0 && y + j < localSize.value) {
//           reveal(x + i, y + j)
//         }
//       }
//     }
//   }
//   if (isAllRevealed()) {
//     gameStatus.value = 'complete'
//     revealAll()
//     isGameCompleted.value = true
//   }
// }

// // place flag
// const placeFlag = (x: number, y: number, color: string, followMode: boolean = false) => {
//   if (board[x][y].isRevealed) {
//     return
//   }
//   if (!board[x][y].isBomb) {
//     reveal(x, y)
//     if (!followMode) {
//       gameStatus.value = 'miss'
//       setTimeout(() => {
//         if (!isGameCompleted.value) {
//           gameStatus.value = 'playing'
//         }
//       }, 2000)
//     }
//   } else if (!board[x][y].isFlagged) {
//     board[x][y].isFlagged = true
//     board[x][y].flagColor = color
//     flags.value++
//   } else {
//     board[x][y].isFlagged = false
//     board[x][y].flagColor = ''
//     flags.value--
//   }
// }

// // render board
// const render = () => {
//   nextTick()
//   const table = gameBoard.value
//   nextTick()
//   table.innerHTML = ''

//   for (let i = 0; i < localSize.value; i++) {
//     const row = document.createElement('tr')
//     for (let j = 0; j < localSize.value; j++) {
//       const cell = board[i][j]
//       const td = document.createElement('td')
//       td.style.border = '1px solid black'
//       td.style.width = '34px'
//       td.style.height = '34px'
//       td.style.textAlign = 'center'
//       td.style.verticalAlign = 'middle'
//       td.style.backgroundColor = 'lightgray'
//       td.style.color = 'black'
//       td.addEventListener('click', function () {
//         if (!board[i][j].isRevealed) {
//           sendAction('reveal', i, j)
//         }
//       })
//       td.addEventListener('contextmenu', function (e) {
//         e.preventDefault()
//         if (!board[i][j].isRevealed) {
//           sendAction('flag', i, j)
//         }
//       })
//       if (cell.isRevealed) {
//         if (cell.isBomb) {
//           td.style.backgroundColor = '#dddddd'
//           td.innerHTML = '&#128163;'
//         } else {
//           td.style.backgroundColor = 'white'
//           td.innerHTML = (cell.count === 0) ? '' : cell.count
//         }
//       } else if (cell.isFlagged) {
//         td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${cell.flagColor}" stroke="#000000" stroke-width="1" aria-hidden="true" class="inline-block w-fit h-fit p-1" style="color: rgb(255, 255, 224);"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z"></path></svg>`
//       }
//       row.appendChild(td)
//     }
//     table.appendChild(row)
//   }
// }

// const followHistory = (history: Array<any>) => {
//   for (const action of history) {
//     if (action.action === 'reveal') {
//       reveal(action.x, action.y, true)
//     } else if (action.action === 'flag') {
//       placeFlag(action.x, action.y, action.color, true)
//     }
//   }
// }

// const gameSetting = (size: number, bombs: number, bombsCoords: Array<Coords>, history: Array<History>) => {
//   localSize.value = size
//   localBombs.value = bombs
//   localBombs.value = bombsCoords.length
//   localHistory.value = history
//   const bombCoords = []
//   for (const bomb of bombsCoords) {
//     bombCoords.push({ x: bomb[0], y: bomb[1] })
//   }
//   gameStart(size, bombCoords)
//   followHistory(history)
//   render()
// }

// // onMounted(() => {
// //   wsConnect.onmessage = (event) => {
// //     const data = JSON.parse(event.data)
// //     switch (data.type) {
// //       case 'profile':
// //         myPlayerInfo.value = data
// //         wsConnect.send(JSON.stringify({ type: 'start' }))
// //         wsConnect.send(JSON.stringify({ type: 'players' }))
// //         break
// //       case 'players':
// //         players.value = data.players
// //         break
// //       case 'start': {
// //         const { size, bomb_coords, history } = data
// //         const bombCoordsArray = JSON.parse(bomb_coords)
// //         gameSetting(size, bombCoordsArray.length, bombCoordsArray, history)
// //         break
// //       }
// //       case 'action': {
// //         const { action, x, y, color, history } = data
// //         if (action === 'reveal') {
// //           reveal(x, y)
// //         } else if (action === 'flag') {
// //           placeFlag(x, y, color)
// //         }
// //         render()
// //         localHistory.value = history
// //         break
// //       }
// //       case 'disconnect':
// //         break
// //       case 'restart': {
// //         const { size, bomb_coords, history } = data
// //         const bombCoordsArray = JSON.parse(bomb_coords)
// //         gameSetting(size, bombCoordsArray.length, bombCoordsArray, history)
// //         break
// //       }
// //     }
// //   }
// // })

// // onUnmounted(() => {
// //   wsConnect?.close()
// // })

// const reset = () => {
//   sendReset()
// }

</script>

<template>
  <div>
    hi
    <ButtonBox @click="sendHello">
      sendHello
    </ButtonBox>
    <ButtonBox @click="requestName">
      requestName
    </ButtonBox>
    <ButtonBox @click="requestUserReply">
      requestUserReply
    </ButtonBox>
  </div>
  <!-- <div class="flex flex-col sm:flex-row space-y-2">
    <div class="w-fit flex flex-col">
      <div class="flex justify-between items-center p-4 rounded-md bg-app-800">
        <span v-show="true">🚩 {{ localBombs - flags }} / {{ localBombs }}</span>
        <div>
          {{ gameStatus }}
        </div>
        <div class="w-20 h-8">
          <ButtonBox size="xs" @click="reset">재시작</ButtonBox>
        </div>
      </div>
      <div ref="gameBoard" />
    </div>
    <div class="ml-2">
      접속 플레이어 {{ players.length }}
      <ul class="w-40 h-40 overflow-y-auto bg-neutral-100 dark:bg-neutral-800 rounded-md">
        <li v-for="player in players" :key="player.name">
          <FlagIcon class="inline-block w-6 h-6 mr-2" :style="`color: ${player.color}`" /> {{
            player.name
          }}
          <span v-if="player.sid === myPlayerInfo.sid" class="text-xs"> (나) </span>
        </li>
      </ul>
      히스토리 {{ localHistory.length }}
      <ul class="w-48 h-64 overflow-y-auto bg-neutral-100 dark:bg-neutral-800 rounded-md">
        <li v-for="history in localHistory" :key="history.name">
          <svg v-if="history.action === 'reveal'" class="w-6 h-6 inline-block">
            <circle cx="12" cy="12" r="6" stroke="#000000" stroke-width="2" :fill="history.color"></circle>
          </svg>
          <svg v-else-if="history.action === 'flag'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            :fill=history.color stroke="#000000" stroke-width="2" aria-hidden="true" class="inline-block w-6 h-6"
            style="color: rgb(255, 255, 224);">
            <path
              d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z">
            </path>
          </svg>
          x: {{ history.y }} y: {{
            history.x
          }} {{ history.name }}
        </li>
      </ul>
    </div>
  </div> -->
</template>
