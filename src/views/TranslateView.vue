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
        :key="storyItem.content"
        :story-item="storyItem"
      >
        <el-button @click="translate(storyItem)">翻译</el-button>
      </StoryViewerItem>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    append-to-body
    center
    width="80%"
    title="提示词设置"
  >
    <el-form
      v-model="translateSystemMessageForm"
    >
      <el-form-item
        class="translate-form-item"
        v-for="(item, index) of translateSystemMessageForm"
        :key="index"
      >
        <el-input style="width: 200px" v-model="item.charecter" :disabled="item.charecter === 'default'" />
        <el-input style="flex: 1" type="textarea" autosize v-model="item.systemMessage" />
        <div style="width: 50px">
          <el-button type="danger" plain @click="deleteTranslateSystemMessageItem(index)" :icon="Delete" v-if="item.charecter !== 'default'"></el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain @click="addTranslateSystemMessageItem">添加配置</el-button>

    <template #footer>
      <el-button type="primary" plain @click="saveTranslateSystemMessageForm">保存</el-button>
      <el-button type="info" plain @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Upload, Download, Setting } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useSettingsStore, useTranslataStore } from '@/stores';
import OpenAI from "openai";

import type { StoryItem, TranslateSystemMessageItem } from '@/types';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import { Delete } from '@element-plus/icons-vue';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';

const settingsStore = useSettingsStore();
const translateStore = useTranslataStore();

const dialogVisible = ref(false);

const form = ref({
  scriptName: '',
});

const translateSystemMessageForm = ref<TranslateSystemMessageItem[]>(cloneDeep(translateStore.translateSystemMessageList));

const translateLoading = ref(false);

const storyList = ref<StoryItem[]>([
  {
    id: 'demo-test-001-1',
    character: '平野葵',
    content: '终于又见面了呢，拓君。这一年来过得可好？',
    contentJP: '拓くん、やっとまた会えたね。この一年、元気にしていた？',
    audioURLs: [],
  }
]);

async function translate(storyItem: StoryItem) {
  const llmConfig = settingsStore.getLLMConfig;

  const { apiKey, model, baseURL } = llmConfig;

  const systemMessage = translateStore.getSystemMessage(storyItem.character);

  const userMessage = `请翻译下面这句话：“${storyItem.content}”`;

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

  storyItem.contentJP = response.choices[0].message.content!;
}

async function translateAll() {
  if (!settingsStore.checkLLMConfig()) {
    ElMessage.error('LLM Config 配置不完善，请补全配置后重试。')
    return;
  }

  translateLoading.value = true;

  for (const storyItem of storyList.value) {
    if (!storyItem.contentJP) {
      await translate(storyItem);
    }
  }

  translateLoading.value = false;
}

function importScriptJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonstring = reader.result as string;
        const data = JSON.parse(jsonstring) as StoryItem[];
        storyList.value = data;
      }
      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const scriptdata = storyList.value;

  const json = JSON.stringify(scriptdata);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${form.value.scriptName}.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function openDialog() {
  translateSystemMessageForm.value = cloneDeep(translateStore.translateSystemMessageList);

  dialogVisible.value = true;
}

function closeDialog() {
  dialogVisible.value = false;
}

function addTranslateSystemMessageItem() {
  translateSystemMessageForm.value.push({
    charecter: '',
    systemMessage: '',
  });
}

function deleteTranslateSystemMessageItem(index: number) {
  translateSystemMessageForm.value.splice(index, 1);
}

function saveTranslateSystemMessageForm() {
  translateStore.setTranslateSystemMessageList(translateSystemMessageForm.value);
  closeDialog();
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

<style lang="scss">
.translate-form-item {

  .el-form-item__content {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: start;
  }
}
</style>