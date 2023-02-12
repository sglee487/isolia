<script setup lang="ts">

const routes = [
  {
    to: '/more/minesweeper',
    name: '💣 지뢰찾기 멀티'
  },
  {
    to: '/more/question',
    name: '❓'
  }
]

</script>

<template>
  <div class="flex flex-col w-full font-naverNeo mb-24 md:mb-0 pt-4 px-8 md:p-10">
    <header class="pb-4 font-extrabold text-2xl">
      더보기
    </header>
    <ul class="grid grid-cols-1 gap-4 justify-items-center mb-2">
      <li v-for="route in routes" :key="route.to" class="w-full">
        <router-link :to="route.to"
          class="flex space-x-2 items-center p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 hover:dark:bg-neutral-700 shadow-md shadow-app-300 dark:shadow-app-700">
          <div class="font-bold">{{ route.name }}</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
