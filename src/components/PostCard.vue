<script setup lang="ts">

const props = defineProps<{
  post: Object,
  menu: string | null
}>()

console.log(props.post)

const menuDict = {
  notice: '공지',
  suggestion: '건의',
  free: '자유'
}
</script>

<template>
  <div class="mx-2 my-4 p-4 ring-2 ring-slate-500 rounded-md space-y-2">
    <div v-if="menu === 'all'"
      class="px-2 py-1 pb-2 rounded-md bg-slate-400 dark:bg-slate-600 w-fit text-app-600 dark:text-app-300">
      {{ menuDict[props.post.board_type] }}
    </div>
    <div class="font-extrabold">
      {{ props.post.title }}
    </div>
    <div class="flex justify-between">
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
      <div>
        {{ props.post.created_at }}
      </div>
      <div class="flex space-x-2">
        <div>
          {{ props.post.like }}
        </div>
        <div>
          코멘트
        </div>
      </div>
    </div>
  </div>
</template>