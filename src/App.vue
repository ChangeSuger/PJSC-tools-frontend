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

@media screen and (min-width: 768px) {
  .main-view {
    width: calc(100% - 188px);
  }
}

@media screen and (max-width: 768px) {
  .main-view {
    height: calc(100% - 56px);
  }
}
</style>
