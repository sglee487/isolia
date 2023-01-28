<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import {
  CalculatorIcon,
  NewspaperIcon,
  UserIcon,
  HomeIcon,
  BellIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const user = useUserStore()
</script>

<template>
  <section id="bottom-navigation"
    class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-neutral-50 dark:bg-[#121212] shadow">
    <div id="tabs" class="flex justify-between">
      <router-link to="/" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <HomeIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-home block text-xs">홈</span>
      </router-link>
      <router-link to="/board" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <NewspaperIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">게시판</span>
      </router-link>
      <router-link to="/calculator" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <CalculatorIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">계산기</span>
      </router-link>
      <!-- <router-link to="/notification" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <BellIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs line-through">알림(미구현)</span>
      </router-link> -->
      <div id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <QuestionMarkCircleIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs line-through">뭘 넣을지 고민중</span>
      </div>
      <router-link to="/settings" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <img :src="user.data.picture_32" v-if="user.isLogined()"
          class="w-6 h-6 inline-block mb-1 rounded-full shadow-lg" />
        <UserIcon v-else class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">나의 이솔</span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
#nav.router-link-active,
#nav.router-link-exact-active {
  border-bottom: 2px solid rgb(14 165 233);
  /* #4EBDE5 */
}

#nav.router-link-active.dark,
#nav.router-link-exact-active.dark {
  border-bottom: 2px solid rgb(56 189 248);
  /* #4EBDE5 */
}

@media (max-width: 768px) {

  #nav.router-link-active,
  #nav.router-link-exact-active #nav {
    color: rgb(14 165 233);
  }

  #nav.router-link-active.dark,
  #nav.router-link-exact-active.dark #nav.dark {
    color: rgb(56 189 248);
  }
}
</style>