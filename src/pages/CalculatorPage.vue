<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import Epinephrine from '../components/Epinephrine.vue'

const CalculatorTypes = {
	Epinephrine: 'epinephrine'
}

const instance = getCurrentInstance()

const props = defineProps<{
	name: string | null
}>()

var calculatorType = ref<any>()

if (props.name) {
	if (props.name === 'epinephrine') {
		calculatorType.value = CalculatorTypes.Epinephrine
	}
}

//@ts-ignore-next-line
watch(() => instance?.proxy?.$route.params.name, async (name) => {
	console.log(name)
	if (!name) {
		calculatorType.value = null
	}
	else if (name === 'epinephrine') {
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
			<ul class="flex flex-col items-center">
				<li>
					저장1
				</li>
				<li>
					저장2
				</li>
			</ul>
		</div>
	</div>
</template>