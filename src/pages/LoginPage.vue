<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { loginUser } from '@/apis/user'

import {
  GoogleSignInButton,
  type CredentialResponse
} from 'vue3-google-signin'

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response
  try {
    const response = await loginUser('google', null, null, credential)
    if (response.status === 200) {
      instance?.proxy?.$toast.success('로그인에 성공하였습니다.')
      instance?.proxy?.$router.back()
      user.login(
        response.data.token,
        response.data.exp,
        response.data.login_type,
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

// handle an error event
const handleLoginError = () => {
  console.error('Login failed')
}

const instance = getCurrentInstance()
const user = useUserStore()

const email = ref<string>('')
const password = ref<string>('')

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
      console.log(user.data)
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
      <div
        class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
        간편 로그인
      </div>
      <div class="flex flex-wrap">
        <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
      </div>
    </div>
  </div>
</template>
