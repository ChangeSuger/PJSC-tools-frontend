<template>
  <div class="w-full h-full flex flex-col pl-2.5 gap-2">
    <div>
      <a-typography>
        <h1 class="text-3xl">设置</h1>
      </a-typography>
    </div>

    <div class="overflow-y-scroll">
      <div class="w-150 flex flex-col gap-2">
        <div>
          <a-typography>
            <h2 class="text-xl">LLM Config</h2>
          </a-typography>
        </div>

        <a-form :model="llmConfigForm" :label-width="LABEL_WIDTH">
          <a-form-item label="baseURL">
            <a-input
              class="max-w-125"
              v-model="llmConfigForm.baseURL"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="model">
            <a-input
              class="max-w-125"
              v-model="llmConfigForm.model"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="apiKey">
            <a-input
              class="max-w-125"
              v-model="llmConfigForm.apiKey"
              allow-clear
              show-password
            />
          </a-form-item>
        </a-form>

        <div>
          <a-typography>
            <h2 class="text-xl">TTS Config</h2>
          </a-typography>
        </div>

        <div class="w-full">
          <a-form :model="ttsConfigForm" :label-width="LABEL_WIDTH">
            <a-form-item label="baseURL">
              <a-input
                class="max-w-125"
                v-model="ttsConfigForm.baseURL"
                allow-clear
              />
            </a-form-item>

            <a-form-item label="batchSize">
              <a-slider
                class="max-w-125 inline-flex!"
                v-model="ttsConfigForm.batchSize"
                :min="3"
                :max="10"
                :step="1"
                show-input
              />
            </a-form-item>
          </a-form>

          <TTSCharacterConfigForm
            ref="ttsCharacterConfigFormRef"
            v-model:tts-character-config="ttsConfigForm"
            :label-width="LABEL_WIDTH"
          />
        </div>

        <div>
          <a-typography>
            <h2 class="text-xl">OSS Config</h2>
          </a-typography>
        </div>

        <a-form :model="ossConfigForm" :label-width="LABEL_WIDTH">
          <a-form-item label="region">
            <a-input
              class="max-w-125"
              v-model="ossConfigForm.region"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="accessKeyId">
            <a-input
              class="max-w-125"
              v-model="ossConfigForm.accessKeyId"
              allow-clear
              show-password
            />
          </a-form-item>

          <a-form-item label="accessKeySecret">
            <a-input
              class="max-w-125"
              v-model="ossConfigForm.accessKeySecret"
              allow-clear
              show-password
            />
          </a-form-item>

          <a-form-item label="bucket">
            <a-input
              class="max-w-125"
              v-model="ossConfigForm.bucket"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </div>
    </div>

    <a-space>
      <a-button type="primary" @click=saveSettings>保存设置</a-button>
      <a-button type="primary" status="danger" @click=initSettings>恢复初始化设置</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores';
import { ref } from 'vue';
import { LLM_CONFIG_INIT, TTS_CONFIG_INIT, OSS_CONFIG_INIT } from '@/datas';

import type {
  LLMConfig,
  TTSConfig,
  OSSConfig,
} from '@/types';

import TTSCharacterConfigForm from '@/components/tts/TTSCharacterConfigForm.vue';
import { Message } from '@arco-design/web-vue';

const LABEL_WIDTH = 120;

const settingsStore = useSettingsStore();

const llmConfigForm = ref<LLMConfig>({ ...settingsStore.getLLMConfig });
const ttsConfigForm = ref<TTSConfig>({ ...settingsStore.getTTSConfig });
const ossConfigForm = ref<OSSConfig>({ ...settingsStore.getOSSConfig });

const ttsCharacterConfigFormRef = ref<InstanceType<typeof TTSCharacterConfigForm>>();

function saveSettings() {
  const newTTSCharacterConfig = ttsCharacterConfigFormRef.value!.getTTSCharacterConfig();

  ttsConfigForm.value = {
    ...newTTSCharacterConfig,
    baseURL: ttsConfigForm.value.baseURL,
    batchSize: ttsConfigForm.value.batchSize,
  };

  settingsStore.setLLMConfig(llmConfigForm.value);
  settingsStore.setTTSConfig(ttsConfigForm.value);
  settingsStore.setOSSConfig(ossConfigForm.value);

  Message.success('配置已保存~');
}

function initSettings() {
  llmConfigForm.value = { ...LLM_CONFIG_INIT };
  ttsConfigForm.value = { ...TTS_CONFIG_INIT };
  ossConfigForm.value = { ...OSS_CONFIG_INIT };

  ttsCharacterConfigFormRef.value!.setTTSCharacterConfig(ttsConfigForm.value);

  settingsStore.setLLMConfig(llmConfigForm.value);
  settingsStore.setTTSConfig(ttsConfigForm.value);
  settingsStore.setOSSConfig(ossConfigForm.value);

  Message.success('配置初始化成功~');
}
</script>
