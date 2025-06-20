<template>
  <div class="story-viewer-item rounded-medium">
    <div class="story-viewer-item-left">
      <div class="character-name">
        <el-text>
          {{ storyItem.cid }}
        </el-text>
      </div>
    </div>

    <div class="story-viewer-item-center" style="flex: 1">
      <div class="content-cn">
        <el-text size="large">
          {{ storyItem.line }}
        </el-text>
      </div>

      <div class="content-jp" v-if="storyItem.lineJP">
        <el-text size="large">
          {{ storyItem.lineJP }}
        </el-text>
      </div>

      <div class="audios" v-if="storyItem.jpAudioURLs.length">
        <AudioPlayer
          v-for="(url, index) of storyItem.jpAudioURLs"
          :key="`audio-${storyItem.id}-${index}`"
          :url="url"
        />
      </div>
    </div>

    <div class="story-viewer-item-right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { StoryItem } from '@/types';

import AudioPlayer from '../tts/AudioPlayer.vue';

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.story-viewer-item {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  background-color: var(--color-bg);

  .story-viewer-item-left {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    .character-name {
      padding: 4px 10px;
      border-radius: 1rem;
      background-color: var(--color-fill-3);
    }
  }

  .story-viewer-item-center {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;

    .audios {
      display: flex;
      gap: 0.5rem;
    }
  }
}
</style>