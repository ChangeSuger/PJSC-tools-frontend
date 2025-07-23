<template>
  <a-tag class="h-8! text-sm! *:px-2 *:py-1 *:font-bold" bordered :color="getEmotionColor(text)">
    {{ text }}
  </a-tag>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});

function getEmotionColor(emotion: string) {
  if (['开心', '吃惊'].includes(emotion)) {
    return 'green';
  } else if (['难过', '疑惑', '担忧'].includes(emotion)) {
    return 'blue';
  } else if (['紧张', '恐惧'].includes(emotion)) {
    return 'orange';
  } else if (['生气'].includes(emotion)) {
    return 'red';
  } else {
    return 'gray';
  }
}
</script>
