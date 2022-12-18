<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

const instance = getCurrentInstance()
const pageId = ref<string | undefined>('')

if (Object.keys(instance.proxy.$route.params).includes('postId')) {
  pageId.value = instance.proxy.$route.params.postId as string
}

watch(() => instance.proxy.$route.params, async (to) => {
  pageId.value = to.postId as string
})

</script>

<template>
  <div>
    {{ pageId }}
  </div>
</template>
