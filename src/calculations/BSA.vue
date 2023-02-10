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

const formulaUnits = ['Mosteller', 'DuBois']

const cm = ref<number | null>(null)
const kg = ref<number | null>(null)
const selectedFormula = ref<string | null>(null)
const variables = [cm, kg, selectedFormula]

const formulaSelected = (unit: string) => {
  selectedFormula.value = unit
}

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

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.BSA)
try {
  if (lastSaved) {
    formulaSelected(lastSaved.selectedFormula)

    cm.value = lastSaved.cm
    kg.value = lastSaved.kg
    selectedFormula.value = lastSaved.selectedFormula
  }
} catch (e) {
  console.log(e)
}

variables.forEach(variable => {
  watch(() => variable.value, async () => {
    if (variable.value === '') {
      variable.value = null
    }
    if (variable.value !== null && typeof variable.value === 'number' && variable.value < 0) {
      variable.value = 0
    }
    lastCalculated.setLastCalculated(CalculatorTypes.BSA, {
      cm: cm.value,
      kg: kg.value,
      selectedFormula: selectedFormula.value
    })
  })
})

const calculated = computed<number | null>(() => {
  if (cm.value === null || kg.value === null || selectedFormula.value === null) {
    return null
  }

  if (selectedFormula.value === 'Mosteller') {
    // return 0.024265 * Math.pow(cm.value, 0.3964) * Math.pow(kg.value, 0.5378)
    return Math.sqrt(kg.value * cm.value / 3600)
  } else if (selectedFormula.value === 'DuBois') {
    return 0.007184 * Math.pow(cm.value, 0.725) * Math.pow(kg.value, 0.425)
  } else {
    return null
  }
})

const reset = () => {
  cm.value = null
  kg.value = null
  selectedFormula.value = null

  document.getElementById('topFocus')?.focus()
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
    type: 'BSA',
    input: {
      cm: {
        label: '키',
        value: cm.value,
        unit: 'cm'
      },
      kg: {
        label: '몸무게',
        value: kg.value,
        unit: 'kg'
      },
      formula: {
        label: '공식',
        value: selectedFormula.value,
        unit: ''
      }
    },
    output: {
      label: '체표면적',
      value: calculated.value.toFixed(2),
      unit: 'm²'
    }
  }
  calculateHistory.addHistory(result)
}

</script>

<template>
  <div class="flex flex-col">
    <header :class="{ 'hiddenHeader': isHideHeader }"
      class="md:hidden transition duration-300 transform fixed flex w-full space-x-4 py-1 justify-between items-center top-0 left-0 font-bold bg-[#f5f5f5] dark:bg-[#18171c] z-50">
      <ArrowSmallLeftIcon class="flex-none w-8 h-8 pl-2 cursor-pointer text-black dark:text-white"
        @click="goBack($router)" />
      <div class="grow flex flex-col">
        <div class="text-lg">
          BSA
        </div>
        <div class="text-xs">
          체표면적
        </div>
      </div>
    </header>
    <div class="pt-16 space-y-4">
      <div>
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              키
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="cm" type="number" @keyup.enter="save" placeholder="0.00" inputId="topFocus" />
              <span>
                cm
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              몸무게
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="kg" type="number" @keyup.enter="save" placeholder="0.00" />
              <span>
                kg
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              공식
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <ButtonBox v-for=" formulaUnit, key in formulaUnits" :key="formulaUnit" size="sm" color="app"
                :active="formulaUnit === selectedFormula" @click="formulaSelected(formulaUnit)">
                {{ formulaUnit }}
              </ButtonBox>
            </div>
          </div>
          <div class="text-center">
            체표면적은
            <div>
              <span class="font-extrabold text-app-600 dark:text-app-50">
                {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
              </span>
              <small>m²</small> 입니다.
            </div>
          </div>
          <div class="pb-4 flex space-x-1">
            <ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
            <ButtonBox class="w-full" @click="save" color="app">저장</ButtonBox>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.hiddenHeader {
  transform: translateY(-100%);
}
</style>
