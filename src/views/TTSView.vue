<template>
  <div class="tts-view fill-current">
    <div class="tts-header fill-width">
      <div class="tts-header-left">
        <el-select
          style="width: 150px"
          v-model="characterSelected"
          clearable
          placeholder="选择角色"
        >
          <el-option
            v-for="character of characterOptions"
            :key="character"
            :label="character"
            :value="character"
          />
        </el-select>
      </div>

      <div class="tts-header-right">
        <el-button type="primary" text @click="ttsGenerateAll" :loading="generateLoading" :disabled="generateLoading">
          批量生成音频
        </el-button>

        <el-button type="primary" text :icon="Upload" @click="importScriptJSON">
          导入剧本
        </el-button>

        <el-button type="primary" text :icon="Download" @click="exportScriptJSON">
          导出剧本
        </el-button>
      </div>
    </div>

    <div class="tts-body">
      <el-collapse>
        <el-collapse-item title="参考音频配置" name="1">
          <el-tabs
            v-model="avtiveName"
            type="card"
            editable
            @edit="handleTabEdit"
          >
            <template #add-icon>
              <el-button plain>增加参考音频</el-button>
            </template>

            <el-tab-pane
              v-for="character of characters"
              :key="character"
              :label="character"
              :name="character"
            >
              <ExampleAudioItem
                v-for="characterEmotion of generateCharacterEmotionList(character)"
                :key="`${characterEmotion.character}-${characterEmotion.emotion}`"
                :id="`${characterEmotion.character}-${characterEmotion.emotion}`"
                :emotion="characterEmotion.emotion"
              />
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>

      <StoryViewerItem
        v-for="storyItem in storyListFilter"
        :key="storyItem.content"
        :story-item="storyItem"
      >
        <el-button @click="ttsBatchGenerate(storyItem)">音频生成</el-button>
      </StoryViewerItem>
    </div>
  </div>

  <el-dialog
    v-model="visible"
    append-to-body
    center
    title="新增角色参考音频"
  >
    <el-form v-model="addCharacterForm">
      <el-form-item label="角色名">
        <el-input v-model="addCharacterForm.name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" plain @click="addCharacter">确定</el-button>
      <el-button type="info" plain @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { CommonApi } from '@/api';
import { useSettingsStore, useAudioDBStore, useExampleAudioStore } from '@/stores';
import { computed, ref } from 'vue';
import { EMOTIONS } from '@/datas';

import ExampleAudioItem from '@/components/tts/ExampleAudioItem.vue';
import StoryViewerItem from '@/components/story/StoryViewerItem.vue';
import { Upload, Download } from '@element-plus/icons-vue';
import { type TabPaneName, ElMessage } from 'element-plus';
import type { StoryItem, TTSGenerateSSEData } from '@/types';

const settingsStore = useSettingsStore();
const audioDBStore = useAudioDBStore();
const exampleAudioStore = useExampleAudioStore();

const characters = ref<string[]>([ ...exampleAudioStore.characters ]);
const avtiveName = ref(characters.value[0]);
const visible = ref(false);
const addCharacterForm = ref({
  name: ''
});

const generateLoading = ref(false);
const characterSelected = ref('');

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

const characterOptions = computed(() => {
  return [ ...characters.value ];
});

const storyListFilter = computed(() => {
  if (characterSelected.value) {
    return storyList.value.filter(item => {
      return item.character === characterSelected.value;
    });
  } else {
    return storyList.value;
  }
});

async function ttsBatchGenerate(storyItem: StoryItem) {
  const { id, character, contentJP, emotion } = storyItem;

  const ttsConfig = settingsStore.getTTSConfig;
  const ossConfig = settingsStore.getOSSConfig;

  const exampleAudioDB = audioDBStore.getExampleAudioDB;

  let exampleAudio = await exampleAudioDB.getExampleAudio(`${character}-${emotion}`);

  if (!exampleAudio) {
    exampleAudio = await exampleAudioDB.getExampleAudio(`${character}-默认`);
  }

  const formData = new FormData();
  formData.append('ttsConfig', JSON.stringify(ttsConfig));
  formData.append('ossConfig', JSON.stringify(ossConfig));
  formData.append('exampleAudio', exampleAudio!.audio);
  formData.append('exampleText', exampleAudio!.text);
  formData.append('targetText', JSON.stringify({
    text: contentJP,
    id,
  }));

  const res = await CommonApi.ttsBatchGenerate(formData);

  if (res.code === 200) {
    const eventSource = new EventSource('/api/tts-sse');

    await new Promise((res, rej) => {
      eventSource.onmessage = (event) => {
        const progressData: TTSGenerateSSEData = JSON.parse(event.data);

        if (progressData.code === 2) {
          console.log('TTS End');
          eventSource.close();
          res('');
        } else if (progressData.code === 0) {
          console.log('TTS Start')
        } else if (progressData.code === 1) {
          const url = progressData.url;
          if (!storyItem.audioURLs.includes(url)) {
            storyItem.audioURLs.push(url);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Failed', error);
        rej();
      }
    });
  }
}

async function ttsGenerateAll() {
  if (characterSelected.value) {
    for (const storyItem of storyListFilter.value) {
      if (storyItem.audioURLs.length === 0 || storyItem.audioURLs.length < settingsStore.getTTSConfig.batchSize) {
        await ttsBatchGenerate(storyItem);
      }
    }
  } else {
    ElMessage.error('请选择角色');
  }
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
        const jsonstring = reader.result as string;
        const data = JSON.parse(jsonstring) as StoryItem[];
        storyList.value = data;
      }
      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const scriptdata = storyList.value;

  const json = JSON.stringify(scriptdata);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `script.json`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function handleTabEdit(
  targetName: TabPaneName | undefined,
  action: 'remove' | 'add'
) {
  if (action === 'add') {
    openDialog();
  } else if (action === 'remove') {
    characters.value = characters.value.filter((character => {
      return character !== targetName;
    }));
    exampleAudioStore.setCharacters(characters.value);
  }
}

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

function addCharacter() {
  const newCharacterName = addCharacterForm.value.name;

  if (newCharacterName && !characters.value.includes(newCharacterName)) {
    characters.value.push(newCharacterName);

    exampleAudioStore.setCharacters(characters.value);

    addCharacterForm.value.name = '';
  }

  closeDialog();
}

function generateCharacterEmotionList(character: string) {
  return EMOTIONS.map((emotion) => {
    return {
      emotion,
      character,
    };
  });
}
</script>

<style lang="scss" scoped>
.tts-view {
  display: flex;
  flex-direction: column;
  padding-left: 10px;

  .tts-header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .tts-body {
    height: calc(100% - 40px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>

<style lang="scss">
.tts-view {
  .el-tabs__new-tab {
    width: 120px;
    height: 32px;
    border: none;
  }
}
</style>
