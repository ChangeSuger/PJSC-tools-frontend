<template>
  <div class="w-full h-full flex flex-col pl-2.5 gap-2">
    <div class="w-full h-10 px-2.5 py-0 flex flex-row justify-between items-center">
      <div class="flex items-center">
        <a-form :inline="true" :model="form" auto-label-width>
          <a-form-item label="剧本名" class="mb-0!">
            <a-input class="w-37.5!" v-model="form.scriptName" allow-clear />
          </a-form-item>
        </a-form>
      </div>

      <div v-if="total">
        {{ checkedCount }} / {{ total }}
      </div>

      <a-button-group>
        <a-button type="text" @click="findFirstNoCheckItem">
          未校对项检查
        </a-button>

        <a-button type="text" @click="importScriptJSON">
          导入剧本
        </a-button>

        <a-button type="text" @click="exportScriptJSON">
          导出剧本
        </a-button>
      </a-button-group>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <TranslateCheckItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
        is-translate-check-item
      >
        <template #jp v-if="characters.includes(storyItem.cid)">
          <div v-if="activeEditId === storyItem.id" class="flex flex-row items-center gap-x-2">
            <a-textarea autosize v-model="storyItem.lineJP" @blur="clearActiveEditId" />
            <a-button type="text" @click="clearActiveEditId">
              <template #icon>
                <IconCheckCircle :size="30" />
              </template>
            </a-button>
          </div>

          <div v-else class="flex flex-row items-center gap-x-2">
            <a-typography size="large">{{ storyItem.lineJP }}</a-typography>
            <a-button type="text" shape="circle" @click="setActiveEditId(storyItem.id)">
              <template #icon>
                <IconEdit :size="20" />
              </template>
            </a-button>
          </div>
        </template>

        <div class="w-12.5 h-8">
          <a-rate
            class="
              [&_.el-icon.el-rate\_\_icon]:w-10!
              [&_.el-icon.el-rate\_\_icon]:h-10!
              [&_svg]:w-full!
              [&_svg]:h-full!
            "
            v-if="checkListMap[index] !== undefined"
            v-model="checkList[checkListMap[index]]"
            :max="1"
            allow-clear
          />
        </div>
      </TranslateCheckItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryScript, StoryScriptFull } from '@/types';

import TranslateCheckItem from '@/components/translate/TranslateCheckItem.vue';
import { Message } from '@arco-design/web-vue';
import { IconEdit, IconCheckCircle } from '@arco-design/web-vue/es/icon';

const characters = [ '灯', '缘', '澪', '葵' ];

const form = ref({
  scriptName: '',
});

const storyScript = ref<StoryScriptFull>();

const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

const checkList = ref<number[]>([]);
const checkListMap = ref<Record<number, number>>({});

const activeEditId = ref('');

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
      if (characters.includes(item.cid)) {
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
  a.download = `${form.value.scriptName}.translate.checked.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
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

function setActiveEditId(id: string) {
  activeEditId.value = id;
}

function clearActiveEditId() {
  setActiveEditId('');
}
</script>
