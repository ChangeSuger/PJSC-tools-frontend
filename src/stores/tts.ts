import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import type { CharacterModelConfig, TTSCharacterConfig } from '@/types';
import { TTS_CHARACTER_CONFIG_INIT, CHARACTERS_INIT, getCharacterModelConfigInit } from '@/datas';

export const useTTSCharacterStore = defineStore(
  'tts-character-settings', () => {
    const characters = ref<string[]>([ ...CHARACTERS_INIT ]);

    const ttsCharacterConfigMap = ref<Record<string, TTSCharacterConfig>>({});

    const characterModelConfigMap = ref<Record<string, CharacterModelConfig>>({});

    function setCharacters(newCharacters: string[]) {
      characters.value = newCharacters;

      newCharacters.forEach((character) => {
        const ttsConfig = ttsCharacterConfigMap.value[character];
        const modelConfig = characterModelConfigMap.value[character];

        if (!ttsConfig) {
          ttsCharacterConfigMap.value[character] = { ...TTS_CHARACTER_CONFIG_INIT };
        }

        if (!modelConfig) {
          characterModelConfigMap.value[character] = getCharacterModelConfigInit();
        }
      });
    }

    function setTTSCharacterConfig(character: string, config: TTSCharacterConfig) {
      ttsCharacterConfigMap.value[character] = config;
    }

    function setCharacterModelConfig(character: string, config: CharacterModelConfig) {
      characterModelConfigMap.value[character] = config;
    }

    onMounted(() => {
      characters.value.forEach((character) => {
        const ttsConfig = ttsCharacterConfigMap.value[character];
        const modelConfig = characterModelConfigMap.value[character];

        if (!ttsConfig) {
          ttsCharacterConfigMap.value[character] = { ...TTS_CHARACTER_CONFIG_INIT };
        }

        if (!modelConfig) {
          characterModelConfigMap.value[character] = getCharacterModelConfigInit();
        }
      });
    });

    return {
      characters,
      ttsCharacterConfigMap,
      characterModelConfigMap,

      setCharacters,
      setTTSCharacterConfig,
      setCharacterModelConfig,
    }
  },
  {
    persist: true,
  }
);
