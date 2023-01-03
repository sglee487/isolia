import { defineStore } from 'pinia'

// @ts-ignore
export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      themeLightDark: 'default',
    }
  },
  actions: {
    setThemeLightDark(themeLightDark) {
      this.themeLightDark = themeLightDark
    }
  },
  persist: true,
})