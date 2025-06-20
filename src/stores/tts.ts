import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTTSCharacterStore = defineStore(
  'tts-character-settings', () => {
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
