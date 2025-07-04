<template>
  <div class="w-full h-full flex flex-col pl-2.5">
    <div class="w-full h-10 py-0 px-2.5 flex flex-row justify-between items-center">
      <div>
        <el-form :inline="true" :model="form">
          <el-form-item label="剧本名" class="mb-0!">
            <el-input class="w-60" v-model="form.scriptName" clearable />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="totalCN || totalJP">
        <el-space>
          <div v-if="totalCN">
            {{ checkedCountCN }} / {{ totalCN }}
          </div>
          <div v-if="totalJP">
            {{ checkedCountJP }} / {{ totalJP }}
          </div>
        </el-space>
      </div>

      <div>
        <el-button type="primary" text :icon="Search" @click="findFirstNoCheckItemCN">
          中文未校对项检查
        </el-button>

        <el-button type="primary" text :icon="Search" @click="findFirstNoCheckItemJP">
          日文未校对项检查
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>
      </div>
    </div>

    <div class="h-[calc(100%-40px)] flex flex-col gap-2 overflow-y-scroll">
      <TTSCheckItem
        v-for="(storyItem, index) in storyList"
        :key="storyItem.id"
        :story-item="storyItem"
        is-tts-check-item
      >
        <template #cn v-if="storyItem.cnAudioURLs.length">
          <el-radio-group v-model="checkListCN[index]">
            <template
              v-for="(url, index) in storyItem.cnAudioURLs"
              :key="url"
            >
              <el-radio class="mr-4.5" :value="index">{{ index }}</el-radio>

              <AudioPlayer class="mr-4.5" :url="url" />
            </template>

            <el-radio :value="-2">都不行</el-radio>
          </el-radio-group>
        </template>

        <template #jp v-if="storyItem.jpAudioURLs.length">
          <el-radio-group v-model="checkListJP[index]">
            <template
              v-for="(url, index) in storyItem.jpAudioURLs"
              :key="url"
            >
              <el-radio class="mr-4.5" :value="index">{{ index }}</el-radio>

              <AudioPlayer class="mr-4.5" :url="url" />
            </template>

            <el-radio :value="-2">都不行</el-radio>
          </el-radio-group>
        </template>
      </TTSCheckItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { StoryItem, StoryScriptFull } from '@/types';
import { Upload, Download, Search } from '@element-plus/icons-vue';
import TTSCheckItem from '@/components/tts/TTSCheckItem.vue';
import AudioPlayer from '@/components/tts/AudioPlayer.vue';
import { scriptAdaptIn } from '@/utils/scriptAdapter';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';

const storyScript = ref<StoryScriptFull>();

const storyList = computed(() => {
  return storyScript.value?.filter((item) => {
    return item.type === 'line';
  }) ?? [];
});

const form = ref({
  scriptName: '',
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
        const scriptData = JSON.parse(jsonstring) as StoryItem[];
        storyScript.value = scriptAdaptIn(scriptData);
      }
      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const scriptdata = cloneDeep(storyScript.value);
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

  const json = JSON.stringify(scriptdata);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${form.value.scriptName}.tts.checked.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
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
    ElMessage.success('中文音频校对完成~');
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
    ElMessage.success('日文音频校对完成~');
  }
}
</script>
