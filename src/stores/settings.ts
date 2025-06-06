import { ref, computed, watch, onMounted } from 'vue';
import { defineStore } from 'pinia';
import { usePreferredDark } from '@vueuse/core';

type Theme = 'light' | 'dark' | 'auto';

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
          document.body.removeAttribute('arco-theme');
        } else {
          document.body.setAttribute('arco-theme', 'dark');
        }
      }
    );

    onMounted(() => {
      if (getTheme.value === 'dark') {
        document.body.setAttribute('arco-theme', 'dark');
      }
    });

    return {
      theme,
      getTheme,

      toggleTheme,
    }
  },
  {
    persist: true,
  },
);