import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    interface user {
      id: string | null
      login_type: string | null
      email: string | null
      token: string | null
      isAdmin: boolean | false
    }
    return {
      data: <user>{
        id: null,
        login_type: null,
        email: null,
        token: null,
        isAdmin: false
      }
    }
  },

  actions: {
    login(id: string, loginType: string, email: string, token: string, isAdmin: boolean, isAutoLogin: boolean = false) {
      this.data.id = id
      this.data.login_type = loginType
      this.data.email = email
      this.data.token = token
      this.data.isAdmin = isAdmin
    },
    logout() {
      this.data.id = null
      this.data.login_type = null
      this.data.email = null
      this.data.token = null
      this.data.isAdmin = false
    }
  }
})