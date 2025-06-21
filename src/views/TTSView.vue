<template>
  <div class="tts-view fill-current">
    <div class="tts-header fill-width">
      <div class="tts-header-left">
        <el-select
          style="width: 120px"
          v-model="characterSelected"
          clearable
          placeholder="选择角色"
        >
          <el-option
            v-for="character of characterOptions"
            :key="character"
            :label="character"
            :value="character"
          />
        </el-select>

        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" style="margin-bottom: 0;">
            <el-input style="width: 150px" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div class="tts-header-right">
        <el-button type="primary" text @click="ttsGenerateAllJP" :loading="generateLoading" :disabled="generateLoading">
          批量生成日文音频
        </el-button>

        <el-button type="primary" text @click="ttsGenerateAllCN" :loading="generateLoading" :disabled="generateLoading">
          批量生成中文音频
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>

        <el-button type="primary" text :icon="Setting" @click="openExampleAudioConfigDialog">
          参考音频配置
        </el-button>

        <el-button type="primary" text :icon="Setting" @click="openTTSCharacterConfigDialog">
          角色参数配置
        </el-button>
      </div>
    </div>

    <div class="tts-body">
      <StoryViewerItem
        v-for="storyItem in storyListFilter"
        :key="storyItem.line"
        :story-item="storyItem"
      >
        <el-space direction="vertical">
          <el-button v-if="characterOptions.includes(storyItem.cid)" @click="ttsBatchGenerateCN(storyItem)">中文音频生成</el-button>
          <el-button v-if="characterOptions.includes(storyItem.cid)" @click="ttsBatchGenerateJP(storyItem)">日文音频生成</el-button>
        </el-space>
      </StoryViewerItem>
    </div>
  </div>

  <ExampleAudioConfigDialog ref="exampleAudioConfigDialogRef" />
  <TTSCharacterConfigDialog ref="ttsCharacterConfigDialogRef" />
</template>

<script setup lang="ts">
import { CommonApi } from '@/api';
import { useSettingsStore, useAudioDBStore, useTTSCharacterStore } from '@/stores';
import { computed, ref } from 'vue';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import ExampleAudioConfigDialog from '@/components/tts/ExampleAudioConfigDialog.vue';
import TTSCharacterConfigDialog from '@/components/tts/TTSCharacterConfigDialog.vue';
import { Upload, Download, Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { StoryItem, StoryScriptFull, TTSGenerateSSEData } from '@/types';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

const settingsStore = useSettingsStore();
const audioDBStore = useAudioDBStore();
const ttsCharacterStore = useTTSCharacterStore();

const exampleAudioConfigDialogRef = ref<InstanceType<typeof ExampleAudioConfigDialog>>();
const ttsCharacterConfigDialogRef = ref<InstanceType<typeof TTSCharacterConfigDialog>>();

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
    ElMessage.error('请选择角色');
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
    ElMessage.error('请选择角色');
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
  a.download = `${form.value.scriptName}.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function openExampleAudioConfigDialog() {
  exampleAudioConfigDialogRef.value?.open();
}

function openTTSCharacterConfigDialog() {
  ttsCharacterConfigDialogRef.value?.open();
}

function generateAudioID(id: string, scriptName: string, lang: 'jp' | 'cn'): string {
  return `${scriptName}:${id}_${lang}`;
}
</script>

<style lang="scss" scoped>
.tts-view {
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  .tts-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .tts-header-left {
      display: flex;
      gap: 1rem;
    }
  }

  .tts-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
