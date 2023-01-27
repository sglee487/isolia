import { defineStore } from 'pinia'

// @ts-ignore
const useCalculateStoreHistory = defineStore('history', {
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

const useLastCalculatedStore = defineStore('lastCalculated', {
	state: () => {
		return {
			lasts: {
			}
		}
	},
	actions: {
		setLastCalculated(key: string, value: object) {
			this.lasts[key] = value
		},
		getLastCalculated(key: string) {
			if (!this.lasts[key]) {
				return false
			}
			return this.lasts[key]
		}
	},
	persist: true,
})

export { useCalculateStoreHistory, useLastCalculatedStore }