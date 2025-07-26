<template>
  <div>
    <audio class="w-0 h-0 invisible" :src="url" controls ref="audioRef"></audio>
    <a-button size="large" plain class="text-3xl! w-10 h-10! rounded-full!" @click="audioPlay">
      <template #icon>
        <IconPlayCircle v-if="!isPlaying" />
        <IconPauseCircle v-else />
      </template>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconPlayCircle, IconPauseCircle } from '@arco-design/web-vue/es/icon';

defineProps({
  url: {
    type: String,
    required: true,
  }
});

let timer: NodeJS.Timeout | null = null;

const audioRef = ref<HTMLAudioElement>();
const isPlaying = ref(false);

function audioPlay() {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
}

function play() {
  audioRef.value?.play();
  isPlaying.value = true;
  timer = setInterval(() => {
    if (audioRef.value?.paused && isPlaying.value) {
      isPlaying.value = false;
      clearInterval(timer!);
    }
  }, 100);
}

function pause() {
  audioRef.value?.pause();
  isPlaying.value = false;
}
</script>
