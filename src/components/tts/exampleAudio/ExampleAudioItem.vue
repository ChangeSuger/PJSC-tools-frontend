<template>
  <div class="w-full p-2 rounded-2xl flex flex-row justify-between items-center gap-2 bg-(--color-bg)">
    <div class="w-20 flex justify-center items-center">
      <EmotionTag :text="emotion" />
    </div>

    <div class="w-full flex flex-row items-center justify-between gap-4">
      <template v-if="exampleAudioURL">
        <AudioPlayer :url="exampleAudioURL" />

        <a-typography class="w-full *:mb-0! mt-[5px]!">
          <a-typography-paragraph class="h-[27px]! w-full" editable v-model:editText="exampleAudioObject.text">
            {{ exampleAudioObject.text }}
          </a-typography-paragraph>
        </a-typography>
      </template>
    </div>

    <div>
      <a-button-group type="text">
        <a-tooltip content="上传参考音频">
          <a-button @click="uploadExampleAudio">
            <template #icon>
              <IconUpload />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="更新参考音频">
          <a-button @click="putExampleAudioObject" :disabled="!putable">
            <template #icon>
              <IconCheck />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="重置参考音频">
          <a-button @click="resetExampleAudioObject" :disabled="!putable">
            <template #icon>
              <IconRefresh />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="删除参考音频">
          <a-button status="danger" @click="clearExampleAudioObject">
            <template #icon>
              <IconDelete />
            </template>
          </a-button>
        </a-tooltip>
      </a-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type PropType } from 'vue';
import { useAudioDBStore } from '@/stores';

import type { ExampleAudioObject, Emotion } from '@/types';

import { IconUpload, IconDelete, IconCheck, IconRefresh } from '@arco-design/web-vue/es/icon';
import AudioPlayer from '@/components/common/AudioPlayer.vue';
import EmotionTag from '@/components/common/EmotionTag.vue';
import { Message } from '@arco-design/web-vue';

const exampleAudioObjectInit = {
  audio: undefined,
  text: '',
};

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
  ...exampleAudioObjectInit,
});

const exampleAudioObjectTemp = ref(exampleAudioObject.value);

const putable = computed(() => {
  const { audio: audioTemp , text: textTemp } = exampleAudioObjectTemp.value;
  const { audio, text } = exampleAudioObject.value;
  return audio !== audioTemp || text !== textTemp;
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
    exampleAudioObjectTemp.value = { ...exampleAudioObject.value };
  }
}

async function putExampleAudioObject() {
  try {
    await audioDBStore.getExampleAudioDB.addExampleAudio(exampleAudioObject.value as ExampleAudioObject);
    Message.success('参考音频更新成功。');

    exampleAudioObjectTemp.value = { ...exampleAudioObject.value };
  } catch (error) {
    console.log(error);
    Message.error('参考音频更新失败，请重试。');
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

function resetExampleAudioObject() {
  exampleAudioObject.value = {
    ...exampleAudioObjectTemp.value
  };
}

async function clearExampleAudioObject() {
  exampleAudioObject.value = {
    id: props.id,
    ...exampleAudioObjectInit,
  }
}

onMounted(() => {
  getExampleAudioObject();
});
</script>
