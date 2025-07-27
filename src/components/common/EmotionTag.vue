<template>
  <a-tag
    class="h-8! text-sm! *:px-2 *:py-1 *:font-bold"
    bordered
    :color="getEmotionColor(text)"
  >
    {{ text }}
  </a-tag>
</template>

<script setup lang="ts">
import { getEmotionColor } from '@/utils/getEmotionColor';

defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
