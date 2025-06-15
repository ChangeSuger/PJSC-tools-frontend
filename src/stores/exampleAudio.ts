import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useExampleAudioStore = defineStore(
  'example-audio', () => {
    const characters = ref<string[]>([]);

    function setCharacters(newVal: string[]) {
      characters.value = newVal;
    }

    return {
      characters,

      setCharacters,
    }
  },
  {
    persist: true,
  }
);
