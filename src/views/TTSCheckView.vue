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

      <div v-if="totalCN || totalJP">
        <a-space>
          <div v-if="totalCN">
            {{ checkedCountCN }} / {{ totalCN }}
          </div>
          <div v-if="totalJP">
            {{ checkedCountJP }} / {{ totalJP }}
          </div>
        </a-space>
      </div>

      <a-button-group>
        <a-button type="text" @click="findFirstNoCheckItemCN">
          中文未校对项检查
        </a-button>

        <a-button type="text" @click="findFirstNoCheckItemJP">
          日文未校对项检查
        </a-button>
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <TTSCheckItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
        is-tts-check-item
      >
        <template #cn v-if="storyItem.cnAudioURLs.length">
          <a-radio-group v-model="checkListCN[index]" class="flex! items-center">
            <template
              v-for="(url, index) in storyItem.cnAudioURLs"
              :key="url"
            >
              <a-radio class="mr-4.5!" :value="index">{{ index }}</a-radio>

              <AudioPlayer class="mr-4.5! inline-flex" :url="url" />
            </template>

            <a-radio :value="-2">都不行</a-radio>
          </a-radio-group>
        </template>

        <template #jp v-if="storyItem.jpAudioURLs.length">
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
      </TTSCheckItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { StoryItem, StoryScriptFull } from '@/types';
import TTSCheckItem from '@/components/tts/TTSCheckItem.vue';
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

const checkListCN = ref<number[]>([]);
const checkListJP = ref<number[]>([]);

const totalCN = computed(() => {
  return checkListCN.value.filter((item) => {
    return item > -3;
  }).length;
});

const totalJP = computed(() => {
  return checkListJP.value.filter((item) => {
    return item > -3;
  }).length;
});

const checkedCountCN = computed(() => {
  return checkListCN.value.filter((item) => {
    return item >= 0 || item === -2;
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
    checkListCN.value = storyList.value.map((item) => {
      if (item.cnAudioURL) {
        return item.cnAudioURLs.indexOf(item.cnAudioURL);
      } else if (item.cnAudioURLs.length === 0) {
        return -3;
      } else {
        return -1;
      }
    });

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
    const checkValueCN = checkListCN.value[index];
    const checkValueJP = checkListJP.value[index];

    if (checkValueCN >= 0) {
      item.cnAudioURL = item.cnAudioURLs[checkValueCN];
    }

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

function findFirstNoCheckItemCN() {
  const hasNoCheckItem = checkListCN.value.some((checked, index) => {
    if (checked === -1) {
      document.querySelectorAll('[is-tts-check-item]')[index].scrollIntoView();
      return true;
    }
    return false;
  });

  if (!hasNoCheckItem) {
    Message.success('中文音频校对完成~');
  }
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
