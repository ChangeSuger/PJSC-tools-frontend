<template>
  <div class="h-full flex flex-col justify-between p-2 pt-4">
    <div>
      <div class="text-2xl px-2.5 py-1 font-bold">
        PJSC Tools
      </div>

      <div
        class="
          w-45 text-base cursor-pointer py-1.5 px-2.5 rounded-lg flex flex-row items-center gap-2
          hover:bg-(--color-fill-4) data-[active=true]:font-bold data-[active=true]:underline
        "
        v-for="item in MENU_LIST"
        :data-active="item.name === activeMenuName"
        :key="item.name"
        @click="goTo(item.name)"
      >
        <component :is="item.icon" />

        {{ item.label }}
      </div>
    </div>

    <div class="w-full flex flex-row">
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
