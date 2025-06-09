<template>
  <div class="setting-view fill-current">
    <div>
      <el-text>
        <h1>设置</h1>
      </el-text>
    </div>

    <div>
      <el-text>
        <h2>LLM Config</h2>
      </el-text>
    </div>

    <el-form :model="llmConfigForm" label-width="auto">
      <el-form-item label="baseURL">
        <el-input style="width: 400px" v-model="llmConfigForm.baseURL" clearable />
      </el-form-item>
      <el-form-item label="model">
        <el-input style="width: 400px" v-model="llmConfigForm.model" clearable />
      </el-form-item>
      <el-form-item label="apiKey">
        <el-input style="width: 400px" v-model="llmConfigForm.apiKey" clearable />
      </el-form-item>
    </el-form>

    <div>
      <el-text>
        <h2>TTS Config</h2>
      </el-text>
    </div>

    <el-form :model="ttsConfigForm" label-width="auto">
      <el-form-item label="baseURL">
        <el-input style="width: 400px" v-model="ttsConfigForm.baseURL" clearable />
      </el-form-item>
    </el-form>

    <div>
      <el-text>
        <h2>OSS Config</h2>
      </el-text>
    </div>

    <el-form :model="ossConfigForm" label-width="auto">
      <el-form-item label="region">
        <el-input style="width: 400px" v-model="ossConfigForm.region" clearable />
      </el-form-item>
      <el-form-item label="accessKeyId">
        <el-input style="width: 400px" v-model="ossConfigForm.accessKeyId" clearable />
      </el-form-item>
      <el-form-item label="accessKeySecret">
        <el-input style="width: 400px" v-model="ossConfigForm.accessKeySecret" clearable />
      </el-form-item>
      <el-form-item label="bucket">
        <el-input style="width: 400px" v-model="ossConfigForm.bucket" clearable />
      </el-form-item>
    </el-form>

    <el-button type="primary" @click=saveSettings>保存设置</el-button>

  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores';
import { ref } from 'vue';
import type { LLMConfig, TTSConfig, OSSConfig } from '@/types';

const settingsStore = useSettingsStore();
const llmConfigForm = ref<LLMConfig>({ ...settingsStore.getLLMConfig });
const ttsConfigForm = ref<TTSConfig>({ ...settingsStore.getTTSConfig });
const ossConfigForm = ref<OSSConfig>({ ...settingsStore.getOSSConfig });

function saveSettings() {
  settingsStore.setLLMConfig(llmConfigForm.value);
  settingsStore.setTTSConfig(ttsConfigForm.value);
  settingsStore.setOSSConfig(ossConfigForm.value);
}
</script>

<style scoped lang="scss">
.setting-view {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-left: 20px;
  gap: 0.5rem;
}
</style>