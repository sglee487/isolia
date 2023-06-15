import { defineStore } from 'pinia'

// @ts-ignore
export const useUserStore = defineStore('user', {
  state: () => {
    interface user {
      token: string | null
      exp: number | null
      loginType: string | null
      email: string | null
      picture32: string | null
      picture96: string | null
      displayName: string | null
      isAdmin: boolean | false
    }
    return {
      data: <user>{
        token: null,
        exp: null,
        loginType: null,
        email: null,
        picture32: null,
        picture96: null,
        displayName: null,
        isAdmin: false
      }
    }
  },
  actions: {
    isLogined() {
      return this.data.token !== null
    },
    isAdmin() {
      return this.data.isAdmin
    },
    login(token: string, exp: Number, loginType: string, email: string, picture32: string, picture96: string, displayName: string, isAdmin: boolean, isAutoLogin: boolean = false) {
      this.data.token = token
      this.data.exp = exp
      this.data.loginType = loginType
      this.data.email = email
      this.data.picture32 = picture32
      this.data.picture96 = picture96
      this.data.displayName = displayName
      this.data.isAdmin = isAdmin
    },
    logout() {
      this.data.token = null
      this.data.exp = null
      this.data.loginType = null
      this.data.email = null
      this.data.picture32 = null
      this.data.picture96 = null
      this.data.displayName = null
      this.data.isAdmin = false
    }
  },
  persist: true,
})