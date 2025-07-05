<template>
  <MenuPanel />
  <div class="
    w-full h-full rounded-3xl p-4 bg-(--color-bg)
    flex justify-center items-center
  ">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuPanel from '@/components/menu/MenuPanel.vue';
</script>
