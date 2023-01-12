<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import {
  ArrowPathRoundedSquareIcon,
  PlusCircleIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'

import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { uploadProfilePicture, updateUser } from '@/apis/user'
import { getGenerateRandomName } from '@/utils/generateName'
import { defaultProfilePicture32List, defaultProfilePicture96List } from '@/utils/defaultProfilePictureList'
const instance = getCurrentInstance()
const user = useUserStore()

const candidatePictures32 = [...defaultProfilePicture32List]
const candidatePictures96 = ref<string[]>([...defaultProfilePicture96List])
candidatePictures32.push(user.data.picture_32)
candidatePictures96.value.push(user.data.picture_96)
const selectedPictureIndex = ref<number>(candidatePictures96.value.indexOf(user.data.picture_96))
const cropImageModal = ref<boolean>(false)
const email = user.data.email
const displayName = ref<string>(user.data.display_name)
const password = ref<string>('')
const newPassword = ref<string>('')
const newPasswordConfirm = ref<string>('')

const setCropImageModal = (value: boolean) => {
  cropImageModal.value = value
}

const fileImage = ref({
  src: null,
  type: null
})

const goBack = () => {
  instance?.proxy?.$router.back()
}

const getMimeType = (file, fallback = null) => {
  const byteArray = (new Uint8Array(file)).subarray(0, 4)
  let header = ''
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16)
  }
  switch (header) {
    case '89504e47':
      return 'image/png'
    case '47494638':
      return 'image/gif'
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg'
    default:
      return fallback
  }
}

const crop = () => {
  const cropperRef: any = instance.proxy.$refs.cropper
  const { canvas } = cropperRef.getResult()
  setCropImageModal(false)
  canvas.toBlob(async (blob) => {
    destroyed()
    const response = await uploadProfilePicture(user, blob)
    candidatePictures32.push(response.picture_32)
    candidatePictures96.value.push(response.picture_96)
    selectedPictureIndex.value = candidatePictures96.value.length - 1
  }, fileImage.value.type)
}

const loadImage = (event) => {
  const { files } = event.target
  if (files && files[0]) {
    if (fileImage.value.src) {
      URL.revokeObjectURL(fileImage.value.src)
    }
    const blob = URL.createObjectURL(files[0])
    const reader = new FileReader()
    reader.onload = (e) => {
      fileImage.value = {
        src: blob,
        type: getMimeType(e.target.result, files[0].type)
      }
    }
    reader.onloadend = () => {
      setCropImageModal(true)
      event.target.value = ''
    }
    reader.readAsArrayBuffer(files[0])
  }
}

const destroyed = () => {
  // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
  if (fileImage.value.src) {
    URL.revokeObjectURL(fileImage.value.src)
  }
}

const generateRandomName = () => {
  displayName.value = getGenerateRandomName()
}

const update = async () => {
  if (user.data.login_type === 'email') {
    if (!password.value.match(/^.*(?=.{8,255})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
      useAnimateElement(document.getElementById('inputPassword') as HTMLElement)
      instance?.proxy?.$toast.error('현재 패스워드 형식이 올바르지 않습니다.')
      return
    }

    if (newPassword.value !== '' && !newPassword.value.match(/^.*(?=.{8,255})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
      useAnimateElement(document.getElementById('inputNewPassword') as HTMLElement)
      instance?.proxy?.$toast.error('새로운 패스워드 형식이 올바르지 않습니다.')
      return
    }

    if (newPasswordConfirm.value !== '' && !newPasswordConfirm.value.match(/^.*(?=.{8,255})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) {
      useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
      instance?.proxy?.$toast.error('새로운 패스워드 확인 형식이 올바르지 않습니다.')
      return
    }

    if (newPassword.value !== newPasswordConfirm.value) {
      useAnimateElement(document.getElementById('inputNewPassword') as HTMLElement)
      useAnimateElement(document.getElementById('inputPasswordConfirm') as HTMLElement)
      instance?.proxy?.$toast.error('새로운 비밀번호가 일치하지 않습니다.')
      return
    }
  }

  const response = await updateUser(
    user,
    candidatePictures32[selectedPictureIndex.value],
    candidatePictures96.value[selectedPictureIndex.value],
    displayName.value,
    password.value,
    newPassword.value
  )
  if (response.status === 200) {
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
    instance?.proxy?.$toast.success('사용자 정보가 변경되었습니다.')
    if (newPassword.value !== '') {
      instance?.proxy?.$toast.success('새로운 비밀번호로 로그인해주세요.')
      user.logout()
    }
    instance?.proxy?.$router.back()
  } else {
    instance?.proxy?.$toast.error('사용자 정보 변경에 실패했습니다.')
  }
}

</script>

<template>
  <div class="p-4">
    <header
      class="flex space-x-4 justify-between items-center font-extrabold pb-2 border-b border-gray-300 dark:border-gray-700">
      <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack()" />
      <div
        class="grow text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
        사용자 변경
      </div>
    </header>
    <div class="pt-6 grid place-content-center">
      <div class="flex flex-col justify-center space-y-4">
        <div class="grid grid-cols-5 gap-2">
          <img v-for="picture, index in candidatePictures96" :key="picture"
            :class="selectedPictureIndex === index ? 'ring-4 ring-black dark:ring-white' : ''"
            class="w-12 h-12 rounded-full cursor-pointer overflow-hidden" :src="picture"
            @click="selectedPictureIndex = index" />
          <label
            class="w-12 h-12 cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 rounded-md focus-within:ring-2 focus-within:ring-pink-300 transform transition">
            <PlusCircleIcon />
            <input accept="image/png, image/gif, image/jpeg" type="file" class="sr-only" @change="loadImage" />
          </label>
        </div>
        <InputBox label="이메일" v-model="email" id="inputEmail" :readonly="true" :disabled="true" />
        <div class="relative">
          <InputBox class="w-full" label="별명" v-model="displayName" @keyup.enter="update" />
          <ArrowPathRoundedSquareIcon
            class="absolute w-8 bottom-1 right-1 cursor-pointer p-1 text-app-600 text-sm font-bold"
            @click="generateRandomName" />
        </div>
        <div v-if="user.data.login_type === 'email'">
          <InputBox label="현재 비밀번호" v-model="password" id="inputPassword" type="password" @keyup.enter="update" />
          <InputBox label="새 비밀번호" v-model="newPassword" id="inputNewPassword" type="password" />
          <InputBox label="새 비밀번호 확인" v-model="newPasswordConfirm" id="inputNewPasswordConfirm" type="password"
            @keyup.enter="update" />
        </div>
      </div>
      <div class="py-4 flex">
        <ButtonBox class="w-full" @click="update" color="app">저장</ButtonBox>
      </div>
    </div>
  </div>
  <TransitionRoot appear :show="cropImageModal" as="template">
    <Dialog as="div" @close="setCropImageModal(false)" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center w-full">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3"
                class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
                사진 업로드
              </DialogTitle>
              <cropper ref="cropper" :src='fileImage.src' class="m-4" />

              <div class="flex flex-row space-x-2">
                <ButtonBox class="w-24" color="red" @click="setCropImageModal(false)">
                  취소
                </ButtonBox>
                <ButtonBox class="w-full min-w-fit" color="app" @click="crop">
                  저장
                </ButtonBox>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
