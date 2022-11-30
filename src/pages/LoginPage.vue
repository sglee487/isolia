<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { loginUser } from '@/apis/user'

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
    const response = await loginUser('email', email.value, password.value)
    if (response.status === 200) {
      instance?.proxy?.$toast.success('로그인에 성공하였습니다.')
      instance?.proxy?.$router.push('/')
      // user.login(response.data)
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
  <div class="grid place-items-center">
    <div class="flex flex-col w-1/3 pb-4">
      <div
        class="text-2xl pt-4 pb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
        로그인
      </div>
      <div class="space-y-4">
        <InputBox label="이메일" v-model="email" id="inputEmail" @keyup.enter="login" />
        <InputBox label="비밀번호" v-model="password" id="inputPassword" type="password" @keyup.enter="login" />
      </div>
      <div class="py-4 flex space-x-1">
        <ButtonBox class="text-sm w-32" @click="register" color="red">회원가입</ButtonBox>
        <ButtonBox class="w-full" @click="login" color="orange">로그인</ButtonBox>
      </div>
    </div>
    <div class="flex flex-col w-1/3 pb-8">
      <div
        class="text-xl pt-4 pb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
        간편 로그인
      </div>
      <div class="flex flex-wrap">

      </div>
    </div>
  </div>
</template>
