<script setup lang="ts">
import { ref } from 'vue'

import axios from 'axios'

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

const imageFile = ref<File>()

const sendImage = async () => {
  const formData = new FormData()
  formData.append('image', imageFile.value)
  const response = await axios.post(`${SERVER_URL}/board/images/`, formData, {
    headers: {
      // Authorization: `Bearer ${userToken}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log(response)
}

</script>

<template>
  <div class="flex flex-col mb-16">
    <div>

    </div>
  </div>
</template>
