import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import type { CharacterModelConfig, TTSCharacterConfig, EmotionConfig, EmotionClass } from '@/types';
import { TTS_CHARACTER_CONFIG_INIT, CHARACTERS_INIT, getCharacterModelConfigInit, EMOTION_CONFIG_INIT } from '@/datas';

export const useTTSCharacterStore = defineStore(
  'tts-character-settings', () => {
    const characters = ref<string[]>([ ...CHARACTERS_INIT ]);

    const ttsCharacterConfigMap = ref<Record<string, TTSCharacterConfig>>({});

    const characterModelConfigMap = ref<Record<string, CharacterModelConfig>>({});

    const emotionConfig = ref<EmotionConfig>(EMOTION_CONFIG_INIT);

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

    function getEmotionList(): string[] {
      return Object.entries(emotionConfig.value).map(([emotionClass, emotions]) => {
        return [emotionClass, ...emotions];
      }).flat();
    }

    function checkEmotionExisted(emotion: string) {
      return getEmotionList().includes(emotion);
    }

    function addEmotion(emotionClass: EmotionClass, subEmotion: string) {
      emotionConfig.value[emotionClass].push(subEmotion);
    }

    function deleteEmotion(emotionClass: EmotionClass, index: number) {
      emotionConfig.value[emotionClass].splice(index, 1);
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
      emotionConfig,

      getEmotionList,

      setCharacters,
      setTTSCharacterConfig,
      setCharacterModelConfig,
      checkEmotionExisted,
      addEmotion,
      deleteEmotion,
    }
  },
  {
    persist: true,
  }
);
