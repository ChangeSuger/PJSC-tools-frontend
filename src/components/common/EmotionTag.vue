<template>
  <a-select
    v-if="canEditEmotion"
    v-model="emotion"
    :options="ttsCharacterStore.getEmotionOptions"
    :trigger-props="{ contentClass: 'w-20!' }"
  >
    <template #trigger>
      <a-tag
        class="h-8! text-sm! *:px-2 *:py-1 *:font-bold"
        bordered
        :color="getEmotionColor(emotion)"
      >
        {{ emotion }}
      </a-tag>
    </template>
  </a-select>
  <a-tag
    class="h-8! text-sm! *:px-2 *:py-1 *:font-bold"
    bordered
    :color="getEmotionColor(emotion)"
    v-else
  >
    {{ emotion }}

  </a-tag>
</template>

<script setup lang="ts">
import { getEmotionColor } from '@/utils/getEmotionColor';
import { computed } from 'vue';
import { useTTSCharacterStore } from '@/stores';

const emits = defineEmits(['update:text']);

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  canEditEmotion: {
    type: Boolean,
    default: false,
  },
});

const ttsCharacterStore = useTTSCharacterStore();

const emotion = computed({
  get() {
    return props.text;
  },
  set(value) {
    emits('update:text', value);
  }
});
</script>
