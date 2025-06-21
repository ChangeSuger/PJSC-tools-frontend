<template>
  <el-tag class="emotion-tag" :type="getEmotionType(text)">
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

<style lang="scss">
.emotion-tag {
  height: 32px;
  font-size: 14px;

  .el-tag__content {
    padding: 4px 8px;
    font-weight: 700;
  }
}
</style>