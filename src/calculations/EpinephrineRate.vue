<script setup lang="ts">
import { ref, watch } from 'vue'
import {
	ChevronLeftIcon
} from '@heroicons/vue/24/outline'

import { useCalculateStore } from '@/stores/calculateStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import { goBack } from '@/utils/routerUtils'

const calculateHistory = useCalculateStore()

const dose = ref<number | null>(null)
const weight = ref<number | null>(null)
const drug = ref<number | null>(null)
const afterShuffleIV = ref<number | null>(null)
const calculated = ref<number | null>(null)

const reset = () => {
	dose.value = null
	weight.value = null
	drug.value = null
	afterShuffleIV.value = null
	calculated.value = null

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

const decideValues = () => {
	if (dose.value === null || weight.value === null || drug.value === null || afterShuffleIV.value === null) {
		calculated.value = null
		return
	}

	if (!drug.value || drug.value !== 0) {
		calculated.value = dose.value * afterShuffleIV.value * weight.value / drug.value
	} else {
		calculated.value = null
	}
}

watch(() => dose.value, async () => {
	decideValues()
})

watch(() => weight.value, async () => {
	decideValues()
})

watch(() => drug.value, async () => {
	decideValues()
})

watch(() => afterShuffleIV.value, async () => {
	decideValues()
})

</script>

<template>
	<div class="flex flex-col">
		<header
			class="fixed flex space-x-4 justify-between items-center top-0 left-0 w-full font-bold text-transparent bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
			<ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack($router)" />
			<div class="flex flex-col">
				<div class="text-2xl">
					Epinephrine Rate
				</div>
				<div class="text-xl">
					에피네프린 속도
				</div>
			</div>
		</header>
		<div class="pt-20 space-y-4">
			<InputBox label="주입용량단위(mcg/kg/min)" v-model="dose" type="number" @keyup.enter="save" inputId="doseFocus"
				placeholder="0.00" />
			<InputBox label="체중(kg)" v-model="weight" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="약물의 용량(mg)" v-model="drug" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="혼합 후 수액량(ml)" v-model="afterShuffleIV" type="number" @keyup.enter="save" placeholder="0.00" />
		</div>

		<div class="md:hidden block fixed inset-x-0 text-center bottom-14 bg-white dark:bg-black py-2">
			주입 속도는
			<span class="font-bold text-app-600">
				{{ calculated === null ? '0.00' : calculated.toFixed(2) }}
			</span>
			<small>cc/hr</small> 입니다.
		</div>
		<div class="hidden md:block p-4 text-center">
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
