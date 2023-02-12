<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  FlagIcon
} from '@heroicons/vue/20/solid'

import ButtonBox from '@/components/ButtonBox.vue'
import { io } from 'socket.io-client'

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

console.log(SERVER_URL)

const socket = io(SERVER_URL)
const myPlayerInfo = ref<Object>({})
const players = ref<any[]>([])
const localHistory = ref<string[]>([])

const gameStatus = ref<'playing' | 'complete' | 'fail' | 'miss'>('playing')
const gameBoard = ref<any>(null)
const localSize = ref<number>(0)
const localBombs = ref<number>(0)
let board = []
const flags = ref<number>(0)
const isGameCompleted = ref<boolean>(false)

const gameStart = (sizeServer: number, bombCoords: Object) => {
  localSize.value = sizeServer
  gameStatus.value = 'playing'
  isGameCompleted.value = false
  flags.value = 0
  board = []
  for (let i = 0; i < localSize.value; i++) {
    board.push([])
    for (let j = 0; j < localSize.value; j++) {
      board[i].push({
        isRevealed: false,
        isBomb: false,
        isFlagged: false,
        flagColor: '',
        count: 0
      })
    }
  }
  for (const i in Object.keys(bombCoords)) {
    board[bombCoords[i].x][bombCoords[i].y].isBomb = true
  }
  for (let i = 0; i < localSize.value; i++) {
    for (let j = 0; j < localSize.value; j++) {
      if (board[i][j].isBomb) {
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            if (i + k >= 0 && i + k < localSize.value && j + l >= 0 && j + l < localSize.value) {
              board[i + k][j + l].count++
            }
          }
        }
      }
    }
  }
}

const isAllRevealed = () => {
  for (let i = 0; i < localSize.value; i++) {
    for (let j = 0; j < localSize.value; j++) {
      if (!board[i][j].isRevealed && !board[i][j].isBomb) {
        return false
      }
    }
  }
  return true
}

const revealAll = () => {
  for (let i = 0; i < localSize.value; i++) {
    for (let j = 0; j < localSize.value; j++) {
      board[i][j].isRevealed = true
    }
  }
}

// reveal cell
const reveal = (x, y, followMode: boolean = false) => {
  if (board[x][y].isRevealed) {
    return
  }
  board[x][y].isRevealed = true
  if (board[x][y].isBomb && !isGameCompleted.value) {
    if (!followMode) {
      gameStatus.value = 'miss'
      setTimeout(() => {
        if (!isGameCompleted.value) {
          gameStatus.value = 'playing'
        }
      }, 2000)
    }
  } else if (board[x][y].count === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + i < localSize.value && y + j >= 0 && y + j < localSize.value) {
          reveal(x + i, y + j)
        }
      }
    }
  }
  if (isAllRevealed()) {
    gameStatus.value = 'complete'
    revealAll()
    isGameCompleted.value = true
  }
}

// place flag
const placeFlag = (x: number, y: number, color: string, followMode: boolean = false) => {
  if (board[x][y].isRevealed) {
    return
  }
  if (!board[x][y].isBomb) {
    reveal(x, y)
    if (!followMode) {
      gameStatus.value = 'miss'
      setTimeout(() => {
        if (!isGameCompleted.value) {
          gameStatus.value = 'playing'
        }
      }, 2000)
    }
  } else if (!board[x][y].isFlagged) {
    board[x][y].isFlagged = true
    console.log(color)
    board[x][y].flagColor = color
    flags.value++
  } else {
    board[x][y].isFlagged = false
    board[x][y].flagColor = ''
    flags.value--
  }
}

