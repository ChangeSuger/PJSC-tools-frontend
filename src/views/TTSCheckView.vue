<template>
  <div class="tts-check-view fill-current">
    <div class="tts-check-header fill-width">
      <div class="tts-check-header-left">

      </div>

      <div class="tts-check-header-right">
        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <!-- <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button> -->
      </div>
    </div>

    <div class="tts-check-body">
      <StoryViewerItem
        v-for="storyItem in storyList"
        :key="storyItem.line"
        :story-item="storyItem"
      ></StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import type { StoryItem, StoryScriptFull } from '@/types';
import { Upload } from '@element-plus/icons-vue';
import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';

const storyScript = ref<StoryScriptFull>();
const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

function importScriptJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
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
</script>

<style lang="scss" scoped>
.tts-check-view {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-left: 20px;

  .tts-check-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .tts-check-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>