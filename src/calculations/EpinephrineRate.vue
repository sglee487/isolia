<script setup lang="ts">
import { ref } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import short from 'short-uuid'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

const calculateHistory = useCalculateStore()

const dose = ref<number>(0.0)
const weight = ref<number>(0.0)
const drug = ref<number>(0.0)
const afterShuffleIV = ref<number>(0.0)
const result = ref<number>(0.0)

const reset = () => {
	dose.value = 0.0
	weight.value = 0.0
	drug.value = 0.0
	afterShuffleIV.value = 0.0
	result.value = 0.0
}

const save = () => {
	// if (dose.value == 0.0 || weight.value == 0.0 || drug.value == 0.0) {
	// 	alert("값을 입력해주세요.")
	// 	return
	// }
	// afterShuffleIV.value = dose.value * 1000 / weight.value
	// result.value = afterShuffleIV.value * drug.value
	const result = {
		id: short.generate(),
		type: 'epinephrine',
		dose: dose.value,
		weight: weight.value,
		drug: drug.value,
		afterShuffleIV: afterShuffleIV.value
	}
	calculateHistory.addResult(result)
}

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
			<InputBox label="주입용량단위(mcg/kg/min)" v-model="dose" />
			<InputBox label="체중(kg)" v-model="weight" />
			<InputBox label="약물의 용량(mg)" v-model="drug" />
			<InputBox label="혼합 후 수액량(ml)" v-model="afterShuffleIV" />
		</div>
		<div class="p-4">
			주입 속도는 {{ (dose * afterShuffleIV * weight / drug).toFixed(2) }} 입니다.
		</div>
		<div class="py-4 flex space-x-1">
			<ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
			<ButtonBox class="w-full" @click="save" color="orange">저장</ButtonBox>
		</div>
	</div>
</template>
