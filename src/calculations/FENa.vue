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

const una = ref<number | null>(null)
const scr = ref<number | null>(null)
const sna = ref<number | null>(null)
const ucr = ref<number | null>(null)
const variables = [una, scr, sna, ucr]

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

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.FENa)
try {
  if (lastSaved) {
    una.value = lastSaved.una
    scr.value = lastSaved.scr
    sna.value = lastSaved.sna
    ucr.value = lastSaved.ucr
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
    lastCalculated.setLastCalculated(CalculatorTypes.FENa, {
      una: una.value,
      scr: scr.value,
      sna: sna.value,
      ucr: ucr.value
    })
  })
})

const calculated = computed<number | null>(() => {
  if (sna.value === null || scr.value === null || una.value === null || ucr.value === null) {
    return null
  }

  if ((sna.value * ucr.value) === 0) {
    return null
  }

  return (una.value * scr.value) / (sna.value * ucr.value)
})

const reset = () => {
  una.value = null
  scr.value = null
  sna.value = null
  ucr.value = null

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
    type: 'FENa',
    input: {
      una: {
        label: 'UNa',
        value: una.value,
        unit: 'mmol/L'
      },
      scr: {
        label: 'SCr',
        value: scr.value,
        unit: 'mg/dL'
      },
      sna: {
        label: 'SNa',
        value: sna.value,
        unit: 'mmol/L'
      },
      ucr: {
        label: 'UNa',
        value: ucr.value,
        unit: 'mg/dL'
      }
    },
    output: {
      label: 'FENa',
      value: calculated.value.toFixed(2),
      unit: '%'
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
          FENa
        </div>
        <div class="text-xs">
          나트륨 분획 배설률
        </div>
      </div>
    </header>
    <div class="pt-16 space-y-4">
      <div>
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              소변 나트륨 농도 (UNa)
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="una" type="number" @keyup.enter="save" placeholder="0.00" inputId="topFocus" />
              <span>
                mmol/L
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              혈액 크레아틴 농도 (SCr)
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="scr" type="number" @keyup.enter="save" placeholder="0.00" />
              <span>
                mg/dL
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              혈액 나트륨 농도 (SNa)
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="sna" type="number" @keyup.enter="save" placeholder="0.00" />
              <span>
                mmol/L
              </span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="font-bold text-app-800 dark:text-app-100">
              소변 크레아틴 농도 (UCr)
            </div>
            <div class="flex space-x-2 items-center text-lg">
              <InputBox v-model="ucr" type="number" @keyup.enter="save" placeholder="0.00" />
              <span>
                mg/dL
              </span>
            </div>
          </div>
          <div class="text-center">
            FENa는
            <div>
              <span class="font-extrabold text-app-600 dark:text-app-50">
                {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
              </span>
              <small>%</small> 입니다.
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
