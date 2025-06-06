<template>
  <button
    class="toggle-theme-button center rounded-small"
    @click="settingsStore.toggleTheme()"
  >
    <el-icon :size="30">
      <Sunny v-if="settingsStore.getTheme === 'light'" />
      <Moon v-else />
    </el-icon>
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores';
import { Sunny, Moon } from '@element-plus/icons-vue'

const settingsStore = useSettingsStore();
</script>

<style scoped lang="scss">
.toggle-theme-button {
  width: 40px;
  height: 40px;
  background-color: transparent;

  &:hover {
    background-color: var(--color-fill-4);
  }

  svg {
    color: var(--color-text-1);
  }
}
</style>
