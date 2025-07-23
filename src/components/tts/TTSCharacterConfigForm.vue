<template>
  <a-form :model="ttsCharacterConfigForm" :label-width="labelWidth">
    <a-form-item label="切分方式">
      <a-select v-model="ttsCharacterConfigForm.sliceMethod" :options="SLICE_METHOD_OPTIONS" />
    </a-form-item>

    <a-form-item label="采样步长">
      <a-radio-group
        v-model="ttsCharacterConfigForm.samplingStep"
        :options="SAMPLING_STEP_OPTIONS"
        type="button"
      />
    </a-form-item>

    <a-form-item label="语速">
      <a-slider
        class="max-w-125 inline-flex!"
        v-model="ttsCharacterConfigForm.speed"
        :min="0.6"
        :max="1.65"
        :step="0.05"
        show-input
      />
    </a-form-item>

    <a-form-item label="句间停顿秒数">
      <a-slider
        class="max-w-125 inline-flex!"
        v-model="ttsCharacterConfigForm.pauseBetweenSentences"
        :min="0.1"
        :max="0.5"
        :step="0.05"
        show-input
      />
    </a-form-item>

    <a-form-item label="top_k">
      <a-slider
        class="max-w-125 inline-flex!"
        v-model="ttsCharacterConfigForm.topK"
        :min="1"
        :max="100"
        :step="1"
        show-input
      />
    </a-form-item>

    <a-form-item label="top_p">
      <a-slider
        class="max-w-125 inline-flex!"
        v-model="ttsCharacterConfigForm.topP"
        :min="0"
        :max="1"
        :step="0.05"
        show-input
      />
    </a-form-item>

    <a-form-item label="temperature">
      <a-slider
        class="max-w-125 inline-flex!"
        v-model="ttsCharacterConfigForm.temperature"
        :min="0"
        :max="1"
        :step="0.05"
        show-input
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { TTSCharacterConfig } from '@/types';
import { type PropType, ref } from 'vue';
import {
  SLICE_METHOD_OPTIONS,
  SAMPLING_STEP_OPTIONS,
} from '@/datas';

defineExpose({
  getTTSCharacterConfig,
  setTTSCharacterConfig,
});

const props = defineProps({
  ttsCharacterConfig: {
    type: Object as PropType<TTSCharacterConfig>,
    required: true,
  },
  labelWidth: {
    type: [Number, String],
    default: 'auto',
  }
});

const ttsCharacterConfigForm = ref<TTSCharacterConfig>({
  ...props.ttsCharacterConfig
});

function getTTSCharacterConfig() {
  return { ...ttsCharacterConfigForm.value };
}

function setTTSCharacterConfig(config: TTSCharacterConfig) {
  ttsCharacterConfigForm.value = { ...config };
}
</script>
