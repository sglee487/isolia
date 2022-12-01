import { defineStore } from 'pinia'

// @ts-ignore
export const useCalculateStore = defineStore('history', {
    state: () => {
        return {
            results: []
        }
    },

    actions: {
        addResult(result) {
            this.results.unshift(result)
        },
        removeResult(index) {
            this.results.splice(index, 1)
        }
    },
    persist: true,
})