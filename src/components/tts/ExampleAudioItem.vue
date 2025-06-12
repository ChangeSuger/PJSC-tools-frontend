<template>
  <div class="example-audio-item rounded-medium">
    <div class="example-audio-item-left">
      <el-tag>默认</el-tag>
    </div>

    <div class="example-audio-item-right">
      <div class="example-audio-player">
        <audio v-if="exampleAudioURL" controls :src="exampleAudioURL"></audio>
        <el-button type="primary" @click="uploadExampleAudio">上传音频</el-button>
        <el-button type="primary" @click="putExampleAudioObject">更新音频</el-button>
      </div>

      <div class="example-audio-text">
        <el-input v-model="exampleAudioObject.text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExampleAudioDB } from '@/utils/exampleAudioDB';
import { type PropType, ref, onMounted, computed } from 'vue';
import type { ExampleAudioObject } from '@/types';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  exampleAudioDB: {
    type: Object as PropType<ExampleAudioDB>,
    required: true,
  },
});

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
  const object = await props.exampleAudioDB.getExampleAudio(props.id);
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
    await props.exampleAudioDB.addExampleAudio(exampleAudioObject.value as ExampleAudioObject);
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
    width: 100px;
  }

  .example-audio-item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 0.5rem;

    .example-audio-player {
      display: flex;
      align-items: center;
    }
  }
}
</style>