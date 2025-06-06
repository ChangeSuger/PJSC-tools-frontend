<template>
  <div class="menu-panel fill-height">
    <div class="menu-container">
      <div class="menu-title">PJSC Tools</div>

      <div
        class="menu-item"
        :class="{ 'menu-item__active': item.name === activeMenuName }"
        v-for="item in MENU_LIST"
        :key="item.name"
        @click="goTo(item.name)"
      >
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        {{ item.label }}
      </div>
    </div>

    <div class="menu-footer flex-horizontal fill-width">
      <ToggleThemeButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { MENU_LIST } from '@/datas';
import ToggleThemeButton from './ToggleThemeButton.vue';

const router = useRouter();

const activeMenuName = computed(() => router.currentRoute.value.name?.toString().split('.')[0]);

function goTo(menuName: string) {
  router.push({ name: `${menuName}` });
}
</script>

<style scoped lang="scss">
.menu-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2rem;
  padding-bottom: 0.5rem;

  .menu-title {
    font-size: 24px;
    font-weight: 700;
    padding: 0 10px;
  }

  .menu-item {
    width: 180px;
    font-size: 16px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 0.5rem;

    &:hover {
      background-color: var(--color-fill-4);
    }

    &__active {
      font-weight: 700;
    }
  }

  .menu-footer {
    justify-content: left;
    padding: 0 10px;

    button {
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
  }
}
</style>
