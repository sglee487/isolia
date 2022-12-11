<script setup lang="ts">
import { ref, watch } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

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
		output: calculated.value.toFixed(2)
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
		<div class="pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
			<div class="text-2xl">
				Epinephrine Rate
			</div>
			<div class="text-xl">
				에피네프린 속도
			</div>
		</div>
		<div class="space-y-4">
			<InputBox label="주입용량단위(mcg/kg/min)" v-model="dose" type="number" @keyup.enter="save" inputId="doseFocus"
				placeholder="0.00" />
			<InputBox label="체중(kg)" v-model="weight" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="약물의 용량(mg)" v-model="drug" type="number" @keyup.enter="save" placeholder="0.00" />
			<InputBox label="혼합 후 수액량(ml)" v-model="afterShuffleIV" type="number" @keyup.enter="save" placeholder="0.00" />
		</div>
		<div class="p-4 text-center">
			주입 속도는
			<span class="font-bold text-orange-600">
				{{ calculated === null ? '0.00' : calculated.toFixed(2) }}
			</span>
			<small>cc/hr</small> 입니다.
		</div>
		<div class="py-4 flex space-x-1">
			<ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
			<ButtonBox class="w-full" @click="save" color="orange">저장</ButtonBox>
		</div>
	</div>
</template>
