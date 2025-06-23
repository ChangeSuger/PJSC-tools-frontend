import { defineStore } from 'pinia';
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';

import { TRANSLATE_SYSTEM_MESSAGE_ITEM_DEFAULT } from '@/datas';

import type { TranslateSystemMessageItem } from '@/types';

export const useTranslataStore = defineStore(
  'translate-settings',
  () => {
    const translateSystemMessageList = ref<TranslateSystemMessageItem[]>([
      { ...TRANSLATE_SYSTEM_MESSAGE_ITEM_DEFAULT },
    ]);

    function setTranslateSystemMessageList(messageList: TranslateSystemMessageItem[]) {
      translateSystemMessageList.value = cloneDeep(messageList);
    }

    function getSystemMessage(character: string) {
      for (const item of translateSystemMessageList.value) {
        if (item.character === character) {
          return item.systemMessage;
        }
      }

      return translateSystemMessageList.value[0].systemMessage;
    }

    return {
      translateSystemMessageList,

      setTranslateSystemMessageList,
      getSystemMessage,
    };
  },
  {
    persist: true,
  },
);