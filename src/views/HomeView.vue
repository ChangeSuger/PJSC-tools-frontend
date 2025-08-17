<template>
  <div class="home-view w-full h-full flex flex-col overflow-y-scroll pl-2.5">
    <a-row :gutter="16" class="w-full gap-y-4 pt-2">
      <a-col
        v-for="menu of MENU_LIST.slice(1)"
        :key="menu.name"
        :span="8"
      >
        <a-card
          class="w-full cursor-pointer rounded-2xl! hover:transform-[translateY(-4px)]"
          :style="{ transitionProperty: 'all' }"
          hoverable
          @click="goTo(menu.name)"
          :body-style="{ height: '120px' }"
        >
          <div class="w-full h-full flex items-center justify-center">
            <a-typography class="text-3xl text-center">
              <component :is="menu.icon" />
              {{ menu.label }}
            </a-typography>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { MENU_LIST } from '@/datas';
import { useRouter } from 'vue-router';

const router = useRouter();

function goTo(menuName: string) {
  router.push({ name: `${menuName}` });
}
</script>
