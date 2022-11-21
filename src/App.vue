<script setup lang="ts">
</script>

<template>
  <div>
    <header>
      <nav class="px-4 py-2.5 max-w-screen-xl">
        <div class="py-2.5 flex flex-wrap justify-between items-center mx-auto">
          <router-link to="/" class="p-1 cursor-pointer hover:bg-gray-400 rounded-md">
            <div class="flex flex-row space-x-2">
              <img src="./assets/line-chart.png" class="w-9 p-1 inline-block hover:bg-gray-400 rounded-md">
              <h1 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Isolia</h1>
            </div>
          </router-link>
          <div>
            <ul class="flex flex-wrap justify-between items-center">
              <li class="mr-4 space-x-2">
                <router-link to="/">게시판</router-link>
                <router-link to="/calculator">의료계산기</router-link>
              </li>
            </ul>
          </div>
          <div class="space-x-2">
            <a href="https://tistory-nari.tistory.com" target="_blank">
              <img src="./assets/vue.svg" class="w-9 p-1 inline-block hover:bg-gray-400 rounded-md" />
            </a>
          </div>
        </div>
      </nav>
    </header>
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