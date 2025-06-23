<template>
  <div class="translate-check-item rounded-medium">
    <div class="translate-check-item-left">
      <div class="character-name">
        <el-text>
          {{ storyItem.cid }}
        </el-text>
      </div>
    </div>

    <div class="translate-check-item-center" style="flex: 1">
      <div class="content-cn fill-width">
        <el-text size="large">
          {{ storyItem.line }}
        </el-text>
      </div>

      <div class="content-jp fill-width">
        <slot name="jp"></slot>
      </div>
    </div>

    <div class="translate-check-item-right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { StoryItem } from '@/types';

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.translate-check-item {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  background-color: var(--color-bg);

  .translate-check-item-left {
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

  .translate-check-item-center {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;
  }
}
</style>