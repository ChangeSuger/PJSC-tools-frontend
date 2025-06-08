<template>
  <MenuPanel />
  <div class="main-view fill-current">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuPanel from '@/components/menu/MenuPanel.vue';
</script>

<style scoped lang="scss">
.main-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: var(--color-bg);
  border-radius: 1.5rem;
  padding: 1rem;
}
</style>
