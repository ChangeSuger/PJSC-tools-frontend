<template>
  <div class="w-full h-full flex flex-col pl-2.5">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div>
        <ManageScriptJSON
          suffix="tts.checked"
          :story-script="storyScript"
          :onReaderLoad="onReaderLoad"
          :preprocess-story-script="preprocessStoryScript"
        />
      </div>

      <div v-if="totalJP">
        <a-space>
          <div v-if="totalJP">
            {{ checkedCountJP }} / {{ totalJP }}
          </div>
        </a-space>
      </div>

      <a-button-group>
        <a-button type="text" @click="findFirstNoCheckItemJP">
          日文未校对项检查
        </a-button>
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <StoryViewerItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
        can-edit-emotion
        canEditLineJP
        show-audio
        is-tts-check-item
      >
        <template #audio v-if="storyItem.jpAudioURLs.length">
          <a-radio-group v-model="checkListJP[index]" class="flex! items-center">
            <template
              v-for="(url, index) in storyItem.jpAudioURLs"
              :key="url"
            >
              <a-radio class="mr-4.5!" :value="index">{{ index }}</a-radio>

              <AudioPlayer class="mr-4.5! inline-flex" :url="url" />
            </template>

            <a-radio :value="-2">都不行</a-radio>
          </a-radio-group>
        </template>
      </StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { StoryItem, StoryScriptFull } from '@/types';
import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import AudioPlayer from '@/components/common/AudioPlayer.vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';
import { cloneDeep } from 'lodash-es';
import { Message } from '@arco-design/web-vue';
import ManageScriptJSON from '@/components/common/ManageScriptJSON.vue';

const storyScript = ref<StoryScriptFull>([]);

const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

const checkListJP = ref<number[]>([]);

const totalJP = computed(() => {
  return checkListJP.value.filter((item) => {
    return item > -3;
  }).length;
});

const checkedCountJP = computed(() => {
  return checkListJP.value.filter((item) => {
    return item >= 0 || item === -2;
  }).length;
});

watch(
  () => storyList.value,
  () => {
    checkListJP.value = storyList.value.map((item) => {
      if (item.jpAudioURL) {
        return item.jpAudioURLs.indexOf(item.jpAudioURL);
      } else if (item.jpAudioURLs.length === 0) {
        return -3;
      } else {
        return -1
      }
    });
  }
)

function preprocessStoryScript(storyScript: StoryScriptFull) {
  const scriptdata = cloneDeep(storyScript);
  const list = scriptdata?.filter((item) => {
    return item.type === 'line';
  });

  list?.forEach((item, index) => {
    const checkValueJP = checkListJP.value[index];

    if (checkValueJP >= 0) {
      item.jpAudioURL = item.jpAudioURLs[checkValueJP];
    }
  });

  return scriptdata;
}

function onReaderLoad(reader: FileReader) {
  const jsonstring = reader.result as string;
  const scriptData = JSON.parse(jsonstring) as StoryItem[];
  storyScript.value = scriptAdaptIn(scriptData);
}

function findFirstNoCheckItemJP() {
  const hasNoCheckItem = checkListJP.value.some((checked, index) => {
    if (checked === -1) {
      document.querySelectorAll('[is-tts-check-item]')[index].scrollIntoView();
      return true;
    }
    return false;
  });

  if (!hasNoCheckItem) {
    Message.success('日文音频校对完成~');
  }
}
</script>
