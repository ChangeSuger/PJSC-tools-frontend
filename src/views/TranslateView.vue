<template>
  <div class="translate-view fill-current">
    <div class="translate-header fill-width">
      <div class="translate-header-left">
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" style="margin-bottom: 0;">
            <el-input style="width: 240px" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div class="translate-header-right">
        <el-button type="primary" text @click="translateAll" :loading="translateLoading" :disabled="translateLoading">
          批量翻译
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>
      </div>
    </div>

    <div class="translate-body">
      <StoryViewerItem v-for="storyItem in storyList" :key="storyItem.content" :story-item="storyItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CommonApi } from '@/api';
import { Upload, Download } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores';

import type { StoryItem } from '@/types';

import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import { ElMessage } from 'element-plus';

const settingsStore = useSettingsStore();

const form = ref({
  scriptName: ''
});

const translateLoading = ref(false);

const storyList = ref<StoryItem[]>([
  {
    character: '平野 葵',
    content: '终于又见面了呢，拓君。这一年来过得可好？',
    contentJP: '「拓君、また会えて嬉しいです。今年の一年、いかがお過ごしでしたか？」',
  },
  {
    character: '柊 澪',
    content: '魔法？也太扯了。没想到到了这还能看到这么离谱的东西。',
    contentJP: '',
  },
  {
    character: '飛鳥 灯',
    content: '欢迎光临！能找到这里真是有缘呢，从今天起我们就是一家人了！',
    contentJP: '',
  },
  {
    character: '茜音 縁',
    content: '哦哦，所以我们这个是魔法研究部是吧，然后学姐是部长，这位同学是……。等一下，欸，魔法？',
    contentJP: '',
  },
]);

async function translate(storyItem: StoryItem) {
  const llmConfig = settingsStore.getLLMConfig;

  const result = await CommonApi.translate({
    config: llmConfig,
    text: storyItem.content,
  });

  storyItem.contentJP = result.data;
}

async function translateAll() {
  if (!settingsStore.checkLLMConfig()) {
    ElMessage.error('LLM Config 配置不完善，请补全配置后重试。')
    return;
  }

  translateLoading.value = true;

  for (const storyItem of storyList.value) {
    if (!storyItem.contentJP) {
      await translate(storyItem);
    }
  }

  translateLoading.value = false;
}

function importScriptJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {

      }
      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const scriptdata = '';

  const json = JSON.stringify(scriptdata);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `script.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped lang="scss">
.translate-view {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  gap: 8px;

  .translate-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .translate-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>