<template>
  <a-button type="text" @click="open">
    角色参数配置
  </a-button>

  <a-modal
    body-class="p-4!"
    v-model:visible="visible"
    width="40%"
    title="角色音频生成参数设置"
    :footer="false"
  >
    <CharacterTabs>
      <a-tab-pane
        v-for="(character, index) of characters"
        :key="character"
        :title="character"
      >
        <TTSCharacterConfigForm
          :ttsCharacterConfig="ttsCharacterConfigMap[character]"
          :ref="`ttsCharacterConfigFormRefs`"
        />
        <a-button type="primary" long @click="saveTTSCharacterConfig(character, index)">保存配置</a-button>
      </a-tab-pane>
    </CharacterTabs>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import { cloneDeep } from 'lodash-es';

import CharacterTabs from './CharacterTabs.vue';
import TTSCharacterConfigForm from './TTSCharacterConfigForm.vue';

const ttsCharacterStore = useTTSCharacterStore();

const ttsCharacterConfigFormRefs = ref<InstanceType<typeof TTSCharacterConfigForm>[]>([]);

const characters = computed(() => {
  return ttsCharacterStore.characters;
});

const ttsCharacterConfigMap = ref(cloneDeep(ttsCharacterStore.ttsCharacterConfigMap));

const visible = ref(false);

function open() {
  ttsCharacterConfigMap.value = cloneDeep(ttsCharacterStore.ttsCharacterConfigMap);

  visible.value = true;
}

function saveTTSCharacterConfig(character: string, index: number) {
  const config = ttsCharacterConfigFormRefs.value[index].getTTSCharacterConfig();

  ttsCharacterStore.setTTSCharacterConfig(character, {
    ...config
  });
}
</script>
