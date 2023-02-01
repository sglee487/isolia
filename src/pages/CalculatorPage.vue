<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
	TrashIcon
} from '@heroicons/vue/24/outline'

import { useCalculateStoreHistory } from '@/stores/calculateStore'

import Epinephrine from '@/calculations/EpinephrineRate.vue'
import BMI from '@/calculations/BMI.vue'
import CalculatorTypes from '@/enums/calculateTypes'

const instance = getCurrentInstance()
const calculateHistory = useCalculateStoreHistory()

const calculatorType = ref<any>()

const routerParams = instance.proxy.$route.params

if (Object.keys(routerParams).includes('name')) {
	calculatorType.value = routerParams.name
}

watch(() => instance.proxy.$route.params.name, async (name) => {
	calculatorType.value = name
})

const routes = [
	{
		to: '/calculator/epinephrineRate',
		name: 'Epinephrine',
		nameKo: '에피네프린',
		detailUnits: 'mcg/kg/min -> ml/hr'
	},
	{
		to: '/calculator/bmi',
		name: 'BMI',
		nameKo: '체질량지수',
		detailUnits: 'kg/cm -> kg/m^2'
	}
]

const labels = {
	dose: '주입용량단위',
	weight: '체중',
	drug: '약물의 용량',
	afterShuffleIV: '혼합 후 수액량',
	height: '키'
}

const units = {
	dose: 'mcg/kg/min',
	weight: 'kg',
	drug: 'mg',
	afterShuffleIV: 'ml',
	height: 'cm',
	bmi: 'kg/m^2'
}
</script>

<template>
	<div class="flex flex-col w-full h-full mb-24 md:mb-0">
		<div class="flex flex-col md:flex-row justify-between w-full h-full">
			<ul
				class="h-full flex-none hidden md:flex flex-col items-center w-[255px] border-r border-gray-300 text-xl font-bold overflow-y-auto">
				<li v-for="route in routes" :key="route.to" class="w-full">
					<router-link :to="route.to" class="block text-center py-2 hover:bg-app-400 hover:text-white">
						{{ route.name }}
						<br>
						<small>{{ route.nameKo }}</small>
						<br>
						<small class="text-sm">({{ route.detailUnits }})</small>
					</router-link>
				</li>
			</ul>
			<div class="grow font-naverNeo pt-4 pr-10 md:p-10">
				<div v-if="calculatorType" class="pl-10">
					<Epinephrine v-if="calculatorType === CalculatorTypes.EpinephrineRate" />
					<BMI v-if="calculatorType === CalculatorTypes.BMI" />
				</div>
				<div v-else class="flex flex-col pl-8 pb-2">
					<div class="md:hidden flex flex-col">
						<div
							class="pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200 text-2xl">
							계산기
						</div>
						<ul class="grid grid-cols-2 gap-4 justify-items-center mb-2">
							<li v-for="route in routes" :key="route.to" class="w-full">
								<router-link :to="route.to"
									class="block text-center py-2 hover:bg-app-500 hover:text-white rounded-xl bg-app-300 dark:bg-app-950">
									<span class="font-bold">{{ route.name }}</span>
									<br>
									<small>{{ route.nameKo }}</small>
									<br>
									<small class="text-sm">({{ route.detailUnits }})</small>
								</router-link>
							</li>
						</ul>
					</div>
					<div>
						※ 추가하고 싶으신 계산기가 있다면, 건의게시판을 이용해주세요.
					</div>
				</div>
			</div>
			<hr class="block md:hidden border-gray-300 dark:border-gray-700">
			<div
				class="flex flex-col w-full md:w-80 md:border-l border-gray-300 dark:border-gray-700 overflow-visible md:overflow-y-auto">
				<ul v-for="(result, index) in calculateHistory.results" :key="index">
					<li class="block text-center p-5 ">
						<div class="flex flex-col items-start">
							<div class="flex flex-row w-full justify-between">
								<div class="text-xs font-bold text-gray-600 pt-1">
									{{ result['createdAt'] }}
								</div>
								<TrashIcon class="w-5 h-5 text-red-400 cursor-pointer" @click="calculateHistory.removeResult(index)" />
							</div>
							<hr class="h-1">
							<div class="font-bold text-app-600">
								{{ result['type'] }}
							</div>
							<div v-for="(value, key) in result.input" :key="key" class="flex items-center">
								<div class="text-sm text-left font-bold w-28">
									{{ labels[key] }}
								</div>
								<div class="text-left mr-1">
									{{ value }}
								</div>
								<div class="text-xs">
									{{ units[key] }}
								</div>
							</div>
							<hr class="border-0 h-2">
							<div class="flex items-center">
								<div class="text-sm text-left text-app-600 font-bold w-28 ">
									{{ result.output.label }}
								</div>
								<div class="text-left mr-1">
									{{ result.output.value }}
								</div>
								<div class="text-xs">
									{{ result.output.unit }}
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.router-link-exact-active {
	background-color: rgb(56 189 248);
	color: #fff;
}
</style>
