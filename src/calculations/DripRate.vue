<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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

const dosageUnits = ['mcg/kg/min', 'mcg/kg/hr', 'mcg/min', 'mcg/hr', 'mg/kg/min', 'mg/kg/hr', 'mg/min', 'mg/hr']

const dosage = ref<number | null>(null)
const dimensionBalanceValue = ref<number>(1.0)
const selectedDoseUnit = ref<string | null>(null)
const mg = ref<number | null>(null)
const ml = ref<number | null>(null)
const kg = ref<number | null>(null)
const variables = [mg, ml, kg]

// const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.DripRate)
// if (lastSaved) {
//   mg.value = lastSaved.mg
//   hr.value = lastSaved.hr
//   ml.value = lastSaved.ml
//   kg.value = lastSaved.kg
// }

const dosageUnitSelected = (unit: string) => {
  dimensionBalanceValue.value = 1.0
  if (!unit.includes('kg')) {
    kg.value = 1
  } else {
    kg.value = null
  }
  if (unit.includes('mcg')) {
    dimensionBalanceValue.value *= 0.0001
  }
  if (unit.includes('min')) {
    dimensionBalanceValue.value *= 60
  }
  selectedDoseUnit.value = unit
}

const isShowKg = computed(() => {
  return selectedDoseUnit.value === 'mcg/kg/min' || selectedDoseUnit.value === 'mcg/kg/hr' || selectedDoseUnit.value === 'mg/kg/min' || selectedDoseUnit.value === 'mg/kg/hr'
})

const calculated = computed<number | null>(() => {
  if (dosage.value === null || mg.value === null || ml.value === null || kg.value === null) {
    return null
  }

  return (dosage.value * dimensionBalanceValue.value) * kg.value / (mg.value / ml.value)
})

const reset = () => {
  dosage.value = null
  kg.value = null
  mg.value = null
  ml.value = null

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
    dosage: dosage.value,
    selectedDoseUnit: selectedDoseUnit.value,
    mg: mg.value,
    ml: ml.value,
    kg: kg.value
  }

  calculateHistory.addHistory(result)
  lastCalculated.setLastCalculated(CalculatorTypes.DripRate, result)
}

// watch(variables, () => {
//   if (calculated.value !== null) {
//     save()
//   }
// })

// const resultDescription = computed<string | null>(() => {
//   if (calculated.value === null) {
//     return null
//   }

//   if (calculated.value < 10) {
//     return '매우 빠름'
//   } else if (calculated.value < 20) {
//     return '빠름'
//   } else if (calculated.value < 30) {
//     return '보통'
//   } else if (calculated.value < 40) {
//     return '느림'
//   } else {
//     return '매우 느림'
//   }
// })

// const resultDescriptionColor = computed<string | null>(() => {
//   if (calculated.value === null) {
//     return null
//   }

//   if (calculated.value < 10) {
//     return 'text-green-500'
//   } else if (calculated.value < 20) {
//     return 'text-green-400'
//   } else if (calculated.value < 30) {
//     return 'text-yellow-500'
//   } else if (calculated.value < 40) {
//     return 'text-yellow-400'
//   } else {
//     return 'text-red-500'
//   }
// })

// const resultDescriptionIcon = computed<string | null>(() => {
//   if (calculated.value === null) {
//     return null
//   }

//   if (calculated.value < 10) {
//     return 'fas fa-arrow-up'
//   } else if (calculated.value < 20) {
//     return 'fas fa-arrow-up'
//   } else if (calculated.value < 30) {
//     return 'fas fa-arrow-right'
//   } else if (calculated.value < 40) {
//     return 'fas fa-arrow-down'
//   } else {
//     return 'fas fa-arrow-down'
//   }
// })

// const resultDescriptionIconColor = computed<string | null>(() => {
//   if (calculated.value === null) {
//     return null
//   }

//   if (calculated.value < 10) {
//     return 'text-green-500'
//   } else if (calculated.value < 20) {
//     return 'text-green-400'
//   } else if (calculated.value < 30) {
//     return 'text-yellow-500'
//   } else if (calculated.value < 40) {
//     return 'text-yellow-400'
//   } else {
//     return 'text-red-500'
//   }
// })

</script>

<template>
  <div class="flex flex-col">
    <header
      class="md:hidden transition duration-300 transform fixed flex w-full space-x-4 py-1 justify-between items-center top-0 left-0 font-bold bg-[#f5f5f5] dark:bg-[#18171c] z-50">
      <ArrowSmallLeftIcon class="flex-none w-8 h-8 pl-2 cursor-pointer text-black dark:text-white"
        @click="goBack($router)" />
      <div
        class="grow flex flex-col bg-clip-text text-transparent bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
        <div class="text-lg">
          Drip Rate
        </div>
        <div class="text-xs">
          수액주입 속도
        </div>
      </div>
    </header>
    <div class="pt-16 space-y-4">
      <div>
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="space-y-4">
              <div class="font-bold text-app-600 dark:text-app-500">
                투여량 및 단위
              </div>
              <div class="flex space-x-2 items-center text-lg">
                <InputBox v-model="dosage" type="number" @keyup.enter="save" placeholder="0.00" />
                <span>
                  {{ selectedDoseUnit ?? '??' }}
                </span>
              </div>
            </div>
            <div
              class="max-w-4xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              <ButtonBox v-for="dosageUnit, key in dosageUnits" :key="dosageUnit" size="sm" color="app"
                :active="dosageUnit === selectedDoseUnit" @click="dosageUnitSelected(dosageUnit)">
                {{ dosageUnit }}
              </ButtonBox>
            </div>
          </div>
          <div v-if="isShowKg" class="space-y-4">
            <div class="font-bold text-app-600 dark:text-app-500">
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
            <div class="font-bold text-app-600 dark:text-app-500">
              IV Bag Concentration
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="mg" type="number" @keyup.enter="save" placeholder="0.00" />
              <div>
                mg
              </div>
              <div class="px-2">
                /
              </div>
              <InputBox v-model="ml" type="number" @keyup.enter="save" placeholder="0.00" />
              <div>
                ml
              </div>
            </div>
          </div>
          <div class="p-4 text-center">
            수액 주입속도는
            <div>
              <span class="font-bold text-app-600">
                {{ calculated === null ? '0.00' : calculated.toFixed(4) }}
              </span>
              <small>ml/hr</small> 입니다.
            </div>
          </div>
          <div class="py-4 flex space-x-1">
            <ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
            <ButtonBox class="w-full" @click="save" color="app">저장</ButtonBox>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
