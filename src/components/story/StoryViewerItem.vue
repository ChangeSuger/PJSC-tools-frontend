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
        <a-typography>
          {{ storyItem.line }}
        </a-typography>
      </div>

      <slot name="jp">
        <a-typography class="w-full *:mb-0!" v-if="storyItem.lineJP">
          <a-typography-paragraph
            class="h-[27px]!"
            :editable="canEditLineJP"
            v-model:editText="storyItem.lineJP"
          >
            {{ storyItem.lineJP }}
          </a-typography-paragraph>
        </a-typography>
      </slot>

      <slot name="audio" v-if="showAudio">
        <div class="flex gap-2" v-if="storyItem.jpAudioURLs.length">
          <AudioPlayer
            v-for="(url, index) of storyItem.jpAudioURLs"
            :key="`audio-${storyItem.id}-${index}`"
            :url="url"
          />
        </div>
      </slot>
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
  showAudio: {
    type: Boolean,
    default: false,
  },
  canEditLineJP: {
    type: Boolean,
    default: false,
  }
});
</script>
