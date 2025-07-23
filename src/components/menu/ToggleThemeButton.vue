<template>
  <button
    class="w-10 h-10 rounded-lg flex justify-center items-center bg-transparent hover:bg-(--color-fill-4)"
    @click="settingsStore.toggleTheme()"
  >
    <IconSun class="text-3xl text-(--color-text-1)" v-if="settingsStore.getTheme === 'light'" />
    <IconMoon class="text-3xl text-(--color-text-1)" v-else />
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores';
import { IconMoon, IconSun } from '@arco-design/web-vue/es/icon';

const settingsStore = useSettingsStore();
</script>
