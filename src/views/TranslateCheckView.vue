<template>
  <div class="translate-check-view fill-current">
    <div class="translate-check-header fill-width">
      <div class="translate-check-header-left">
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" style="margin-bottom: 0;">
            <el-input style="width: 240px" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
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
        :key="storyItem.line"
        :story-item="storyItem"
      >
        <template #jp>
          <el-input type="textarea" autosize v-model="storyItem.lineJP" />
        </template>

        <el-rate
          v-model="checkList[index]"
          :icons="[CircleCheck, CircleCheck, CircleCheck]"
          :void-icon="CircleCheck"
          :max="1"
          clearable
        />
      </TranslateCheckItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, Download, CircleCheck, Search } from '@element-plus/icons-vue';

import { ref, computed, watch } from 'vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

import type { StoryScript, StoryScriptFull } from '@/types';

import TranslateCheckItem from '@/components/translate/TranslateCheckItem.vue';
import { ElMessage } from 'element-plus';

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
    checkList.value = storyList.value.map(() => {
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
      document.querySelectorAll('.translate-check-item')[index].scrollIntoView();
      return true;
    }
    return false;
  });

  if (!hasNoCheckItem) {
    ElMessage.success('已全部校对完成~');
  }
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
  }

  .translate-check-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
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