<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import Epinephrine from '@/calculations/EpinephrineRate.vue'

import { TrashIcon } from '@heroicons/vue/24/outline'

const CalculatorTypes = {
	Epinephrine: 'epinephrine'
}

const instance = getCurrentInstance()
const calculateHistory = useCalculateStore()

const calculatorType = ref<any>()

const routerParams = instance.proxy.$route.params


if (Object.keys(routerParams).includes('name')) {
	calculatorType.value = routerParams.name
} else {
	instance.proxy.$router.push(`/calculator/${CalculatorTypes.Epinephrine}`)
}

watch(() => instance.proxy.$route.params.name, async (name) => {
	calculatorType.value = name
})

const routes = [
	{
		to: '/calculator/epinephrine',
		name: 'Epinephrine',
		nameKo: '에피네프린'
	}
]

const labels = {
	dose: '주입용량단위',
	weight: '체중',
	drug: '약물의 용량',
	afterShuffleIV: '혼합 후 수액량'
}

const units = {
	dose: 'mcg/kg/min',
	weight: 'kg',
	drug: 'mg',
	afterShuffleIV: 'ml'
}
</script>

<template>
	<div class="flex flex-col md:flex-row justify-between w-full">
		<ul
			class="h-full hidden md:flex flex-col items-center w-64 border-r border-gray-300 text-xl font-bold overflow-y-auto">
			<li v-for="route in routes" :key="route.to" class="w-full">
				<router-link :to="route.to" class="block text-center py-2 hover:bg-orange-400 hover:text-white">
					{{ route.name }}<br>
					<small>{{ route.nameKo }}</small>
				</router-link>
			</li>
		</ul>
		<div class="w-full md:w-1/3 font-naverNeo p-10">
			<div v-if="calculatorType">
				<Epinephrine v-if="calculatorType === CalculatorTypes.Epinephrine" />
			</div>
			<div v-else>
				현재 에피네프린(Epinephrine) 계산기만 제공하고 있습니다.
			</div>
		</div>
		<hr class="block md:hidden border-gray-300">
		<div class="flex flex-col w-full md:w-72 border-l border-gray-300 overflow-visible md:overflow-y-auto">
			<ul v-for="(result, index) in calculateHistory.results" :key="index">
				<li class="block text-center p-5 border-b border-gray-300">
					<div class="flex flex-row justify-between items-start">
						<div class="flex flex-col items-start">
							<div class="text-xs text-left font-bold text-gray-600 pt-1">
								{{ result['createdAt'] }}
							</div>
							<hr class="h-3">
							<div class="font-bold text-orange-600">
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
								<div class="text-sm text-left text-orange-600 font-bold w-28 ">
									주입속도
								</div>
								<div class="text-left mr-1">
									{{ result.output }}
								</div>
								<div class="text-xs">
									cc/hr
								</div>
							</div>
						</div>
						<TrashIcon class="w-5 h-5 text-red-400 cursor-pointer" @click="calculateHistory.removeResult(index)" />
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.router-link-exact-active {
	background-color: rgb(251 146 60);
	color: #fff;
}
</style>
