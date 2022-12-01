<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import Epinephrine from '@/calculations/EpinephrineRate.vue'

const CalculatorTypes = {
	Epinephrine: 'epinephrine'
}

const instance = getCurrentInstance()
const calculateHistory = useCalculateStore()

const calculatorType = ref<any>()

const routerParams = instance.proxy.$route.params

if (routerParams) {
	calculatorType.value = routerParams.name
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
</script>

<template>
	<div class="flex justify-between w-full">
		<ul class="h-full flex flex-col items-center w-64 border-r border-gray-300 text-xl font-bold">
			<li v-for="route in routes" :key="route.to" class="w-full">
				<router-link :to="route.to" class="block text-center py-2 hover:bg-orange-400 hover:text-white">
					{{ route.name }}<br>
					<small>{{ route.nameKo }}</small>
				</router-link>
			</li>
		</ul>
		<div class="w-1/3 font-naverNeo p-10">
			<div v-if="calculatorType">
				<Epinephrine v-if="calculatorType === CalculatorTypes.Epinephrine" />
			</div>
			<div v-else>
				이것은 계산기 메인 페이지이다.
			</div>
		</div>
		<div class="flex flex-col w-64 border-l border-gray-300">
			<ul v-for="result in calculateHistory.results" :key="result['id']">
				<li class="block text-center p-5 border-b border-gray-300">
					<div class="flex flex-col items-start">
						<div>
							{{ result['type'] }}
						</div>
						<div>
							{{ result['dose'] }}
						</div>
						<div>
							{{ result['weight'] }}
						</div>
						<div>
							{{ result['drug'] }}
						</div>
						<div>
							{{ result['afterShuffleIV'] }}
						</div>
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
