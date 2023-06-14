<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import qs from 'qs'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { loginUser } from '@/apis/user'

const instance = getCurrentInstance()
const user = useUserStore()

const email = ref<string>('')
const password = ref<string>('')

const SERVER_URL = `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`

console.log(SERVER_URL)

const google = {
  authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: `${SERVER_URL}/login/oauth2/code/google`,
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
}

const query = qs.stringify({
  response_type: 'code',
  client_id: google.clientId,
  redirect_uri: google.redirectUri,
  scope: google.scope
})

const login = async () => {
  if (!email.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    useAnimateElement(document.getElementById('inputEmail') as HTMLElement)
    instance?.proxy?.$toast.error('이메일 형식이 올바르지 않습니다.')
    return
  }

  if (!password.value.match(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
    useAnimateElement(document.getElementById('inputPassword') as HTMLElement)
    instance?.proxy?.$toast.error('패스워드 형식이 올바르지 않습니다.')
    return
  }

  try {
    const response = await loginUser('EMAIL', email.value, password.value, null)
    if (response.status === 200) {
      instance?.proxy?.$toast.success('로그인에 성공하였습니다.')
      instance?.proxy?.$router.back()
      console.log(response.data)
      user.login(
        response.data.jwt,
        response.data.exp,
        response.data.loginType,
        response.data.email,
        response.data.picture_32,
        response.data.picture_96,
        response.data.display_name,
        response.data.role === 'admin'
      )
      return
    }
    instance?.proxy?.$toast.error(response.data.detail)
  } catch (error) {
    instance?.proxy?.$toast.error(error.response.data.detail)
  }
}

const register = () => {
  instance?.proxy?.$router.push('/register')
}

</script>

<template>
  <div class="p-10">
    <div class="flex flex-col pb-4">
      <div class="text-xl font-bold text-red-500">
        ※ 일반 로그인은 지원하지 않습니다. <br />
      </div>
      <!-- <div
        class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
        로그인
      </div>
      <div class="space-y-4">
        <InputBox label="이메일" v-model="email" id="inputEmail" @keyup.enter="login" />
        <InputBox label="비밀번호" v-model="password" id="inputPassword" type="password" @keyup.enter="login" />
      </div>
      <div class="py-4 flex space-x-1">
        <ButtonBox class="text-sm w-32" @click="register" color="red">회원가입</ButtonBox>
        <ButtonBox class="w-full" @click="login" color="app">로그인</ButtonBox>
      </div> -->
    </div>
    <div class="flex flex-col pb-8">
      <div class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
        간편 로그인
      </div>
      <div class="flex flex-wrap">
        <a :href="`${google.authorizeUrl}?${query}`"
          class="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded">
          <span class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
          </span>
          <span>Sign in with Google</span>
        </a>
      </div>
    </div>
  </div>
</template>
