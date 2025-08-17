<template>
  <div class="w-full h-full flex flex-col pl-2.5 gap-2">
    <div class="w-full h-10 px-2.5 py-0 flex flex-row justify-between items-center">
      <div class="flex items-center">
        <ManageScriptJSON
          suffix="translate.checked"
          :story-script="storyScript"
          :onReaderLoad="onReaderLoad"
        />
      </div>

      <div v-if="total">
        {{ checkedCount }} / {{ total }}
      </div>

      <a-button-group>
        <a-button type="text" @click="findFirstNoCheckItem">
          未校对项检查
        </a-button>
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <StoryViewerItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
        canEditLineJP
      >
        <!-- <template #jp v-if="characters.includes(storyItem.cid)">
          <a-typography class="*:mb-0!">
            <a-typography-paragraph
              class="h-[27px]!"
              editable
              v-model:editText="storyItem.lineJP"
            >
              {{ storyItem.lineJP }}
            </a-typography-paragraph>
          </a-typography>
        </template> -->

        <div class="w-12.5 h-8">
          <a-rate
            v-if="checkListMap[index] !== undefined"
            v-model="checkList[checkListMap[index]]"
            :count="1"
            allow-clear
          >
            <template #character>
              <IconCheckCircle :size="40" />
            </template>
          </a-rate>
        </div>
      </StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryScript, StoryScriptFull } from '@/types';
import { useTTSCharacterStore } from '@/stores';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import { Message } from '@arco-design/web-vue';
import { IconCheckCircle } from '@arco-design/web-vue/es/icon';
import ManageScriptJSON from '@/components/common/ManageScriptJSON.vue';

const ttsCharacterStore = useTTSCharacterStore();

const characters = computed(() => ttsCharacterStore.characters);

const storyScript = ref<StoryScriptFull>([]);

const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

const checkList = ref<number[]>([]);
const checkListMap = ref<Record<number, number>>({});

const total = computed(() => {
  return checkList.value.length;
});

const checkedCount = computed(() => {
  return checkList.value.filter((item) => {
    return item;
  }).length;
});

watch(
  () => storyList.value?.length,
  () => {
    checkListMap.value = {};
    let count = 0;

    checkList.value = storyList.value.filter((item, index) => {
      if (characters.value.includes(item.cid)) {
        checkListMap.value[index] = count;
        count ++;

        return true;
      } else {
        return false;
      }
    }).map(() => {
      return 0;
    });
  }
)

function onReaderLoad(reader: FileReader) {
  const jsonstring = reader.result as string;
  const scriptData = JSON.parse(jsonstring) as StoryScript;
  storyScript.value = scriptAdaptIn(scriptData);
}

function findFirstNoCheckItem() {
  const hasNoCheckItem = checkList.value.some((checked, index) => {
    if (!checked) {
      Object.entries(checkListMap.value).some(([key, value]) => {
        if (value === index) {
          document.querySelectorAll('[is-translate-check-item]')[Number(key)].scrollIntoView();
          return true;
        } else {
          return false;
        }
      });

      return true;
    }
    return false;
  });

  if (!hasNoCheckItem) {
    Message.success('已全部校对完成~');
  }
}
</script>
