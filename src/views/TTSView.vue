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

        <ManageScriptJSON
          suffix="tts"
          :story-script="storyScript"
          :onReaderLoad="onReaderLoad"
        />
      </div>

      <a-button-group>
        <a-button type="text" @click="ttsGenerateAllJP" :loading="generateLoading" :disabled="generateLoading">
          批量生成日文音频
        </a-button>

        <a-button type="text" @click="ttsGenerateAllCN" :loading="generateLoading" :disabled="generateLoading">
          批量生成中文音频
        </a-button>

        <ExampleAudioConfigDialog />

        <TTSCharacterConfigDialog />

        <CharacterModelConfigDialog />
      </a-button-group>
    </div>

    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div class="flex gap-4">
        <ChangeModelForm />
      </div>
    </div>

    <div class="h-[calc(100%-80px)] flex flex-col gap-2 overflow-y-scroll">
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
import ExampleAudioConfigDialog from '@/components/tts/exampleAudio/ExampleAudioConfigDialog.vue';
import TTSCharacterConfigDialog from '@/components/tts/TTSCharacterConfigDialog.vue';
import CharacterModelConfigDialog from '@/components/tts/CharacterModelConfigDialog.vue';
import { Message } from '@arco-design/web-vue';
import type { StoryItem, StoryScriptFull, TTSGenerateSSEData } from '@/types';
import { scriptAdaptIn } from '@/utils/scriptAdapter';
import ChangeModelForm from '@/components/tts/ChangeModelForm.vue';
import ManageScriptJSON from '@/components/common/ManageScriptJSON.vue';

const settingsStore = useSettingsStore();
const audioDBStore = useAudioDBStore();
const ttsCharacterStore = useTTSCharacterStore();

const characters = ref<string[]>([ ...ttsCharacterStore.characters ]);

const generateLoading = ref(false);
const characterSelected = ref('');

const form = ref({
  scriptName: '',
});

const storyScript = ref<StoryScriptFull>([]);
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

function onReaderLoad(reader: FileReader) {
  const jsonstring = reader.result as string;
  const scriptData = JSON.parse(jsonstring) as StoryItem[];
  storyScript.value = scriptAdaptIn(scriptData);
}

function generateAudioID(id: string, scriptName: string, lang: 'jp' | 'cn'): string {
  return `${scriptName}_${id}_${lang}`;
}
</script>
