<template>
  <div class="setting-view fill-current">
    <div class="setting-header">
      <el-text>
        <h1>设置</h1>
      </el-text>
    </div>

    <div class="setting-body">
      <div class="setting-form-wrapper">
        <div>
          <el-text>
            <h2>LLM Config</h2>
          </el-text>
        </div>

        <el-form :model="llmConfigForm" :label-width="LABEL_WIDTH">
          <el-form-item label="baseURL">
            <el-input
              style="max-width: 500px"
              v-model="llmConfigForm.baseURL"
              clearable
            />
          </el-form-item>

          <el-form-item label="model">
            <el-input
              style="max-width: 500px"
              v-model="llmConfigForm.model"
              clearable
            />
          </el-form-item>

          <el-form-item label="apiKey">
            <el-input
              style="max-width: 500px"
              v-model="llmConfigForm.apiKey"
              clearable
              show-password
            />
          </el-form-item>
        </el-form>

        <div>
          <el-text>
            <h2>TTS Config</h2>
          </el-text>
        </div>

        <div class="fill-width">
          <el-form :model="ttsConfigForm" :label-width="LABEL_WIDTH">
            <el-form-item label="baseURL">
              <el-input
                style="max-width: 500px"
                v-model="ttsConfigForm.baseURL"
                clearable
              />
            </el-form-item>

            <el-form-item label="batchSize">
              <el-slider
                style="max-width: 500px"
                v-model="ttsConfigForm.batchSize"
                :min="3"
                :max="10"
                :step="1"
                show-input
              />
            </el-form-item>
          </el-form>

          <TTSCharacterConfigForm
            ref="ttsCharacterConfigFormRef"
            v-model:tts-character-config="ttsConfigForm"
            :label-width="LABEL_WIDTH"
          />
        </div>

        <div>
          <el-text>
            <h2>OSS Config</h2>
          </el-text>
        </div>

        <el-form :model="ossConfigForm" :label-width="LABEL_WIDTH">
          <el-form-item label="region">
            <el-input
              style="max-width: 500px"
              v-model="ossConfigForm.region"
              clearable
            />
          </el-form-item>

          <el-form-item label="accessKeyId">
            <el-input
              style="max-width: 500px"
              v-model="ossConfigForm.accessKeyId"
              clearable
              show-password
            />
          </el-form-item>

          <el-form-item label="accessKeySecret">
            <el-input
              style="max-width: 500px"
              v-model="ossConfigForm.accessKeySecret"
              clearable
              show-password
            />
          </el-form-item>

          <el-form-item label="bucket">
            <el-input
              style="max-width: 500px"
              v-model="ossConfigForm.bucket"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="setting-footer">
      <el-button type="primary" @click=saveSettings>保存设置</el-button>
      <el-button type="danger" @click=initSettings>恢复初始化设置</el-button>
    </div>
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
import { ElMessage } from 'element-plus';

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

  ElMessage.success('配置已保存~');
}

function initSettings() {
  llmConfigForm.value = { ...LLM_CONFIG_INIT };
  ttsConfigForm.value = { ...TTS_CONFIG_INIT };
  ossConfigForm.value = { ...OSS_CONFIG_INIT };

  ttsCharacterConfigFormRef.value!.setTTSCharacterConfig(ttsConfigForm.value);

  settingsStore.setLLMConfig(llmConfigForm.value);
  settingsStore.setTTSConfig(ttsConfigForm.value);
  settingsStore.setOSSConfig(ossConfigForm.value);

  ElMessage.success('配置初始化成功~');
}
</script>

<style scoped lang="scss">
.setting-view {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  gap: 0.5rem;

  .setting-body {
    overflow-y: scroll;

    .setting-form-wrapper {
      width: 600px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .setting-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>