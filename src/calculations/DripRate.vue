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

const dosageUnits = ['mcg/kg/min', 'mcg/kg/kr', 'mcg/min', 'mcg/hr', 'mg/kg/min', 'mg/kg/hr', 'mg/min', 'mg/hr']

const dosage = ref<number | null>(null)
const dosageUnit = ref<string | null>(null)
const mg = ref<number | null>(null)
const hr = ref<number | null>(null)
const ml = ref<number | null>(null)
const kg = ref<number | null>(null)
const variables = [mg, hr, ml, kg]

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.DripRate)
if (lastSaved) {
  mg.value = lastSaved.mg
  hr.value = lastSaved.hr
  ml.value = lastSaved.ml
  kg.value = lastSaved.kg
}

const calculated = computed<number | null>(() => {
  if (mg.value === null || hr.value === null || ml.value === null || kg.value === null) {
    return null
  }

  if (!hr.value || hr.value !== 0) {
    return mg.value * ml.value / (kg.value * hr.value)
  } else {
    return null
  }
})

const dosageUnitSelected = computed(() => {
  if (dosageUnit.value === null) {
    return null
  }

  return dosageUnits.find((unit) => unit === dosageUnit.value)
})

const reset = () => {
  mg.value = null
  hr.value = null
  ml.value = null
  kg.value = null

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
    mg: mg.value,
    hr: hr.value,
    ml: ml.value,
    kg: kg.value
  }

  calculateHistory.addHistory(result)
  lastCalculated.setLastCalculated(CalculatorTypes.DripRate, result)
}

watch(variables, () => {
  if (calculated.value !== null) {
    save()
  }
})

const result = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  return calculated.value.toFixed(2)
})

const resultUnit = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  return 'ml/h'
})

const resultDescription = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  if (calculated.value < 10) {
    return '매우 빠름'
  } else if (calculated.value < 20) {
    return '빠름'
  } else if (calculated.value < 30) {
    return '보통'
  } else if (calculated.value < 40) {
    return '느림'
  } else {
    return '매우 느림'
  }
})

const resultDescriptionColor = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  if (calculated.value < 10) {
    return 'text-green-500'
  } else if (calculated.value < 20) {
    return 'text-green-400'
  } else if (calculated.value < 30) {
    return 'text-yellow-500'
  } else if (calculated.value < 40) {
    return 'text-yellow-400'
  } else {
    return 'text-red-500'
  }
})

const resultDescriptionIcon = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  if (calculated.value < 10) {
    return 'fas fa-arrow-up'
  } else if (calculated.value < 20) {
    return 'fas fa-arrow-up'
  } else if (calculated.value < 30) {
    return 'fas fa-arrow-right'
  } else if (calculated.value < 40) {
    return 'fas fa-arrow-down'
  } else {
    return 'fas fa-arrow-down'
  }
})

const resultDescriptionIconColor = computed<string | null>(() => {
  if (calculated.value === null) {
    return null
  }

  if (calculated.value < 10) {
    return 'text-green-500'
  } else if (calculated.value < 20) {
    return 'text-green-400'
  } else if (calculated.value < 30) {
    return 'text-yellow-500'
  } else if (calculated.value < 40) {
    return 'text-yellow-400'
  } else {
    return 'text-red-500'
  }
})

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
        투여량 및 단위
        <div class="flex flex-col space-y-4">
          <InputBox v-model="dosage" type="number" @keyup.enter="save" inputId="doseFocus" placeholder="0.00" />
          <div
            class="max-w-4xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <ButtonBox v-for="dosageUnit, key in dosageUnits" :key="dosageUnit" size="sm" color="app"
              @click="dosageUnitSelected(dosageUnit)">
              {{ dosageUnit }}
            </ButtonBox>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
