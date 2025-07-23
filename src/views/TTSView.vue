<template>
  <div class="w-full h-full flex flex-col pl-2.5">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div class="flex gap-4">
        <a-select
          class="w-40!"
          v-model="characterSelected"
          allow-clear
          allow-search
          placeholder="选择角色"
          :options="characterOptions"
        />

        <a-form :inline="true" :model="form" auto-label-width>
          <a-form-item label="剧本名" class="mb-0!">
            <a-input class="w-37.5!" v-model="form.scriptName" allow-clear />
          </a-form-item>
        </a-form>
      </div>

      <a-button-group>
        <a-button type="text" @click="ttsGenerateAllJP" :loading="generateLoading" :disabled="generateLoading">
          批量生成日文音频
        </a-button>

        <a-button type="text" @click="ttsGenerateAllCN" :loading="generateLoading" :disabled="generateLoading">
          批量生成中文音频
        </a-button>

        <a-button type="text" @click="importScriptJSON">
          导入剧本
        </a-button>

        <a-button type="text" @click="exportScriptJSON">
          导出剧本
        </a-button>

        <ExampleAudioConfigDialog />

        <TTSCharacterConfigDialog />
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <StoryViewerItem
        v-for="storyItem in storyListFilter"
        :key="storyItem.id"
        :story-item="storyItem"
      >
        <a-space direction="vertical">
          <a-button v-if="characterOptions.includes(storyItem.cid)" @click="ttsBatchGenerateCN(storyItem)">
            中文音频生成
          </a-button>

          <a-button v-if="characterOptions.includes(storyItem.cid)" @click="ttsBatchGenerateJP(storyItem)">
            日文音频生成
          </a-button>
        </a-space>
      </StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CommonApi } from '@/api';
import { useSettingsStore, useAudioDBStore, useTTSCharacterStore } from '@/stores';
import { computed, ref } from 'vue';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import ExampleAudioConfigDialog from '@/components/tts/ExampleAudioConfigDialog.vue';
import TTSCharacterConfigDialog from '@/components/tts/TTSCharacterConfigDialog.vue';
import { Message } from '@arco-design/web-vue';
import type { StoryItem, StoryScriptFull, TTSGenerateSSEData } from '@/types';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

const settingsStore = useSettingsStore();
const audioDBStore = useAudioDBStore();
const ttsCharacterStore = useTTSCharacterStore();

const characters = ref<string[]>([ ...ttsCharacterStore.characters ]);

const generateLoading = ref(false);
const characterSelected = ref('');

const form = ref({
  scriptName: '',
});

const storyScript = ref<StoryScriptFull>();
const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

const characterOptions = computed(() => {
  return [ ...characters.value ];
});

const storyListFilter = computed(() => {
  if (characterSelected.value) {
    return storyList.value.filter(item => {
      return item.cid === characterSelected.value;
    });
  } else {
    return storyList.value;
  }
});

async function ttsBatchGenerateJP(storyItem: StoryItem) {
  const { id, cid, lineJP, emotion } = storyItem;

  const ttsConfigDefault = settingsStore.getTTSConfig;
  const ossConfig = settingsStore.getOSSConfig;

  const ttsConfig = {
    ...ttsConfigDefault,
    ...ttsCharacterStore.ttsCharacterConfigMap[cid]
  };

  const exampleAudioDB = audioDBStore.getExampleAudioDB;

  let exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-${emotion}`);

  if (!exampleAudio) {
    exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-中立`);
  }

  const formData = new FormData();
  formData.append('ttsConfig', JSON.stringify(ttsConfig));
  formData.append('ossConfig', JSON.stringify(ossConfig));
  formData.append('exampleAudio', exampleAudio!.audio);
  formData.append('exampleText', JSON.stringify({
    text: exampleAudio!.text,
    lang: '日文',
  }));
  formData.append('targetText', JSON.stringify({
    text: lineJP,
    id: generateAudioID(id, form.value.scriptName, 'jp'),
    lang: '日文',
  }));

  const res = await CommonApi.ttsBatchGenerate(formData);

  if (res.code === 200) {
    const eventSource = new EventSource('/api/tts-sse');

    await new Promise((res, rej) => {
      eventSource.onmessage = (event) => {
        const progressData: TTSGenerateSSEData = JSON.parse(event.data);

        if (progressData.code === 2) {
          console.log('TTS End');
          eventSource.close();
          res('');
        } else if (progressData.code === 0) {
          console.log('TTS Start')
        } else if (progressData.code === 1) {
          const url = progressData.url;
          if (!storyItem.jpAudioURLs.includes(url)) {
            storyItem.jpAudioURLs.push(url);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Failed', error);
        rej();
      }
    });
  }
}

async function ttsBatchGenerateCN(storyItem: StoryItem) {
  const { id, cid, line, emotion } = storyItem;

  const ttsConfigDefault = settingsStore.getTTSConfig;
  const ossConfig = settingsStore.getOSSConfig;

  const ttsConfig = {
    ...ttsConfigDefault,
    ...ttsCharacterStore.ttsCharacterConfigMap[cid]
  };

  const exampleAudioDB = audioDBStore.getExampleAudioDB;

  let exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-${emotion}`);

  if (!exampleAudio) {
    exampleAudio = await exampleAudioDB.getExampleAudio(`${cid}-中立`);
  }

  const formData = new FormData();
  formData.append('ttsConfig', JSON.stringify(ttsConfig));
  formData.append('ossConfig', JSON.stringify(ossConfig));
  formData.append('exampleAudio', exampleAudio!.audio);
  formData.append('exampleText', JSON.stringify({
    text: exampleAudio!.text,
    lang: '日文',
  }));
  formData.append('targetText', JSON.stringify({
    text: line,
    id: generateAudioID(id, form.value.scriptName, 'cn'),
    lang: '中文',
  }));

  const res = await CommonApi.ttsBatchGenerate(formData);

  if (res.code === 200) {
    const eventSource = new EventSource('/api/tts-sse');

    await new Promise((res, rej) => {
      eventSource.onmessage = (event) => {
        const progressData: TTSGenerateSSEData = JSON.parse(event.data);

        if (progressData.code === 2) {
          console.log('TTS End');
          eventSource.close();
          res('');
        } else if (progressData.code === 0) {
          console.log('TTS Start')
        } else if (progressData.code === 1) {
          const url = progressData.url;
          if (!storyItem.cnAudioURLs.includes(url)) {
            storyItem.cnAudioURLs.push(url);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Failed', error);
        rej();
      }
    });
  }
}

async function ttsGenerateAllJP() {
  if (characterSelected.value) {
    for (const storyItem of storyListFilter.value) {
      if (storyItem.jpAudioURLs.length === 0 || storyItem.jpAudioURLs.length < settingsStore.getTTSConfig.batchSize) {
        await ttsBatchGenerateJP(storyItem);
      }
    }
  } else {
    Message.error('请选择角色');
  }
}

async function ttsGenerateAllCN() {
  if (characterSelected.value) {
    for (const storyItem of storyListFilter.value) {
      if (storyItem.jpAudioURLs.length === 0 || storyItem.jpAudioURLs.length < settingsStore.getTTSConfig.batchSize) {
        await ttsBatchGenerateCN(storyItem);
      }
    }
  } else {
    Message.error('请选择角色');
  }
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
        const scriptData = JSON.parse(jsonstring) as StoryItem[];
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
  a.download = `${form.value.scriptName}.tts.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function generateAudioID(id: string, scriptName: string, lang: 'jp' | 'cn'): string {
  return `${scriptName}_${id}_${lang}`;
}
</script>
