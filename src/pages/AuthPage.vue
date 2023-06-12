<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const routerQuery = instance.proxy.$route.query
console.log(instance.proxy.$route)
console.log(routerQuery)

if (routerQuery && Object.keys(routerQuery).includes('userLoginResponse')) {
  console.log(routerQuery.userLoginResponse)
  console.log(JSON.parse(routerQuery.userLoginResponse))
}

</script>

<template>
  <div>
    redirecting...
  </div>
</template>
