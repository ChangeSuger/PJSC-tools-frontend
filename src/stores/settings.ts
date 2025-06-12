import { ref, computed, watch, onMounted } from 'vue';
import { defineStore } from 'pinia';
import { usePreferredDark } from '@vueuse/core';
import { LLM_CONFIG_INIT, TTS_CONFIG_INIT, OSS_CONFIG_INIT } from '@/datas';

import type { LLMConfig, TTSConfig, OSSConfig, Theme } from '@/types';

export const useSettingsStore = defineStore(
  'global-settings',
  () => {
    const theme = ref<Theme>('auto');
    const isDark = usePreferredDark();

    const getTheme = computed<Theme>(() => {
      return theme.value === 'auto'
        ? (isDark.value ? 'dark' : 'light')
        : theme.value;
    });

    function toggleTheme () {
      if (getTheme.value === 'dark') {
        theme.value = isDark.value ? 'light' : 'auto';
      } else {
        theme.value = isDark.value ? 'auto' : 'dark';
      }
    }

    watch(
      () => getTheme.value,
      (theme) => {
        if (theme === 'light') {
          document.body.removeAttribute('class');
          document.documentElement.removeAttribute('class');
        } else {
          document.body.setAttribute('class', 'dark');
          document.documentElement.setAttribute('class', 'dark');
        }
      }
    );

    onMounted(() => {
      if (getTheme.value === 'dark') {
        document.body.setAttribute('class', 'dark');
        document.documentElement.setAttribute('class', 'dark');
      }
    });

    const llmConfig = ref<LLMConfig>({ ...LLM_CONFIG_INIT });

    const getLLMConfig = computed<LLMConfig>(() => {
      return { ...llmConfig.value };
    });

    function setLLMConfig(config: LLMConfig) {
      llmConfig.value = { ...config };
    }

    /**
     * 检查 LLMConfig 是否设置完整，只检查是否存在空的项目，不保证可用。。
     */
    function checkLLMConfig(): boolean {
      const { apiKey, baseURL, model } = llmConfig.value;
      return !!(apiKey && baseURL && model);
    }

    const ttsConfig = ref<TTSConfig>({ ...TTS_CONFIG_INIT });

    const getTTSConfig = computed<TTSConfig>(() => {
      return { ...ttsConfig.value };
    });

    function setTTSConfig(config: TTSConfig) {
      ttsConfig.value = { ...config };
    }

    const ossConfig = ref<OSSConfig>({ ...OSS_CONFIG_INIT });

    const getOSSConfig = computed<OSSConfig>(() => {
      return { ...ossConfig.value };
    });

    function setOSSConfig(config: OSSConfig) {
      ossConfig.value = { ...config };
    }

    return {
      theme,
      getTheme,
      toggleTheme,

      llmConfig,
      getLLMConfig,
      setLLMConfig,
      checkLLMConfig,

      ttsConfig,
      getTTSConfig,
      setTTSConfig,

      ossConfig,
      getOSSConfig,
      setOSSConfig,
    };
  },
  {
    persist: true,
  },
);