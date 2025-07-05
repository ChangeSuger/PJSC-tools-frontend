<template>
  <el-tag class="h-8! text-sm! *:px-2 *:py-1 *:font-bold" :type="getEmotionType(text)">
    {{ text }}
  </el-tag>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});

function getEmotionType(emotion: string) {
  if (['开心', '吃惊'].includes(emotion)) {
    return 'primary';
  } else if (['难过', '疑惑', '担忧'].includes(emotion)) {
    return 'success';
  } else if (['紧张', '恐惧'].includes(emotion)) {
    return 'warning';
  } else if (['生气'].includes(emotion)) {
    return 'danger';
  } else {
    return 'info';
  }
}
</script>
