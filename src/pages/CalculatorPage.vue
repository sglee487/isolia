<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import Epinephrine from '@/calculations/EpinephrineRate.vue'

const CalculatorTypes = {
	Epinephrine: 'epinephrine'
}

const instance = getCurrentInstance()
const calculateHistory = useCalculateStore()

const props = defineProps<{
	name: string | null
}>()

const calculatorType = ref<any>()

if (props.name) {
	if (props.name === 'epinephrine') {
		calculatorType.value = CalculatorTypes.Epinephrine
	}
}

// @ts-ignore-next-line
watch(() => instance?.proxy?.$route.params.name, async (name) => {
	if (!name) {
		calculatorType.value = null
	} else if (name === 'epinephrine') {
		calculatorType.value = CalculatorTypes.Epinephrine
	}
})

</script>

<template>
	<div class="grid place-items-center">
		<div class="flex justify-between w-full">
			<ul class="flex flex-col items-center p-4">
				<li class="space-y-2">
					<router-link to="/calculator/epinephrine">
						<div>
							Epinephrine
						</div>
						<div>
							에피네프린
						</div>
					</router-link>
				</li>
			</ul>
			<div class="flex-initial w-1/3 font-naverNeo">
				<div v-if="calculatorType">
					<Epinephrine v-if="calculatorType === CalculatorTypes.Epinephrine" />
				</div>
				<div v-else>
					이것은 계산기 메인 페이지이다.
				</div>
			</div>
			<div class="flex-inital flex flex-col px-2 border border-red-700 space-y-2">
				<ul v-for="result in calculateHistory.results" :key="result['id']">
					<li>
						<div class="flex flex-col items-start">
							<div>
								type: {{ result['type'] }}
							</div>
							<div>
								주입용량단위(mcg/kg/min): {{ result['dose'] }}
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
	</div>
</template>
