<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

import { registerUser } from '@/apis/user'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

const instance = getCurrentInstance()

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')

const register = async () => {
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

  if (!passwordConfirm.value.match(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
    useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
    instance?.proxy?.$toast.error('패스워드 형식이 올바르지 않습니다.')
    return
  }

  if (password.value !== passwordConfirm.value) {
    useAnimateElement(document.getElementById('inputPassword') as HTMLElement)
    useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
    instance?.proxy?.$toast.error('비밀번호가 일치하지 않습니다.')
    return
  }
  try {
    const response = await registerUser('email', username.value, email.value, password.value)
    if (response.status === 201) {
      instance?.proxy?.$toast.success('회원가입에 성공하였습니다.')
      instance?.proxy?.$router.push('/login')
      return
    }
    instance?.proxy?.$toast.error(response.data.detail)
  } catch (error) {
    console.log(error)
    instance?.proxy?.$toast.error(error.response.data.detail)
  }
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
        <InputBox label="이름" v-model="username" @keyup.enter="register" />
        <InputBox label="이메일" v-model="email" @keyup.enter="register" id="inputEmail" />
        <InputBox label="비밀번호" v-model="password" @keyup.enter="register" type="password" id="inputPassword">
          <div class="flex flex-col pt-1">
            <span class="text-xs text-gray-500">8자 이상 20자 이하</span>
            <span class="text-xs text-gray-500">영문, 숫자 포함</span>
          </div>
        </InputBox>
        <InputBox label="비밀번호 확인" v-model="passwordConfirm" @keyup.enter="register" type="password"
          id="inputPasswordConfirm" />
      </div>
      <div class="py-4 flex space-x-1">
        <ButtonBox class="text-sm w-32" @click="toLogin" color="red">뒤로</ButtonBox>
        <ButtonBox class="w-full" @click="register" color="orange">가입하기</ButtonBox>
      </div>
    </div>
  </div>
</template>
