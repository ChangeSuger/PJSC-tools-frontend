<template>
  <div class="w-full h-full flex flex-col pl-2.5 gap-2">
    <div class="w-full h-10 px-2.5 py-0 flex flex-row justify-between items-center">
      <div class="flex items-center">
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" class="mb-0!">
            <el-input class="w-37.5!" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="total">
        {{ checkedCount }} / {{ total }}
      </div>

      <el-button-group>
        <el-button type="primary" text :icon="Search" @click="findFirstNoCheckItem">
          未校对项检查
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>
      </el-button-group>
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
            <el-input type="textarea" autosize v-model="storyItem.lineJP" @blur="clearActiveEditId" />
            <el-button type="primary" circle plain :icon="Check" @click="clearActiveEditId" />
          </div>

          <div v-else class="flex flex-row items-center gap-x-2">
            <el-text size="large">{{ storyItem.lineJP }}</el-text>
            <el-button type="primary" circle plain :icon="Edit" @click="setActiveEditId(storyItem.id)" />
          </div>
        </template>

        <div class="w-12.5 h-8">
          <el-rate
            class="
              [&_.el-icon.el-rate\_\_icon]:w-10!
              [&_.el-icon.el-rate\_\_icon]:h-10!
              [&_svg]:w-full!
              [&_svg]:h-full!
            "
            v-if="checkListMap[index] !== undefined"
            v-model="checkList[checkListMap[index]]"
            :icons="[CircleCheck, CircleCheck, CircleCheck]"
            :void-icon="CircleCheck"
            :max="1"
            clearable
          />
        </div>
      </TranslateCheckItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, Download, CircleCheck, Search, Edit, Check } from '@element-plus/icons-vue';

import { ref, computed, watch } from 'vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryScript, StoryScriptFull } from '@/types';

import TranslateCheckItem from '@/components/translate/TranslateCheckItem.vue';
import { ElMessage } from 'element-plus';

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
    ElMessage.success('已全部校对完成~');
  }
}

function setActiveEditId(id: string) {
  activeEditId.value = id;
}

function clearActiveEditId() {
  setActiveEditId('');
}
</script>
