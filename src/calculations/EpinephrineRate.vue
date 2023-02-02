<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import {
	ArrowSmallLeftIcon
} from '@heroicons/vue/24/outline'

import { useCalculateStoreHistory, useLastCalculatedStore } from '@/stores/calculateStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import { goBack } from '@/utils/routerUtils'

import CalculatorTypes from '@/enums/calculateTypes'

const calculateHistory = useCalculateStoreHistory()
const lastCalculated = useLastCalculatedStore()

const isHideHeader = ref<boolean>(false)
let lastScroll = 0

const dose = ref<number | null>(null)
const weight = ref<number | null>(null)
const drug = ref<number | null>(null)
const afterShuffleIV = ref<number | null>(null)
const variables = [dose, weight, drug, afterShuffleIV]

onMounted(() => {
	document.addEventListener('touchmove', handleScroll)
})

onUnmounted(() => {
	document.removeEventListener('touchmove', handleScroll)
})

const handleScroll = (e) => {
	// header hide and show
	const currentScroll = e.changedTouches[0].clientY
	if (currentScroll < lastScroll) {
		isHideHeader.value = true
	} else {
		isHideHeader.value = false
	}
	lastScroll = e.changedTouches[0].clientY
}

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.EpinephrineRate)
if (lastSaved) {
	dose.value = lastSaved.dose
	weight.value = lastSaved.weight
	drug.value = lastSaved.drug
	afterShuffleIV.value = lastSaved.afterShuffleIV
}

const calculated = computed<number | null>(() => {
	if (dose.value === null || weight.value === null || drug.value === null || afterShuffleIV.value === null) {
		return null
	}

	if (!drug.value || drug.value !== 0) {
		return dose.value * afterShuffleIV.value * weight.value / drug.value
	} else {
		return null
	}
})

const reset = () => {
	dose.value = null
	weight.value = null
	drug.value = null
	afterShuffleIV.value = null

	document.getElementById('doseFocus')?.focus()
}

const save = () => {
	if (calculated.value === null) {
		return
	}
	const result = {
		createdAt: new Date().toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}),
		type: 'Epinephrine',
		input: {
			dose: dose.value,
			weight: weight.value,
			drug: drug.value,
			afterShuffleIV: afterShuffleIV.value
		},
		output: {
			label: '주입속도',
			value: calculated.value.toFixed(2),
			unit: 'mcg/kg/min'
		}
	}
	calculateHistory.addResult(result)
}

variables.forEach(variable => {
	watch(() => variable.value, async () => {
		if ((typeof variable.value) === 'string') {
			variable.value = null
		}
		lastCalculated.setLastCalculated(CalculatorTypes.EpinephrineRate, {
			dose: dose.value,
			weight: weight.value,
			drug: drug.value,
			afterShuffleIV: afterShuffleIV.value
		})
	})
})

</script>

<template>
	<div class="flex flex-col">
		<header :class="{ 'hiddenHeader': isHideHeader }"
			class="md:hidden transition duration-300 transform fixed flex w-full space-x-4 py-1 justify-between items-center top-0 left-0 font-bold bg-[#f5f5f5] dark:bg-[#18171c] z-50">
			<ArrowSmallLeftIcon class="flex-none w-8 h-8 pl-2 cursor-pointer text-black dark:text-white"
				@click="goBack($router)" />
			<div
				class="grow flex flex-col bg-clip-text text-transparent bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
				<div class="text-xl">
					Epinephrine Rate
				</div>
				<div class="text-base">
					에피네프린 속도
				</div>
			</div>
		</header>
		<div class="pt-12 space-y-4">
			<InputBox label="주입용량단위(mcg/kg/min)" v-model="dose" type="number" @keyup.enter="save" inputId="doseFocus"
				placeholder="0.00" />
			<InputBox label="체중(kg)" v-model="weight" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="약물의 용량(mg)" v-model="drug" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="혼합 후 수액량(ml)" v-model="afterShuffleIV" type="number" @keyup.enter="save" placeholder="0.00" />
		</div>

		<!-- <div class="md:hidden block fixed inset-x-0 text-center top-14 bg-white dark:bg-black py-2">
			주입 속도는
			<span class="font-bold text-app-600">
				{{ calculated === null ? '0.00' : calculated.toFixed(2) }}
			</span>
			<small>cc/hr</small> 입니다.
		</div> -->
		<div class="p-4 text-center">
			주입 속도는
			<span class="font-bold text-app-600">
				{{ calculated === null ? '0.00' : calculated.toFixed(2) }}
			</span>
			<small>cc/hr</small> 입니다.
		</div>
		<div class="py-4 flex space-x-1">
			<ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
			<ButtonBox class="w-full" @click="save" color="app">저장</ButtonBox>
		</div>
	</div>
</template>

<style scoped>
.hiddenHeader {
	transform: translateY(-100%);
}
</style>
