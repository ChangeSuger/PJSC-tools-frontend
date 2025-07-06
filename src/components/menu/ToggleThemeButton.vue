<template>
  <button
    class="w-10 h-10 bg-transparent rounded-lg flex justify-center items-center hover:bg-(--color-fill-4)"
    @click="settingsStore.toggleTheme()"
  >
    <el-icon :size="30" class="*:text-(--color-text-1)">
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
