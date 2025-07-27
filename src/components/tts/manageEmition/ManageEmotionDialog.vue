<template>
  <a-button type="text" @click="open">
    情感标签管理
  </a-button>

  <a-modal
    body-class="p-4!"
    modal-class="max-h-[95vh]"
    v-model:visible="visible"
    width="40%"
    title="情感标签管理"
    :footer="false"
  >
    <template v-for="emotionClass of (Object.keys(emotionConfig) as EmotionClass[])" :key="emotionClass">
      <div class="flex items-center gap-2 pl-6 mb-2!">
        <EmotionTag :text="emotionClass" />

        <div class="flex-auto">
          <a-divider></a-divider>
        </div>
      </div>

      <ManageSubEmotion :emotion-class="emotionClass" :emotions="emotionConfig[emotionClass]" />
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import type { EmotionClass } from '@/types';
import ManageSubEmotion from './ManageSubEmotion.vue';
import EmotionTag from '@/components/common/EmotionTag.vue';

const ttsCharacterStore = useTTSCharacterStore();

const visible = ref(false);

const emotionConfig = computed(() => ttsCharacterStore.emotionConfig);

function open() {
  visible.value = true;
}
</script>
