<template>
  <div class="tts-view fill-current">
    <ExampleAudioItem :id="'test-default'" />
    <el-button @click="ttsBatchGenerate">ttsBatchGenerate</el-button>
  </div>
</template>

<script setup lang="ts">
import { CommonApi } from '@/api';
import { useSettingsStore, useAudioDBStore } from '@/stores';

import ExampleAudioItem from '@/components/tts/ExampleAudioItem.vue';

const settingsStore = useSettingsStore();
const audioDBStore = useAudioDBStore();

async function ttsBatchGenerate() {
  const ttsConfig = settingsStore.getTTSConfig;
  const ossConfig = settingsStore.getOSSConfig;

  const exampleAudioDB = audioDBStore.getExampleAudioDB;

  const exampleAudio = await exampleAudioDB.getExampleAudio('test-default');

  const formData = new FormData();
  formData.append('ttsConfig', JSON.stringify(ttsConfig));
  formData.append('ossConfig', JSON.stringify(ossConfig));
  formData.append('exampleAudio', exampleAudio!.audio);
  formData.append('exampleText', exampleAudio!.text);
  formData.append('targetText', JSON.stringify({
    text: 'いらっしゃいませ！よくぞこの場所を見つけてくださいました、これも何かのご縁ですね。',
    id: 'test_0611'
  }));

  const res = await CommonApi.ttsBatchGenerate(formData);

  if (res.code === 200) {
    const eventSource = new EventSource('/api/tts-sse');

    eventSource.onmessage = (event) => {
      const progressData = JSON.parse(event.data);

      console.log(progressData);

      if (progressData.code === 2) {
        console.log('TTS End');
        eventSource.close();
      } else if (progressData.code === 0) {
        console.log('TTS Start')
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Failed', error);
    }
  }
}
</script>

<style lang="scss" scoped>
.tts-view {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-left: 20px;
}
</style>
