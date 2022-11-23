<script setup lang="ts">
import { ref } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import InputBox from './InputBox.vue'
import ButtonBox from './ButtonBox.vue'

const calculateHistory = useCalculateStore()

var dose = ref<number>(0.0)
var weight = ref<number>(0.0)
var drug = ref<number>(0.0)
var afterShuffleIV = ref<number>(0.0)
var result = ref<number>(0.0)


const save = () => {
	// if (dose.value == 0.0 || weight.value == 0.0 || drug.value == 0.0) {
	// 	alert("값을 입력해주세요.")
	// 	return
	// }
	// afterShuffleIV.value = dose.value * 1000 / weight.value
	// result.value = afterShuffleIV.value * drug.value
	const result = {
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
		<div class="space-y-4">
			<InputBox label="주입용량단위(mcg/kg/min)" v-model="dose" />
			<InputBox label="체중(kg)" v-model="weight" />
			<InputBox label="약물의 용량(mg)" v-model="drug" />
			<InputBox label="혼합 후 수액량(ml)" v-model="afterShuffleIV" />
		</div>
		<div class="p-4">
			주입 속도는 {{ (dose * afterShuffleIV * weight / drug).toFixed(2) }} 입니다.
		</div>
		<div class="p-4">
			<ButtonBox @click="save" color="blue">저장</ButtonBox>
		</div>
	</div>
</template>