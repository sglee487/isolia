import { defineStore } from 'pinia'

// @ts-ignore
export const useBoardStore = defineStore('board', {
  state: () => {
    return {
      posts: [],
      currentPage: 0,
      isLastPage: false,
    }
  },
  actions: {
    addPosts(posts) {
      this.posts.push(...posts)
    },
    clearPosts() {
      this.posts = []
    },
    incresePage() {
      this.currentPage++
    },
    resetPage() {
      this.currentPage = 0
    },
    endIsLastPage() {
      this.isLastPage = true
    },
    resetIsLastPage() {
      this.isLastPage = false
    }
  },
  persist: false,
})