<script setup lang="ts">
import MineSweeper from '@/mores/MineSweeper.vue'
import {
  ArrowSmallLeftIcon
} from '@heroicons/vue/24/outline'

import { goBack } from '@/utils/routerUtils'
</script>

<template>
  <div class="flex flex-col w-full font-naverNeo mb-24 md:mb-0 pt-4 px-8 md:p-10">
    <header
      class="pb-4 font-extrabold text-2xl flex w-full space-x-4 py-1 justify-between items-center top-0 left-0 bg-[#f5f5f5] dark:bg-[#18171c] z-50">
      <ArrowSmallLeftIcon class="flex-none w-8 h-8 pl-2 cursor-pointer text-black dark:text-white"
        @click="goBack($router)" />
      <div class="grow flex flex-col">
        💣 지뢰찾기 멀티
      </div>
    </header>
    <MineSweeper />
  </div>
</template>
