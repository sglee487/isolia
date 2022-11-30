import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    interface user {
      token: string | null
      login_type: string | null
      email: string | null
      display_name: string | null
      isAdmin: boolean | false
    }
    return {
      data: <user>{
        token: null,
        login_type: null,
        email: null,
        display_name: null,
        isAdmin: false
      }
    }
  },

  actions: {
    is_logined() {
      return this.data.token !== null
    },
    login(token: string, loginType: string, email: string, display_name: string, isAdmin: boolean, isAutoLogin: boolean = false) {
      this.data.token = token
      this.data.login_type = loginType
      this.data.email = email
      this.data.display_name = display_name
      this.data.isAdmin = isAdmin
    },
    logout() {
      this.data.token = null
      this.data.login_type = null
      this.data.email = null
      this.data.display_name = null
      this.data.isAdmin = false
    }
  }
})