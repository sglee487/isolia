<script setup lang="ts">
import { get } from '@vueuse/core'
import { getCurrentInstance, ref, onMounted } from 'vue'
import {
  ArrowPathRoundedSquareIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription
} from '@headlessui/vue'

import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { updateUser } from '@/apis/user'
import { getGenerateRandomName } from '@/utils/generateName'
import { defaultProfilePicture96List } from '@/utils/defaultProfilePictureList'
const instance = getCurrentInstance()
const user = useUserStore()

const candidatePictures = [...defaultProfilePicture96List]
const email = user.data.email
const displayName = ref<string>(user.data.display_name)
const password = ref<string>('')
const newPassword = ref<string>('')
const newPasswordConfirm = ref<string>('')

const cropImageOpen = ref<boolean>(false)

const openCropImage = () => {
  cropImageOpen.value = true
}

const closeCropImage = () => {
  cropImageOpen.value = false
}

candidatePictures.push(user.data.picture_96)
const selectedPictureIndex = ref<number>(candidatePictures.indexOf(user.data.picture_96))

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
    candidatePictures[selectedPictureIndex.value],
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


const change = ({ coordinates, canvas }) => {
  console.log(coordinates, canvas);
}
const onMove = (moveEvent) => {
  instance.proxy.$emit('move', moveEvent);
}
const onMoveEnd = () => {
  instance.proxy.$emit('moveEnd');
}
const onResize = (resizeEvent) => {
  instance.proxy.$emit('resize', resizeEvent);
}
// const onResizeEnd = () => {
//   instance.proxy.$emit('resizeEnd');
// 		}
// const aspectRatios = () => {
// 			return {
// 				minimum: instance.proxy.aspectRatio || instance.proxy.minAspectRatio,
// 				maximum: instance.proxy.aspectRatio || instance.proxy.maxAspectRatio,
// 			}
// 		}

const fileImage = ref({
  src: null,
  type: null
})

function getMimeType(file, fallback = null) {
  const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}

const crop = () => {
  const { canvas } = instance.proxy.$refs.cropper.getResult();
  canvas.toBlob((blob) => {
    // Do something with blob: upload to a server, download and etc.
  }, fileImage.value.type);
}

const reset = () => {
  fileImage.value = {
    src: null,
    type: null
  }
}

const loadImage = (event) => {
  // Reference to the DOM input element
  const { files } = event.target;
  console.log(files)
  // Ensure that you have a file before attempting to read it
  if (files && files[0]) {
    // openCropImage()
    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (fileImage.value.src) {
      URL.revokeObjectURL(fileImage.value.src)
    }
    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0]);

    // 3. The steps below are designated to determine a file mime type to use it during the
    // getting of a cropped image from the canvas. You can replace it them by the following string,
    // but the type will be derived from the extension and it can lead to an incorrect result:
    //
    // this.image = {
    //    src: blob;
    //    type: files[0].type
    // }

    // Create a new FileReader to read this image binary data
    const reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
      // Note: arrow function used here, so that "this.image" refers to the image of Vue component
      fileImage.value = {
        // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
        src: blob,
        // Determine the image type to preserve it during the extracting the image from canvas:
        type: getMimeType(e.target.result, files[0].type),
      };
    };
    reader.onloadend = () => {
      openCropImage()
      event.target.value = ''
    }
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsArrayBuffer(files[0]);
  }
}

// const destroyed = () => {
//   // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
//   if (image.value.src) {
//     URL.revokeObjectURL(image.value.src)
//   }
// }

</script>

<template>
  <div class="p-10 flex justify-center">
    <div class="flex flex-col pb-4">
      <div
        class="text-2xl pt-4 pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
        사용자 변경
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-5 gap-2">
          <img v-for="picture, index in candidatePictures" :key="picture"
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
  <TransitionRoot appear :show="cropImageOpen" as="template">
    <Dialog as="div" @close="closeCropImage" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                사진 업로드
              </DialogTitle>
              <cropper ref="cropper" :src='fileImage.src' :stencil-props="{
                'circle': true,
              }" />

              <div class="mt-4">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeCropImage">
                  Got it, thanks!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
