<template>
  <div class="w-full p-2 flex justify-between items-center gap-1 rounded-2xl bg-(--color-bg)">
    <div class="w-25 flex flex-col justify-center items-center gap-2">
      <div class="px-2.5 py-1 rounded-2xl bg-(--color-fill-3)">
        <a-typography>
          {{ storyItem.cid }}
        </a-typography>
      </div>
      <EmotionTag :text="storyItem.emotion" />
    </div>

    <div class="w-full p-2 flex flex-col justify-center items-start gap-2">
      <div>
        <a-typography size="large">
          {{ storyItem.line }}
        </a-typography>
      </div>

      <div v-if="storyItem.lineJP">
        <a-typography size="large">
          {{ storyItem.lineJP }}
        </a-typography>
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

import EmotionTag from '../common/EmotionTag.vue';

defineProps({
  storyItem: {
    type: Object as PropType<StoryItem>,
    required: true,
  },
});
</script>
