<script setup lang="ts">
import { getCurrentInstance, watch } from 'vue'

import { useUserStore } from '@/stores/userStore'
import {
  CalculatorIcon as CalculatorIconOutline,
  NewspaperIcon as NewspaperIconOutline,
  UserIcon as UserIconOutline,
  HomeIcon as HomeIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
  EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconOutline
} from '@heroicons/vue/24/outline'

import {
  CalculatorIcon as CalculatorIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  UserIcon as UserIconSolid,
  HomeIcon as HomeIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
  EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconSolid
} from '@heroicons/vue/24/solid'

const instance = getCurrentInstance()

const user = useUserStore()
</script>

<template>
  <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-neutral-50 dark:bg-[#171717] shadow
    border-t border-neutral-200 dark:border-neutral-800 rounded-t-2xl
    ">
    <div id="tabs" class="flex justify-between">
      <router-link to="/" id="nav" v-slot="{ navigate }" class="w-full hover:text-app-400 text-center">
        <span class="justify-center inline-block text-center pt-2 pb-1" @click="navigate" role="link">
          <HomeIconSolid v-if="instance?.proxy?.$route?.matched[0]?.path === '/'" class="w-6 h-6 inline-block mb-1" />
          <HomeIconOutline v-else class="w-6 h-6 inline-block mb-1" />
        </span>
      </router-link>
      <router-link to="/board" id="nav" v-slot="{ navigate }" class="w-full hover:text-app-400 text-center">
        <span class="justify-center inline-block text-center pt-2 pb-1" @click="navigate" role="link">
          <NewspaperIconSolid v-if="instance?.proxy?.$route?.matched[0]?.path === '/board'"
            class="w-6 h-6 inline-block mb-1" />
          <NewspaperIconOutline v-else class="w-6 h-6 inline-block mb-1" />
        </span>
      </router-link>
      <router-link to="/calculator" id="nav" v-slot="{ navigate }" class="w-full hover:text-app-400 text-center">
        <span class="inline-block text-center pt-2 pb-1" @click="navigate" role="link">
          <CalculatorIconSolid v-if="instance?.proxy?.$route?.matched[0]?.path === '/calculator'"
            class="w-6 h-6 inline-block mb-1" />
          <CalculatorIconOutline v-else class="w-6 h-6 inline-block mb-1" />
        </span>
      </router-link>
      <router-link to="/more" id="nav" v-slot="{ navigate }" class="w-full hover:text-app-400 text-center">
        <span class="justify-center inline-block text-center pt-2 pb-1" @click="navigate" role="link">
          <EllipsisHorizontalCircleIconSolid v-if="instance?.proxy?.$route?.matched[0]?.path === '/more'"
            class="w-6 h-6 inline-block mb-1" />
          <EllipsisHorizontalCircleIconOutline v-else class="w-6 h-6 inline-block mb-1" />
        </span>
      </router-link>
      <router-link to="/settings" id="nav" v-slot="{ navigate }" class="w-full hover:text-app-400 text-center">
        <span class="justify-center inline-block text-center pt-2 pb-1" @click="navigate" role="link">
          <template v-if="user.isLogined()">
            <img :src="user.data.picture_32"
            :class="[instance?.proxy?.$route?.matched[0]?.path === '/settings' ? 'border-app-400' : 'border-transparent']"
            class="w-6 h-6 inline-block mb-1 rounded-full shadow-lg border-spacing-3" />
          </template>
          <template v-else>
            <UserIconSolid v-if="instance?.proxy?.$route?.matched[0]?.path === '/settings'"
              class="w-6 h-6 inline-block mb-1" />
            <UserIconOutline v-else class="w-6 h-6 inline-block mb-1" />
          </template>
        </span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
/* @media (max-width: 768px) {

  #nav.router-link-active,
  #nav.router-link-exact-active #nav {
    color: rgb(14 165 233);
  }

  #nav.router-link-active.dark,
  #nav.router-link-exact-active.dark #nav.dark {
    color: rgb(56 189 248);
  }
} */
</style>
