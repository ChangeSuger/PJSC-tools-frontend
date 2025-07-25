<template>
  <a-form :model="modelForm" auto-label-width layout="inline">
    <a-form-item label="SoVITS 模型" class="mb-0!">
      <a-select
        class="w-100!"
        v-model="modelForm.sovitsModel"
        :options="ttsModelStore.getSovitsOptions"
        allow-search
      />
    </a-form-item>

    <a-form-item label="GPT 模型" class="mb-0!">
      <a-select
        class="w-100!"
        v-model="modelForm.gptModel"
        :options="ttsModelStore.getGptOptions"
        allow-search
      />
    </a-form-item>

    <a-button @click="changeModel" :disabled="changeModelDisabled" :loading="modelChangeLoading">更换模型</a-button>
  </a-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { useTTSModelStore, useSettingsStore } from '@/stores';
import { CommonApi } from '@/api';
import { Message } from '@arco-design/web-vue';

const ttsModelStore = useTTSModelStore();
const settingsStore = useSettingsStore();

const modelForm = ref({
  sovitsModel: ttsModelStore.getSovitsModelSelected,
  gptModel: ttsModelStore.getGptmodelSelected,
});

const modelChangeLoading = ref(false);

const changeModelDisabled = computed(() => {
  return (
    modelForm.value.sovitsModel === ttsModelStore.getSovitsModelSelected &&
    modelForm.value.gptModel === ttsModelStore.getGptmodelSelected
  );
});

async function changeModel() {
  modelChangeLoading.value = true;

  const { sovitsModel, gptModel } = modelForm.value;
  const res = await CommonApi.changeModel({
    url: settingsStore.getTTSConfig.baseURL,
    sovitsModel,
    gptModel,
    originLang: '日文',
    targetLang: '日文',
  });

  if (res.code === 200) {
    ttsModelStore.setSovitsModelSelected(sovitsModel);
    ttsModelStore.setGptModelSelected(gptModel);
    modelChangeLoading.value = false;
    Message.success('模型更换成功');
  } else {
    Message.error('更换模型失败，请重试');
  }
}
</script>
