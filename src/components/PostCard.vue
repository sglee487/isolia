<script setup lang="ts">
import {
  EyeIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import menuDict from '@/enums/menuDict'
dayjs.extend(utc)
dayjs.extend(timezone)

const props = defineProps<{
  post: any | null,
  menu: string | null
}>()

</script>

<template>
  <div class="mx-2 my-4 p-4 ring-2 ring-slate-400 dark:ring-slate-500 rounded-md space-y-2">
    <div v-if="props.post === null" class="animate-pulse h-full space-y-2">
      <div class="flex space-x-2 items-center pb-2">
        <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
      </div>
      <div class="flex justify-between space-x-4 pb-2">
        <div class="w-64">
          <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2.5"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2.5"></div>
        </div>
        <div class="flex items-center justify-center w-32 h-24 mb-4 bg-gray-300 rounded dark:bg-gray-700">
          <svg class="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            fill="currentColor" viewBox="0 0 640 512">
            <path
              d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
      </div>
      <div class="flex items-center">
        <svg class="text-gray-200 w-6 h-6 dark:text-gray-700" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"></path>
        </svg>
        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
      </div>
      <div class="flex justify-between">
        <small class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></small>
        <div class="flex space-x-2">
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-20"></div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="flex space-x-2 items-center">
        <div v-if="menu === 'all'"
          class="px-2 py-1 rounded-md text-sm bg-slate-300 dark:bg-slate-600 w-fit text-app-600 dark:text-app-300">
          {{ menuDict[props.post['boardType']] }}
        </div>
        <div class="font-extrabold my-1">
          {{ props.post.title }}
        </div>
      </div>
      <div class="flex justify-between space-x-4 pb-2">
        <div class="break-all text-ellipsis">
          {{ props.post.previewText }}
        </div>
        <img v-if="props.post.previewImage !== null" :src="props.post.previewImage" alt="preview"
          class="w-32 h-24 object-cover" />
      </div>
      <div class="flex">
        <img class="w-6 h-6 mr-2 inline-block mb-1 rounded-full shadow-lg" :src="props.post.boardUserInfo.picture32"
          alt="pic32">
        <div>
          {{ props.post.boardUserInfo.displayName }}
        </div>
      </div>
      <hr />
      <div class="flex justify-between">
        <small class="self-end">
          {{ dayjs(props.post.createdAt).tz('Asia/Seoul').format('MM.DD HH:mm') }}
        </small>
        <div class="flex space-x-2">
          <div>
            <EyeIcon class="w-5 h-5 inline-block" />
            {{ props.post.hits }}
          </div>
          <!-- <div>
            <HeartIcon class="w-5 h-5 inline-block" />
            {{ props.post.like }}
          </div> -->
          <div>
            <ChatBubbleOvalLeftIcon class="w-5 h-5 inline-block" />
            {{ props.post.commentsSize }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
