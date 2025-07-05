<template>
  <el-form :model="ttsCharacterConfigForm" :label-width="labelWidth">
    <el-form-item label="切分方式">
      <el-select v-model="ttsCharacterConfigForm.sliceMethod">
        <el-option
          v-for="method of SLICE_METHOD_OPTIONS"
          :key="`slice-method-${method}`"
          :value="method"
          :label="method"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="采样步长">
      <el-radio-group v-model="ttsCharacterConfigForm.samplingStep">
        <el-radio-button
          v-for="step of SAMPLING_STEP_OPTIONS"
          :key="`sampling-step-${step}`"
          :value="step"
        >
          {{ step }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="语速">
      <el-slider
        class="max-w-125"
        v-model="ttsCharacterConfigForm.speed"
        :min="0.6"
        :max="1.65"
        :step="0.05"
        show-input
      />
    </el-form-item>

    <el-form-item label="句间停顿秒数">
      <el-slider
        class="max-w-125"
        v-model="ttsCharacterConfigForm.pauseBetweenSentences"
        :min="0.1"
        :max="0.5"
        :step="0.05"
        show-input
      />
    </el-form-item>

    <el-form-item label="top_k">
      <el-slider
        class="max-w-125"
        v-model="ttsCharacterConfigForm.topK"
        :min="1"
        :max="100"
        :step="1"
        show-input
      />
    </el-form-item>

    <el-form-item label="top_p">
      <el-slider
        class="max-w-125"
        v-model="ttsCharacterConfigForm.topP"
        :min="0"
        :max="1"
        :step="0.05"
        show-input
      />
    </el-form-item>

    <el-form-item label="temperature">
      <el-slider
        class="max-w-125"
        v-model="ttsCharacterConfigForm.temperature"
        :min="0"
        :max="1"
        :step="0.05"
        show-input
      />
    </el-form-item>
  </el-form>
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
