<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import {
  ArrowPathRoundedSquareIcon
} from '@heroicons/vue/24/outline'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { updateUser } from '@/apis/user'
import { getGenerateRandomName } from '@/utils/generateName'

const instance = getCurrentInstance()
const user = useUserStore()

const email = user.data.email
const displayName = ref<string>(user.data.display_name)
const password = ref<string>('')
const newPassword = ref<string>('')
const newPasswordConfirm = ref<string>('')

const generateRandomName = () => {
  displayName.value = getGenerateRandomName()
}

const update = async () => {
  if (!password.value.match(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
    useAnimateElement(document.getElementById('inputPassword') as HTMLElement)
    instance?.proxy?.$toast.error('패스워드 형식이 올바르지 않습니다.')
    return
  }

  if (!newPassword.value.match(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
    useAnimateElement(document.getElementById('inputNewPassword') as HTMLElement)
    instance?.proxy?.$toast.error('패스워드 형식이 올바르지 않습니다.')
    return
  }

  if (!newPasswordConfirm.value.match(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
    useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
    instance?.proxy?.$toast.error('패스워드 형식이 올바르지 않습니다.')
    return
  }

  if (newPassword.value !== newPasswordConfirm.value) {
    useAnimateElement(document.getElementById('inputNewPassword') as HTMLElement)
    useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
    instance?.proxy?.$toast.error('새로운 비밀번호가 일치하지 않습니다.')
    return
  }
}
</script>

<template>
  <div>
    <div class="w-96 p-10">
      <div class="flex flex-col pb-4">
        <div
          class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
          사용자 변경
        </div>
        <div class="space-y-4">
          <InputBox label="이메일" v-model="email" id="inputEmail" :readonly="true" :disabled="true" />
          <div class="relative">
            <InputBox class="w-full" label="별명" v-model="displayName" @keyup.enter="update" />
            <ArrowPathRoundedSquareIcon
              class="absolute w-8 bottom-1 right-1 cursor-pointer p-1 text-orange-600 text-sm font-bold"
              @click="generateRandomName" />
          </div>
          <InputBox label="현재 비밀번호" v-model="password" id="inputPassword" type="password" @keyup.enter="update" />
          <InputBox label="새 비밀번호" v-model="newPassword" id="inputNewPassword" type="password" />
          <InputBox label="새 비밀번호 확인" v-model="newPasswordConfirm" id="inputNewPasswordConfirm" type="password"
            @keyup.enter="update" />
        </div>
        <div class="py-4 flex">
          <ButtonBox class="w-full" @click="update" color="orange">저장</ButtonBox>
        </div>
      </div>
    </div>
  </div>

</template>