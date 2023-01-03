<script setup lang="ts">
import {
  NewspaperIcon,
  UserIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

import ButtonBox from '@/components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'

import { useSettingsStore } from '@/stores/settingsStore'

const user = useUserStore()
const settings = useSettingsStore()

const changeLightDarkTheme = () => {
  if (settings.themeLightDark === 'default') {
    // default -> light

    settings.themeLightDark = 'light'
    document.documentElement.classList.remove('dark')
  } else if (settings.themeLightDark === 'light') {
    // light -> dark

    settings.themeLightDark = 'dark'
    document.documentElement.classList.add('dark')
  } else if (settings.themeLightDark === 'dark') {
    // dark -> default

    settings.themeLightDark = 'default'
    if (localStorage.theme === 'dark' || (settings.themeLightDark === 'default' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

</script>

<template>
  <div class="w-full px-8 flex flex-col space-y-2">
    <div class="text-2xl font-bold pt-4 text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-app-200">
      나의 아이솔리아
    </div>
    <div class="flex flex-col space-y-1">
      <div v-if="user.isLogined()" class="flex flex-row gap-2 p-5 items-start">
        <img :src="user.data.picture_96" v-if="user.isLogined()"
          class="flex-none w-14 h-14 inline-block mb-1 rounded-full shadow-lg" />
        <UserIcon v-else class="w-14 h-14 inline-block mb-1" />
        <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
          <span class="font-bold text-ellipsis">{{ user.data.display_name }}</span>
          <span class="text-sm text-ellipsis">{{ user.data.email }}</span>
        </div>
        <router-link to="/user/edit" class="flex-none">
          <ButtonBox color="app" size="xs">
            <UserIcon class="w-4 inline-block mr-1" />수정
          </ButtonBox>
        </router-link>
      </div>
      <div v-else class="flex flex-row gap-2 p-5 items-start">
        <UserIcon class="flex-none w-14 h-14 inline-block mb-1 shadow-lg" />
        <router-link to="/login" class="grow flex flex-col h-full justify-end space-y-1 ml-1">
          <span class="font-bold text-ellipsis">로그인이 필요해요.</span>
          <span class="text-sm text-ellipsis text-gray-400">(~˘▾˘)~</span>
        </router-link>
        <router-link to="/user/edit" class="flex-none">
          <ButtonBox color="app" size="xs">
            <UserIcon class="w-4 inline-block mr-1" />수정
          </ButtonBox>
        </router-link>
      </div>
      <div>
        <div class="font-bold text-lg">
          <PresentationChartLineIcon class="w-6 h-6 inline-block mr-2" />앱
        </div>
        <router-link to="/settings/privacy" class="flex flex-row gap-2 p-5 items-start">
          <NewspaperIcon class="w-6 h-6 inline-block mb-1" />
          <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
            <span class="font-bold text-ellipsis">공지사항</span>
            <span class="text-sm text-ellipsis">최신 공지사항을 확인해요.</span>
          </div>
        </router-link>
      </div>
      <div>
        <div class="font-bold text-lg">
          <Cog6ToothIcon class="w-6 h-6 inline-block mr-2" />설정
        </div>
        <div class="flex flex-col space-y-1">
          <!-- dark mode on off -->
          <div to="/settings/privacy" class="flex flex-row gap-2 p-5 items-start">
            <MoonIcon class="w-6 h-6 inline-block mb-1" />
            <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
              <span class="font-bold text-ellipsis">다크모드</span>
              <span class="text-sm text-ellipsis">다크모드를 활성화해요.</span>
            </div>
            <div class="w-6 h-6" @click="changeLightDarkTheme">
              <SunIcon v-if="settings.themeLightDark === 'light'" />
              <MoonIcon v-if="settings.themeLightDark === 'dark'" />
              <svg v-if="settings.themeLightDark === 'default'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1">
                <path
                  d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z" />
              </svg>
            </div>
          </div>
          <!-- <router-link to="/settings/notifications" class="flex flex-row gap-2 p-5 items-start">
            <BellIcon class="w-14 h-14 inline-block mb-1" />
            <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
              <span class="font-bold text-ellipsis">알림</span>
              <span class="text-sm text-ellipsis">알림 설정을 변경할 수 있습니다.</span>
            </div>
            <ChevronLeftIcon class="flex-none w-6 h-6 inline-block mb-1" />
          </router-link>
          <router-link to="/settings/privacy" class="flex flex-row gap-2 p-5 items-start">
            <CalculatorIcon class="w-14 h-14 inline-block mb-1" />
            <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
              <span class="font-bold text-ellipsis">개인정보</span>
              <span class="text-sm text-ellipsis">개인정보 설정을 변경할 수 있습니다.</span>
            </div>
            <ChevronLeftIcon class="flex-none w-6 h-6 inline-block mb-1" />
          </router-link>
          <router-link to="/settings/privacy" class="flex flex-row gap-2 p-5 items-start">
            <ClockIcon class="w-14 h-14 inline-block mb-1" />
            <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
              <span class="font-bold text-ellipsis">약관</span>
              <span class="text-sm text-ellipsis">이용약관 및 개인정보 처리방침을 확인할 수 있습니다.</span>
            </div>
            <ChevronLeftIcon class="flex-none w-6 h-6 inline-block mb-1" />
          </router-link>
          <router-link to="/settings/privacy" class="flex flex-row gap-2 p-5 items-start">
            <NewspaperIcon class="w-14 h-14 inline-block mb-1" />
            <div class="grow flex flex-col h-full justify-end space-y-1 ml-1">
              <span class="font-bold text-ellipsis">공지사항</span>
              <span class="text-sm text-ellipsis">최신 공지사항을 확인할 수 있습니다.</span>
            </div>
          </router-link> -->
        </div>
      </div>
    </div>
  </div>

</template>
