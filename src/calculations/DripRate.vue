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

const dosageUnits = ['mcg/kg/min', 'mcg/kg/hr', 'mcg/min', 'mcg/hr', 'mg/kg/min', 'mg/kg/hr', 'mg/min', 'mg/hr']

const dosage = ref<number | null>(null)
const selectedDoseUnit = ref<string | null>(null)
const mg = ref<number | null>(null)
const ml = ref<number | null>(null)
const kg = ref<number | null>(null)
const variables = [dosage, selectedDoseUnit, mg, ml, kg]

const ivBagConcentration = computed<number | null>(() => {
  if (mg.value === null || ml.value === null) {
    return null
  }

  return mg.value / ml.value
})

const dosageUnitSelected = (unit: string) => {
  console.log(unit)
  if (!unit.includes('kg')) {
    kg.value = 1
  } else {
    kg.value = null
  }
  selectedDoseUnit.value = unit
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

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.DripRate)
try {
  if (lastSaved) {
    dosageUnitSelected(lastSaved.selectedDoseUnit)

    dosage.value = lastSaved.dosage
    selectedDoseUnit.value = lastSaved.selectedDoseUnit
    mg.value = lastSaved.mg
    ml.value = lastSaved.ml
    kg.value = lastSaved.kg
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
    lastCalculated.setLastCalculated(CalculatorTypes.DripRate, {
      dosage: dosage.value,
      selectedDoseUnit: selectedDoseUnit.value,
      mg: mg.value,
      ml: ml.value,
      kg: kg.value
    })
  })
})

const dimensionBalanceValue = computed<number>(() => {
  let value = 1.0
  if (selectedDoseUnit.value?.includes('mcg')) {
    value *= 0.0001
  }
  if (selectedDoseUnit.value?.includes('min')) {
    value *= 60
  }
  return value
})

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
    type: 'Drip Rate',
    input: {
      dose: {
        label: '투여량',
        value: dosage.value,
        unit: selectedDoseUnit.value
      },
      weight: isShowKg.value
        ? {
          label: '체중',
          value: '5654',
          unit: 'kg'
        }
        : null,
      drug: {
        label: 'IV Bag',
        value: ivBagConcentration.value.toFixed(4),
        unit: 'mg/ml'
      }
    },
    output: {
      label: '주입속도',
      value: calculated.value.toFixed(4),
      unit: 'ml/hr'
    }
  }
  calculateHistory.addHistory(result)
}

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
    <header :class="{ 'hiddenHeader': isHideHeader }"
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
              class="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-1 mld:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <ButtonBox v-for=" dosageUnit, key in dosageUnits" :key="dosageUnit" size="sm" color="app"
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
          <div class="text-center">
            수액 주입속도는
            <div>
              <span class="font-bold text-app-600">
                {{ calculated === null ? '0.0000' : calculated.toFixed(4) }}
              </span>
              <small>ml/hr</small> 입니다.
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