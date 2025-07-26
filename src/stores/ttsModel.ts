import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores';
import { CommonApi } from '@/api';

export const useTTSModelStore = defineStore(
  'tts-model-store',
  () => {
    const settingsStore = useSettingsStore();

    const sovitsOptions = ref<string[]>([]);
    const gptOptions = ref<string[]>([]);

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

    onMounted(() => {
      refreshChoices();
    })

    return {
      getSovitsOptions,
      getGptOptions,
      getSovitsModelSelected,
      getGptmodelSelected,

      setSovitsModelSelected,
      setGptModelSelected,
      refreshChoices,
    }
  },
);
