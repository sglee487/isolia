<script setup lang="ts">
import {
  EyeIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

import menuDict from '@/pages/menuDict'

const props = defineProps<{
  post: Object,
  menu: string | null
}>()

// console.log(props.post)

</script>

<template>
  <div class="mx-2 my-4 p-4 ring-2 ring-slate-400 dark:ring-slate-500 rounded-md space-y-2">
    <div class="flex space-x-2 items-center">
      <div v-if="menu === 'all'"
        class="px-2 py-1 rounded-md bg-slate-300 dark:bg-slate-600 w-fit text-app-600 dark:text-app-300">
        {{ menuDict[props.post['board_type']] }}
      </div>
      <div class="font-extrabold my-1">
        {{ props.post.title }}
      </div>
    </div>
    <div class="flex justify-between space-x-4 pb-2">
      <div class="break-all text-ellipsis">
        {{ props.post.preview_text }}
      </div>
      <img v-if="props.post.preview_image !== null" :src="props.post.preview_image" alt="preview"
        class="w-32 h-24 object-cover" />
    </div>
    <div class="flex">
      <img class="w-6 h-6 inline-block mb-1 rounded-full shadow-lg" :src="props.post.picture_32" alt="pic32">
      <div>
        {{ props.post.display_name }}
      </div>
    </div>
    <hr />
    <div class="flex justify-between">
      <small class="self-end">
        {{ dayjs(props.post.created_at).format('MM.DD HH:mm') }}
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
          {{ props.post.comment_count }}
        </div>
      </div>
    </div>
  </div>
</template>
