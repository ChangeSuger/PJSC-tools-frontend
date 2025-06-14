<template>
  <div class="story-viewer-item rounded-medium">
    <div class="story-viewer-item-left">
      <div class="character-name">
        <el-text>
          {{ storyItem.character }}
        </el-text>
      </div>
    </div>

    <div class="story-viewer-item-center" style="flex: 1">
      <div class="content-cn">
        <el-text size="large">
          {{ storyItem.content }}
        </el-text>
      </div>

      <div class="content-jp" v-if="storyItem.contentJP">
        <el-text size="large">
          {{ storyItem.contentJP }}
        </el-text>
      </div>
    </div>

    <div class="story-viewer-item-right">
      <el-button @click="translate">翻译</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { StoryItem } from '@/types';

const emit = defineEmits(['translate']);

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});

function translate() {
  emit('translate');
}
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
  }
}
</style>