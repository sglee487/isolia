import { defineStore } from 'pinia'

// @ts-ignore
export const useBoardStore = defineStore('board', {
  state: () => {
    return {
      posts: []
    }
  },
  actions: {
    addPosts(posts) {
      this.posts.push(...posts)
    },
    clearPosts() {
      this.posts = []
    }
  },
  persist: false,
})