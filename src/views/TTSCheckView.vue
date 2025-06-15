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
        :key="storyItem.content"
        :story-item="storyItem"
      ></StoryViewerItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { StoryItem } from '@/types';
import { Upload } from '@element-plus/icons-vue';
import StoryViewerItem from '@/components/story/StoryViewerItem.vue';

const storyList = ref<StoryItem[]>([
  {
    id: 'demo-test-001-1',
    character: '平野葵',
    content: '终于又见面了呢，拓君。',
    contentJP: '拓君、また会えて嬉しいです。',
    emotion: '默认',
    audioURLs: [
      "https://camille-oss-public.oss-cn-zhangjiakou.aliyuncs.com/pjsc-tts/demo-test-001-1_v1.wav",
      "https://camille-oss-public.oss-cn-zhangjiakou.aliyuncs.com/pjsc-tts/demo-test-001-1_v2.wav",
      "https://camille-oss-public.oss-cn-zhangjiakou.aliyuncs.com/pjsc-tts/demo-test-001-1_v3.wav",
      "https://camille-oss-public.oss-cn-zhangjiakou.aliyuncs.com/pjsc-tts/demo-test-001-1_v4.wav",
      "https://camille-oss-public.oss-cn-zhangjiakou.aliyuncs.com/pjsc-tts/demo-test-001-1_v5.wav",
    ],
  },
  {
    id: 'demo-test-001-2',
    character: '平野葵',
    content: '这一年来过得可好？',
    contentJP: '今年の一年、いかがお過ごしでしたか？',
    emotion: '默认',
    audioURLs: [],
  },
]);

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
        const data = JSON.parse(jsonstring) as StoryItem[];
        storyList.value = data;
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