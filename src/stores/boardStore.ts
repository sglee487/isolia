import { defineStore } from 'pinia'

// @ts-ignore
export const useUserStore = defineStore('board', {
  state: () => {
    return {
      posts: []
    }
  },
  actions: {
    addPosts(posts) {
      this.posts.push(...posts)
    },
    emptyPosts() {
      this.posts = []
    }
  },
  persist: false,
})