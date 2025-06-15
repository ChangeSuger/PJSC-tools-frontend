<template>
  <el-tag class="emotion-tag">
    {{ text }}
  </el-tag>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
})
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