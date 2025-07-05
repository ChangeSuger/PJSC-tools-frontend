<template>
  <div class="w-full p-2 flex flex-row justify-between items-center gap-1 bg-(--color-bg) rounded-2xl">
    <div class="w-25 flex flex-col justify-center items-center">
      <div class="py-1 px-2.5 bg-(--color-fill-3) rounded-2xl">
        <el-text>
          {{ storyItem.cid }}
        </el-text>
      </div>
    </div>

    <div class="w-full p-2 flex flex-col justify-center items-start gap-2">
      <div class="w-full">
        <el-text size="large">
          {{ storyItem.line }}
        </el-text>
      </div>

      <div class="w-full">
        <slot name="jp"></slot>
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

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});
</script>
