<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="w-full p-2 rounded-2xl flex flex-row justify-between items-center gap-1 bg-(--color-bg)">
    <div class="w-30 flex flex-col justify-center items-center gap-2">
      <div class="px-2.5 py-1 bg-(--color-fill-3) rounded-2xl">
        <a-typography>
          {{ storyItem.cid }}
        </a-typography>
      </div>
      <EmotionTag v-model:text="storyItem.emotion" :can-edit-emotion="canEditEmotion" />
    </div>

    <div class="w-full p-2 flex flex-col justify-center items-start gap-2">
      <div>
        <a-typography size="large">
          {{ storyItem.line }}
        </a-typography>
      </div>

      <div class="flex gap-2" v-if="storyItem.cnAudioURLs.length">
        <AudioPlayer
          v-for="(url, index) of storyItem.cnAudioURLs"
          :key="`audio-${storyItem.id}-${index}`"
          :url="url"
        />
      </div>

      <div v-if="storyItem.lineJP">
        <a-typography size="large">
          {{ storyItem.lineJP }}
        </a-typography>
      </div>

      <div class="flex gap-2" v-if="storyItem.jpAudioURLs.length">
        <AudioPlayer
          v-for="(url, index) of storyItem.jpAudioURLs"
          :key="`audio-${storyItem.id}-${index}`"
          :url="url"
        />
      </div>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { StoryItem } from '@/types';

import AudioPlayer from '@/components/common/AudioPlayer.vue';
import EmotionTag from '@/components/common/EmotionTag.vue';

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
  canEditEmotion: {
    type: Boolean,
    default: false,
  },
});
</script>
