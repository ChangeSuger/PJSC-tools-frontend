<template>
  <div class="w-full h-full flex flex-col pl-2.5">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div>
        <ManageScriptJSON
          suffix="translate"
          :story-script="storyScript"
          :onReaderLoad="onReaderLoad"
        />
      </div>

      <div v-if="translateLoading">
        {{ count }} / {{ total }}
      </div>

      <a-button-group>
        <a-button
          type="text"
          @click="translateAll"
          :loading="translateLoading"
          :disabled="translateLoading"
        >
          批量翻译
        </a-button>

        <TranslateSystemMessageDialog />
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <StoryViewerItem
        v-for="storyItem in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
      >
        <a-button @click="translate(storyItem)" v-if="NeedTranslate(storyItem)">翻译</a-button>
      </StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSettingsStore, useTranslataStore } from '@/stores';
import OpenAI from "openai";
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryItem, StoryScript, StoryScriptFull } from '@/types';
import { CHARACTER_BLACK_LIST } from '@/datas';
import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import TranslateSystemMessageDialog from '@/components/translate/TranslateSystemMessageDialog.vue';
import { Message } from '@arco-design/web-vue';
import ManageScriptJSON from '@/components/common/ManageScriptJSON.vue';

const settingsStore = useSettingsStore();
const translateStore = useTranslataStore();
const total = ref(0);
const count = ref(0);

const translateLoading = ref(false);

const storyScript = ref<StoryScriptFull>([]);

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

  let translateResult = response.choices[0].message.content!;

  if (translateResult[0] === '「') {
    translateResult = translateResult.slice(1);
  }

  if (translateResult[translateResult.length - 1] === '」') {
    translateResult = translateResult.slice(0, -1);
  }

  storyItem.lineJP = translateResult;
}

async function translateAll() {
  if (!settingsStore.checkLLMConfig()) {
    Message.error('LLM Config 配置不完善，请补全配置后重试。')
    return;
  }

  translateLoading.value = true;

  const storyListNeedTranslate = storyList.value!.filter(NeedTranslate);

  total.value = storyListNeedTranslate.length;
  count.value = 0;

  for (const storyItem of storyListNeedTranslate) {
    if (!storyItem.lineJP) {
      await translate(storyItem);
      count.value = count.value + 1;
    }
  }

  translateLoading.value = false;
  Message.success('批量翻译完成');
}

function onReaderLoad(reader: FileReader) {
  const jsonstring = reader.result as string;
  const scriptData = JSON.parse(jsonstring) as StoryScript;
  storyScript.value = scriptAdaptIn(scriptData);
}

function NeedTranslate(storyItem: StoryItem) {
  return !CHARACTER_BLACK_LIST.includes(storyItem.cid)
}
</script>
