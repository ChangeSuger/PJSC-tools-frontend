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
          ref="manageScriptJSONRef"
        />
      </div>

      <a-button-group>
        <a-button type="text" @click="ttsGenerateAllJP" :loading="generateLoading" :disabled="generateLoading">
          批量生成日文音频
        </a-button>

        <ExampleAudioConfigDialog />

        <TTSCharacterConfigDialog />

        <CharacterModelConfigDialog />

        <ManageEmotionDialog />
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
        can-edit-emotion
        show-audio
        canEditLineJP
      >
        <a-space direction="vertical">
          <a-button v-if="characterOptions.includes(storyItem.cid)" @click="ttsBatchGenerateJP(storyItem)">
            日文音频生成
          </a-button>
        </a-space>
      </StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, useTTSCharacterStore } from '@/stores';
import { computed, ref } from 'vue';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import ExampleAudioConfigDialog from '@/components/tts/exampleAudio/ExampleAudioConfigDialog.vue';
import TTSCharacterConfigDialog from '@/components/tts/TTSCharacterConfigDialog.vue';
import CharacterModelConfigDialog from '@/components/tts/CharacterModelConfigDialog.vue';
import type { StoryItem, StoryScriptFull, TTSGenerateSSEData } from '@/types';
import { scriptAdaptIn } from '@/utils/scriptAdapter';
import ChangeModelForm from '@/components/tts/ChangeModelForm.vue';
import ManageScriptJSON from '@/components/common/ManageScriptJSON.vue';
import ManageEmotionDialog from '@/components/tts/manageEmition/ManageEmotionDialog.vue';
import { ttsBatchGenerateJP as ttsBatchGenerate } from '@/utils/ttsBatchGenerate';

const settingsStore = useSettingsStore();
const ttsCharacterStore = useTTSCharacterStore();

const manageScriptJSONRef = ref<InstanceType<typeof ManageScriptJSON>>();

const characters = ref<string[]>([ ...ttsCharacterStore.characters ]);

const generateLoading = ref(false);
const characterSelected = ref('');

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
  await ttsBatchGenerate(
    storyItem,
    manageScriptJSONRef.value!.getScriptName(),
    (progressData: TTSGenerateSSEData) => {
      const url = progressData.url;
      if (!storyItem.jpAudioURLs.includes(url)) {
        storyItem.jpAudioURLs.push(url);
      }
    }
  );
}

async function ttsGenerateAllJP() {
  for (const storyItem of storyListFilter.value) {
    if (
      ttsCharacterStore.characters.includes(storyItem.cid) &&
      storyItem.jpAudioURLs.length < settingsStore.getTTSConfig.batchSize
    ) {
      await ttsBatchGenerateJP(storyItem);
    }
  }
}

function onReaderLoad(reader: FileReader) {
  const jsonstring = reader.result as string;
  const scriptData = JSON.parse(jsonstring) as StoryItem[];
  storyScript.value = scriptAdaptIn(scriptData);
}
</script>
