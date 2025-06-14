<template>
  <div class="example-audio-item rounded-medium">
    <div class="example-audio-item-left">
      <EmotionTag text="默认" />
    </div>

    <div class="example-audio-item-center">
      <div class="example-audio-player">
        <audio v-if="exampleAudioURL" controls :src="exampleAudioURL"></audio>
        <el-button type="primary" @click="uploadExampleAudio">上传音频</el-button>
      </div>

      <div class="example-audio-text">
        <el-input v-model="exampleAudioObject.text" />
      </div>
    </div>

    <div class="example-audio-item-right">
      <el-button type="primary" @click="putExampleAudioObject">更新音频</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAudioDBStore } from '@/stores';

import type { ExampleAudioObject } from '@/types';

import EmotionTag from './EmotionTag.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const audioDBStore = useAudioDBStore();

const exampleAudioObject = ref<Pick<ExampleAudioObject, 'id' | 'text'> & Partial<Pick<ExampleAudioObject, 'audio'>>>({
  id: props.id,
  audio: undefined,
  text: '',
});

const exampleAudioURL = computed(() => {
  const exampleAudio = exampleAudioObject.value.audio;
  if (exampleAudio) {
    return URL.createObjectURL(exampleAudio);
  } else {
    return null;
  }
});

async function getExampleAudioObject() {
  const object = await audioDBStore.getExampleAudioDB.getExampleAudio(props.id);
  if (object) {
    exampleAudioObject.value = {
      ...exampleAudioObject.value,
      ...object,
    };
  }
}

async function putExampleAudioObject() {
  try {
    console.log(111);
    await audioDBStore.getExampleAudioDB.addExampleAudio(exampleAudioObject.value as ExampleAudioObject);
    console.log('success');
  } catch (error) {
    console.log(error);
  }
}

function uploadExampleAudio() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.wav';
  input.onchange = () => {
    const audio = input.files?.[0];
    if (audio) {
      exampleAudioObject.value.audio = audio;
    }
  }

  input.click();
}

onMounted(() => {
  getExampleAudioObject();
});

</script>

<style lang="scss" scoped>
.example-audio-item {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-bg);

  .example-audio-item-left {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .example-audio-item-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 0.5rem;

    .example-audio-player {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      audio {
        height: 32px;
      }
    }
  }
}
</style>