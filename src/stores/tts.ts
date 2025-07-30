import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { CharacterModelConfig, TTSCharacterConfig, EmotionConfig, EmotionClass } from '@/types';
import { TTS_CHARACTER_CONFIG_INIT, CHARACTERS_INIT, getCharacterModelConfigInit, EMOTION_CONFIG_INIT, DEFAULT_EMOTION_CLASS } from '@/datas';
import { type SelectOptionGroup } from '@arco-design/web-vue'

export const useTTSCharacterStore = defineStore(
  'tts-character-settings', () => {
    const characters = ref<string[]>([ ...CHARACTERS_INIT ]);

    const ttsCharacterConfigMap = ref<Record<string, TTSCharacterConfig>>({});

    const characterModelConfigMap = ref<Record<string, CharacterModelConfig>>({});

    const emotionConfig = ref<EmotionConfig>(EMOTION_CONFIG_INIT);

    function setCharacters(newCharacters: string[]) {
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

      characters.value = newCharacters;
    }

    function setTTSCharacterConfig(character: string, config: TTSCharacterConfig) {
      ttsCharacterConfigMap.value[character] = config;
    }

    function setCharacterModelConfig(character: string, config: CharacterModelConfig) {
      characterModelConfigMap.value[character] = config;
    }

    function getModelByCharacterAndEmotion(character: string, emotion: string) {
      const emotionClass = getEmotionMap.value[emotion] as EmotionClass;

      const modelConfig = characterModelConfigMap.value[character];

      let { sovitsModel, gptModel } = modelConfig[emotionClass];

      if (!sovitsModel || !gptModel) {
        sovitsModel = modelConfig[DEFAULT_EMOTION_CLASS].sovitsModel;
        gptModel = modelConfig[DEFAULT_EMOTION_CLASS].gptModel;
      }

      if (sovitsModel && gptModel) {
        return {
          sovitsModel,
          gptModel,
        };
      } else {
        return null;
      }
    }

    function getEmotionList(): string[] {
      return Object.entries(emotionConfig.value).map(([emotionClass, emotions]) => {
        return [emotionClass, ...emotions];
      }).flat();
    }

    const getEmotionMap = computed(() => Object
      .entries(emotionConfig.value)
      .reduce<Record<string, string>>(
        (acc, [emotionClass, emotions]) => {
          emotions.forEach((emotion) => {
            acc[emotion] = emotionClass;
          });

          acc[emotionClass] = emotionClass;

          return acc;
        },
        {},
      ),
    );

    const getEmotionOptions = computed<SelectOptionGroup[]>(() => Object
      .entries(emotionConfig.value)
      .reduce<SelectOptionGroup[]>(
        (acc, [emotionClass, emotions]) => {
          acc.push({
            isGroup: true,
            label: emotionClass,
            options: [emotionClass, ...emotions],
          });

          return acc;
        },
        []
      )
    );

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
      getEmotionMap,
      getModelByCharacterAndEmotion,
      getEmotionOptions,

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
