import { defineStore } from 'pinia'

// @ts-ignore
export const useUserStore = defineStore('user', {
  state: () => {
    interface user {
      token: string | null
      exp: number | null
      login_type: string | null
      email: string | null
      display_name: string | null
      isAdmin: boolean | false
    }
    return {
      data: <user>{
        token: null,
        exp: null,
        login_type: null,
        email: null,
        display_name: null,
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
    login(token: string, exp: Number, loginType: string, email: string, display_name: string, isAdmin: boolean, isAutoLogin: boolean = false) {
      this.data.token = token
      this.data.exp = exp
      this.data.login_type = loginType
      this.data.email = email
      this.data.display_name = display_name
      this.data.isAdmin = isAdmin
    },
    logout() {
      this.data.token = null
      this.data.exp = null
      this.data.login_type = null
      this.data.email = null
      this.data.display_name = null
      this.data.isAdmin = false
    }
  },
  persist: true,
})