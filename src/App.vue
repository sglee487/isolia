<script setup lang="ts">
import ButtonBox from './components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'

const user = useUserStore()

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
          <div class="space-x-2">
            <router-link to="/login">
              <ButtonBox color="red">로그인</ButtonBox>
            </router-link>
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
