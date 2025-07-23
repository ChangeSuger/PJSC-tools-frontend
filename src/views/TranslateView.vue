<template>
  <div class="w-full h-full flex flex-col pl-2.5">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div>
        <a-form :inline="true" :model="form">
          <a-form-item label="剧本名" class="mb-0!">
            <a-input class="w-60!" v-model="form.scriptName" allow-clear />
          </a-form-item>
        </a-form>
      </div>

      <div v-if="translateLoading">
        {{ count }} / {{ total }}
      </div>

      <a-button-group>
        <a-button type="text" @click="translateAll" :loading="translateLoading" :disabled="translateLoading">
          批量翻译
        </a-button>

        <a-button type="text" @click="importScriptJSON">
          导入剧本
        </a-button>

        <a-button type="text" @click="exportScriptJSON">
          导出剧本
        </a-button>

        <a-button type="text" @click="openDialog">
          提示词设置
        </a-button>
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <StoryViewerItem
        v-for="storyItem in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
      >
        <a-button @click="translate(storyItem)">翻译</a-button>
      </StoryViewerItem>
    </div>
  </div>

  <TranslateSystemMessageDialog ref="translateSystemMessageDialogFef" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSettingsStore, useTranslataStore } from '@/stores';
import OpenAI from "openai";
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryItem, StoryScript, StoryScriptFull } from '@/types';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import TranslateSystemMessageDialog from '@/components/translate/TranslateSystemMessageDialog.vue';
import { Message } from '@arco-design/web-vue';

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
    Message.error('LLM Config 配置不完善，请补全配置后重试。')
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
  Message.success('批量翻译完成');
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
