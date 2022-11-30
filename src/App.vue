<script setup lang="ts">
import { ref } from 'vue'

import ButtonBox from './components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'

import { UserIcon } from '@heroicons/vue/24/outline'

const user = useUserStore()

const logout = () => {
  user.logout()
}

var profileModal = ref<boolean>(false)

</script>

<template>
  <div>
    <header>
      <nav class="px-4 py-2.5 max-w-screen-xl">
        <div class="py-2.5 flex flex-wrap justify-between items-center mx-auto">
          <router-link to="/" class="p-1 cursor-pointer rounded-md">
            <div class="flex flex-row space-x-2">
              <img src="./assets/line-chart.png" class="w-10 p-1 inline-bloc rounded-md" />
              <h1
                class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Isolia
              </h1>
            </div>
          </router-link>
          <div>
            <ul class="flex flex-wrap justify-between items-center">
              <li class="mr-4 space-x-2 font-bold">
                <router-link to="/">게시판</router-link>
                <router-link to="/calculator">의료계산기</router-link>
              </li>
            </ul>
          </div>
          <div class="border border-red-500">
            <vue-final-modal v-model="profileModal" :hide-overlay="true">
              Modal Content Here
            </vue-final-modal>
            <button @click="profileModal = true">Open Modal</button>
          </div>
          <div class="flex space-x-2 w-36 justify-end">
            <router-link to="/login" v-if="!user.is_logined()">
              <ButtonBox color="red">로그인</ButtonBox>
            </router-link>
            <div v-else class="flex flex-row space-x-2 items-center">
              <span class="font-medium">{{ user.data.display_name }}</span>
              <UserIcon class="w-12" />
              <ButtonBox>
                <vue-final-modal>
                  오픈모달
                </vue-final-modal>
              </ButtonBox>
              <!-- <UserIcon /> -->
              <!-- <div class="font-bold">{{ user.data.display_name }}</div>
              <div class="">{{ user.data.email }}</div> -->
              <!-- <ButtonBox color="red" @click="logout">로그아웃</ButtonBox> -->
            </div>
          </div>
        </div>
      </nav>
    </header>
    <div>
      {{ user }}
    </div>
    <router-view />
  </div>
</template>

<style>
header {
  font-family: 'gothica1';
}

#app {
  font-family: 'naverNeo';
}
</style>
