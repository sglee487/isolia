import { defineStore } from 'pinia'

export const useCalculateStore = defineStore('history', {
    state: () => {
        return {
            results: []
        }
    },

    actions: {
        addResult(result) {
            this.results.push(result)
        }
    }
})