<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import axios from 'axios'

import { registerUser } from '@/apis/user'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

const instance = getCurrentInstance()

const username = ref<string>()
const email = ref<string>()
const password = ref<string>()
const passwordConfirm = ref<string>()

const register = () => {
  if (password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  registerUser(username.value, email.value, password.value)
}

const toLogin = () => {
  instance?.proxy?.$router.push('/login')
}
</script>

<template>
  <div class="grid place-items-center">
    <div class="flex flex-col w-1/3">
      <div
        class="text-2xl pt-4 pb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
        회원가입
      </div>
      <div class="space-y-4">
        <InputBox label="이름" v-model="username" />
        <InputBox label="이메일" v-model="email" />
        <InputBox label="비밀번호" v-model="password" />
        <InputBox label="비밀번호 확인" v-model="passwordConfirm" />
      </div>
      <div class="py-4 flex space-x-1">
        <ButtonBox class="text-sm w-32" @click="toLogin" color="red">뒤로</ButtonBox>
        <ButtonBox class="w-full" @click="register" color="orange">가입하기</ButtonBox>
      </div>
    </div>
  </div>
</template>
