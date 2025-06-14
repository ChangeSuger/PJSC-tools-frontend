import { defineStore } from 'pinia';
import { ExampleAudioDB } from '@/utils/exampleAudioDB';
import { ref, computed } from 'vue';

export const useAudioDBStore = defineStore(
  'tts-store',
  () => {
    const exampleAudioDB = ref<ExampleAudioDB>(new ExampleAudioDB());

    const getExampleAudioDB = computed(() => {
      return exampleAudioDB.value;
    });

    return {
      getExampleAudioDB,
    }
  },
);
