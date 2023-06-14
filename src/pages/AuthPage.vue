<script setup lang="ts">
import { getCurrentInstance } from 'vue'

import { useUserStore } from '@/stores/userStore'
import { routerTo } from '@/utils/routerUtils'

const instance = getCurrentInstance()
const routerQuery = instance.proxy.$route.query
const user = useUserStore()

if (routerQuery && Object.keys(routerQuery).includes('userLoginResponse')) {
  const data = JSON.parse(routerQuery.userLoginResponse as string)
  user.login(
    data.jwt,
    data.exp,
    data.loginType,
    data.email,
    data.picture32,
    data.picture96,
    data.display_name,
    data.role === 'admin'
  )
  routerTo(instance.proxy.$router, '/')
}

</script>

<template>
  <div>
    redirecting...
  </div>
</template>