// render board
const render = () => {
  nextTick()
  const table = gameBoard.value
  nextTick()
  table.innerHTML = ''

  for (let i = 0; i < localSize.value; i++) {
    const row = document.createElement('tr')
    for (let j = 0; j < localSize.value; j++) {
      const cell = board[i][j]
      const td = document.createElement('td')
      td.style.border = '1px solid black'
      td.style.width = '34px'
      td.style.height = '34px'
      td.style.textAlign = 'center'
      td.style.verticalAlign = 'middle'
      td.style.backgroundColor = 'lightgray'
      td.style.color = 'black'
      td.addEventListener('click', function () {
        if (!board[i][j].isRevealed) {
          socket.emit('mine_reveal', { x: i, y: j, sid: socket.id, action: 'reveal' })
        }
      })
      td.addEventListener('contextmenu', function (e) {
        e.preventDefault()
        if (!board[i][j].isRevealed) {
          socket.emit('mine_flag', { x: i, y: j, sid: socket.id, action: 'flag' })
        }
      })
      if (cell.isRevealed) {
        if (cell.isBomb) {
          td.style.backgroundColor = '#dddddd'
          td.innerHTML = '&#128163;'
        } else {
          td.style.backgroundColor = 'white'
          td.innerHTML = (cell.count === 0) ? '' : cell.count
        }
      } else if (cell.isFlagged) {
        // td.innerHTML = '&#128681;'
        // td.style.backgroundColor = cell.flagColor
        console.log(cell.flagColor)
        td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${cell.flagColor}" aria-hidden="true" class="inline-block w-6 h-6" style="color: rgb(255, 255, 224);"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z"></path></svg>`
      }
      row.appendChild(td)
    }
    table.appendChild(row)
  }
}

const followHistory = (history) => {
  for (const action of history) {
    if (action.action === 'reveal') {
      reveal(action.x, action.y, true)
    } else if (action.action === 'flag') {
      placeFlag(action.x, action.y, action.color, true)
    }
  }
}

const gameSetting = (size, bombs, history) => {
  const bombCoords = []
  for (const bomb of bombs) {
    bombCoords.push({ x: bomb[0], y: bomb[1] })
  }
  gameStart(size, bombCoords)
  console.log(history)
  followHistory(history)
  render()
}

onMounted(() => {
  socket.on('mine_start', (boardData) => {
    const { size, bombs, history } = boardData
    localSize.value = size
    localBombs.value = bombs.length
    gameSetting(size, bombs, history)
    localHistory.value = history
    console.log(history)
  })
  socket.emit('mine_start')

  socket.on('give_player_info', (playerInfo) => {
    myPlayerInfo.value = {
      name: playerInfo.name,
      color: playerInfo.color
    }
  })

  socket.on('mine_players', (serverPlayers) => {
    players.value = serverPlayers
  })

  socket.on('give_player_info', (playerInfo) => {
    console.log(playerInfo)
  })

  socket.on('mine_reveal', (data) => {
    const { x, y, history } = data
    reveal(x, y)
    localHistory.value = history
    render()
  })

  socket.on('mine_flag', (data) => {
    const { x, y, name, color, history } = data
    console.log(data)
    console.log(color)
    placeFlag(x, y, color)
    localHistory.value = history
    render()
  })
})

onUnmounted(() => {
  console.log('unmounted')
  socket.emit('leave_mine')
  socket.off('connect')
  socket.off('mine_join')
  socket.off('mine_players')
  socket.off('mine_reveal')
  socket.off('mine_flag')
  socket.off('disconnect')
})

const reset = () => {
  socket.emit('mine_restart')
}

</script>

<template>
  <div class="flex space-y-2">
    <div class="w-fit flex flex-col">
      <div class="flex justify-between items-center p-4 rounded-md bg-app-800">
        <span v-show="true">🚩 {{ localBombs - flags }} / {{ localBombs }}</span>
        <div>
          {{ gameStatus }}
        </div>
        <div class="w-20 h-8">
          <ButtonBox v-if="isGameCompleted" size="xs" @click="reset">재시작</ButtonBox>
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
        </li>
      </ul>
      히스토리 {{ localHistory.length }}
      <ul class="w-48 h-64 overflow-y-auto bg-neutral-100 dark:bg-neutral-800 rounded-md">
        <li v-for="history in localHistory.slice().reverse()" :key="history.name">
          <svg v-if="history.action === 'reveal'" class="w-4 h-4 inline-block">
            <circle cx="8" cy="8" r="6" stroke="#000000" stroke-width="1" :fill="history.color"></circle>
          </svg>
          <FlagIcon v-else-if="history.action === 'flag'" class="inline-block w-4 h-4"
            :style="`color: ${history.color}`" />
          x: {{ history.y }} y: {{
            history.x
          }} {{ history.name }}
        </li>
      </ul>
    </div>
  </div>

</template>
