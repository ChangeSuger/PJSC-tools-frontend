import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores';
import { CommonApi } from '@/api';
import type { EmotionText } from '@/types';

export const useTTSModelStore = defineStore(
  'tts-model-store',
  () => {
    const settingsStore = useSettingsStore();

    const sovitsOptions = ref<string[]>([]);
    const gptOptions = ref<string[]>([]);
    const emotionTexts = ref<EmotionText[]>([]);

    const sovitsModelSelected = ref('');
    const gptModelSelected = ref('');

    const getSovitsOptions = computed(() => sovitsOptions.value);
    const getGptOptions = computed(() => gptOptions.value);

    const getSovitsModelSelected = computed(() => sovitsModelSelected.value);
    const getGptmodelSelected = computed(() => gptModelSelected.value);

    function setSovitsModelSelected(model: string) {
      sovitsModelSelected.value = model;
    }

    function setGptModelSelected(model: string) {
      gptModelSelected.value = model;
    }

    async function refreshChoices() {
      const { baseURL } = settingsStore.getTTSConfig;
      if (baseURL) {
        const res = await CommonApi.getChoices(baseURL);

        if (res.code === 200) {
          const [{ choices: sovitsChoices}, { choices: gptChoices}] = res.data;

          sovitsOptions.value = sovitsChoices.map((choice) => choice[0]);
          gptOptions.value = gptChoices.map((choice) => choice[0]);

          return true;
        } else {
          return false;
        }
      }
      return false;
    }

    async function changeModel(
      sovitsModel: string,
      gptModel: string,
      enforce: boolean = false,
    ) {
      if (enforce ||
        (
          sovitsModel !== sovitsModelSelected.value ||
          gptModel !== gptModelSelected.value
        )
      ) {
        const res = await CommonApi.changeModel({
          url: settingsStore.getTTSConfig.baseURL,
          sovitsModel,
          gptModel,
          originLang: '日文',
          targetLang: '日文',
        });

        if (res.code === 200) {
          setSovitsModelSelected(sovitsModel);
          setGptModelSelected(gptModel);
          return true;
        } else {
          return false;
        }
      }

      return true;
    }

    const getEnableEmotionTexts = computed(
      () => emotionTexts.value.filter(({enable}) => enable)
    );

    function setEmotionTexts(testTexts: EmotionText[]) {
      emotionTexts.value = testTexts;
    }

    onMounted(() => {
      refreshChoices();
    });

    return {
      emotionTexts,

      getSovitsOptions,
      getGptOptions,
      getSovitsModelSelected,
      getGptmodelSelected,
      getEnableEmotionTexts,

      changeModel,
      refreshChoices,
      setEmotionTexts,
    }
  },
  {
    persist: true,
  }
);
