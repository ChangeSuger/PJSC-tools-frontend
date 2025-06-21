<template>
  <div class="translate-view fill-current">
    <div class="translate-header fill-width">
      <div class="translate-header-left">
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" style="margin-bottom: 0;">
            <el-input style="width: 240px" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div class="translate-header-center" v-if="translateLoading">
        {{ count }} / {{ total }}
      </div>

      <div class="translate-header-right">
        <el-button type="primary" text @click="translateAll" :loading="translateLoading" :disabled="translateLoading">
          批量翻译
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>

        <el-button type="primary" text :icon="Setting" @click="openDialog">
          提示词设置
        </el-button>
      </div>
    </div>

    <div class="translate-body">
      <StoryViewerItem
        v-for="storyItem in storyList"
        :key="storyItem.line"
        :story-item="storyItem"
      >
        <el-button @click="translate(storyItem)">翻译</el-button>
      </StoryViewerItem>
    </div>
  </div>

  <TranslateSystemMessageDialog ref="translateSystemMessageDialogFef" />
</template>

<script setup lang="ts">
import { Upload, Download, Setting } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { useSettingsStore, useTranslataStore } from '@/stores';
import OpenAI from "openai";
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryItem, StoryScript, StoryScriptFull } from '@/types';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import TranslateSystemMessageDialog from '@/components/translate/TranslateSystemMessageDialog.vue';
import { ElMessage } from 'element-plus';

const settingsStore = useSettingsStore();
const translateStore = useTranslataStore();

const translateSystemMessageDialogFef = ref<InstanceType<typeof TranslateSystemMessageDialog>>();

const form = ref({
  scriptName: '',
});

const total = ref(0);
const count = ref(0);

const translateLoading = ref(false);

const storyScript = ref<StoryScriptFull>();

const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  });
});

async function translate(storyItem: StoryItem) {
  const llmConfig = settingsStore.getLLMConfig;

  const { apiKey, model, baseURL } = llmConfig;

  const systemMessage = translateStore.getSystemMessage(storyItem.cid);

  const userMessage = `请翻译下面这句话：“${storyItem.line}”`;

  const client = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
    ],
  });

  storyItem.lineJP = response.choices[0].message.content!;
}

async function translateAll() {
  if (!settingsStore.checkLLMConfig()) {
    ElMessage.error('LLM Config 配置不完善，请补全配置后重试。')
    return;
  }

  translateLoading.value = true;

  total.value = storyList.value!.length;
  count.value = 0;

  for (const storyItem of storyList.value!) {
    if (!storyItem.lineJP) {
      await translate(storyItem);
      count.value = count.value + 1;
    }
  }

  translateLoading.value = false;
  ElMessage.success('批量翻译完成');
}

function importScriptJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      form.value.scriptName = file.name.split('.')[0];

      const reader = new FileReader();
      reader.onload = () => {
        const jsonstring = reader.result as string;
        const scriptData = JSON.parse(jsonstring) as StoryScript;
        storyScript.value = scriptAdaptIn(scriptData);
      }
      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const scriptdata = storyScript.value;

  const json = JSON.stringify(scriptdata);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${form.value.scriptName}.translate.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function openDialog() {
  translateSystemMessageDialogFef.value?.open();
}
</script>

<style scoped lang="scss">
.translate-view {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  gap: 8px;

  .translate-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .translate-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>