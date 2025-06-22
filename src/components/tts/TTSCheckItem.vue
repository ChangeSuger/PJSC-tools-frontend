<template>
  <div class="tts-check-item rounded-medium">
    <div class="tts-check-item-left">
      <div class="character-name">
        <el-text>
          {{ storyItem.cid }}
        </el-text>
      </div>
      <EmotionTag :text="storyItem.emotion" />
    </div>

    <div class="tts-check-item-center" style="flex: 1">
      <div class="content-cn">
        <el-text size="large">
          {{ storyItem.line }}
        </el-text>
      </div>

      <div class="fill-width">
        <slot name="cn"></slot>
      </div>

      <div class="content-jp" v-if="storyItem.lineJP">
        <el-text size="large">
          {{ storyItem.lineJP }}
        </el-text>
      </div>

      <div class="fill-width">
        <slot name="jp"></slot>
      </div>
    </div>

    <div class="tts-check-item-right">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import type { StoryItem } from '@/types';

import EmotionTag from '../tts/EmotionTag.vue';

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.tts-check-item {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  background-color: var(--color-bg);

  .tts-check-item-left {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    .character-name {
      padding: 4px 10px;
      border-radius: 1rem;
      background-color: var(--color-fill-3);
    }
  }

  .tts-check-item-center {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;
  }
}
</style>