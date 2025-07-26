<template>
  <div class="w-full p-2 rounded-2xl flex flex-row justify-between items-center gap-2 bg-(--color-bg)">
    <div class="w-20 flex justify-center items-center">
      <EmotionTag :text="emotion" />
    </div>

    <div class="w-full flex flex-col justify-around gap-2">
      <div class="flex items-center gap-2">
        <audio class="h-8" v-if="exampleAudioURL" controls :src="exampleAudioURL"></audio>
      </div>

      <div>
        <a-input v-model="exampleAudioObject.text" />
      </div>
    </div>

    <div>
      <a-space direction="vertical">
        <a-button type="primary" @click="uploadExampleAudio">上传音频</a-button>
        <a-button type="primary" @click="putExampleAudioObject">更新音频</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type PropType } from 'vue';
import { useAudioDBStore } from '@/stores';

import type { ExampleAudioObject, Emotion } from '@/types';

import EmotionTag from '@/components/common/EmotionTag.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  emotion: {
    type: String as PropType<Emotion>,
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
      exampleAudioObject.value.text = audio.name.split('.')[0];
    }
  }

  input.click();
}

onMounted(() => {
  getExampleAudioObject();
});
</script>
