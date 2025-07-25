import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import type { TTSCharacterConfig } from '@/types';
import { TTS_CHARACTER_CONFIG_INIT, CHARACTERS_INIT } from '@/datas';

export const useTTSCharacterStore = defineStore(
  'tts-character-settings', () => {
    const characters = ref<string[]>([ ...CHARACTERS_INIT ]);

    const ttsCharacterConfigMap = ref<Record<string, TTSCharacterConfig>>({});

    function setCharacters(newCharacters: string[]) {
      characters.value = newCharacters;

      newCharacters.forEach((character) => {
        const config = ttsCharacterConfigMap.value[character];
        if (!config) {
          ttsCharacterConfigMap.value[character] = { ...TTS_CHARACTER_CONFIG_INIT };
        }
      });
    }

    function setTTSCharacterConfig(character: string, config: TTSCharacterConfig) {
      ttsCharacterConfigMap.value[character] = config;
    }

    onMounted(() => {
      characters.value.forEach((character) => {
        const config = ttsCharacterConfigMap.value[character];
        if (!config) {
          ttsCharacterConfigMap.value[character] = { ...TTS_CHARACTER_CONFIG_INIT };
        }
      });
    });

    return {
      characters,

      setCharacters,

      ttsCharacterConfigMap,

      setTTSCharacterConfig,
    }
  },
  {
    persist: true,
  }
);
