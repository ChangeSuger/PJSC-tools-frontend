<template>
  <div class="translate-check-view fill-current">
    <div class="translate-check-header fill-width">
      <div class="translate-check-header-left">
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" style="margin-bottom: 0;">
            <el-input style="width: 150px" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>

        <el-dropdown @command="handleCommand">
          <el-button>
            选择内置剧本 <el-icon><arrow-down /></el-icon>
          </el-button>

          <template #dropdown>
            <el-dropdown-item command="K-1">K-1</el-dropdown-item>
            <el-dropdown-item command="K-2">K-2</el-dropdown-item>
          </template>
        </el-dropdown>
      </div>

      <div class="translate-header-center" v-if="total">
        {{ checkedCount }} / {{ total }}
      </div>

      <div class="translate-check-header-right">
        <el-button type="primary" text :icon="Search" @click="findFirstNoCheckItem">
          未校对项检查
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>
      </div>
    </div>

    <div class="translate-check-body">
      <TranslateCheckItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
      >
        <template #jp v-if="characters.includes(storyItem.cid)">
          <div v-if="activeEditId === storyItem.id" class="flex-horizontal gap-x-2">
            <el-input type="textarea" autosize v-model="storyItem.lineJP" @blur="clearActiveEditId" />
            <el-button type="primary" circle plain :icon="Check" @click="clearActiveEditId" />
          </div>

          <el-space v-else>
            <el-text size="large">{{ storyItem.lineJP }}</el-text>
            <el-button type="primary" circle plain :icon="Edit" @click="setActiveEditId(storyItem.id)" />
          </el-space>
        </template>

        <div class="translate-item-check-button">
          <el-rate
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
import { Upload, Download, CircleCheck, Search, ArrowDown, Edit, Check } from '@element-plus/icons-vue';

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
          document.querySelectorAll('.translate-check-item')[Number(key)].scrollIntoView();
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

async function handleCommand(command: string) {
  const file = await fetch(`/${command}.json`);

  const reader = new FileReader();
  reader.onload = () => {
    const jsonstring = reader.result as string;
    const scriptData = JSON.parse(jsonstring) as StoryScript;
    storyScript.value = scriptAdaptIn(scriptData);
  }
  reader.readAsText(await file.blob());

  form.value.scriptName = command;
}

function setActiveEditId(id: string) {
  activeEditId.value = id;
}

function clearActiveEditId() {
  setActiveEditId('');
}
</script>

<style lang="scss" scoped>
.translate-check-view {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  gap: 8px;

  .translate-check-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .translate-check-header-left {
      display: flex;
      align-items: center;
    }
  }

  .translate-check-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .translate-item-check-button {
      width: 50px;
      height: 32px;
    }
  }
}
</style>

<style lang="scss">
.translate-check-body {
  .el-rate {
    .el-icon.el-rate__icon {
      width: 40px;
      height: 40px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>