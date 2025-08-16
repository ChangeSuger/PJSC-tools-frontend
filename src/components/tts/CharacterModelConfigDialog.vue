<template>
  <a-button type="text" @click="open">
    角色模型配置
  </a-button>

  <a-modal
    body-class="p-4!"
    modal-class="max-h-[95vh]"
    v-model:visible="visible"
    width="40%"
    title="角色模型配置"
    :footer="false"
  >
    <CharacterTabs>
      <a-tab-pane
        v-for="character of characters"
        :key="character"
        :title="character"
      >
        <a-form class="max-h-[calc(95vh-170px)] overflow-y-scroll" :model="characterModelConfigMap[character]" auto-label-width v-if="characterModelConfigMap[character]">
          <template v-for="emotion of EMOTION_CLASS" :key="`${character}-${emotion}`">
            <div class="flex items-center gap-2 pl-6">
              <EmotionTag :text="emotion" />

              <div class="flex-auto">
                <a-divider></a-divider>
              </div>
            </div>

            <a-form-item label="SoVITS 模型">
              <a-select
                v-model="characterModelConfigMap[character][emotion].sovitsModel"
                :options="ttsModelStore.getSovitsOptions"
                allow-search
                allow-clear
              />
            </a-form-item>

            <a-form-item label="GPT 模型">
              <a-select
                v-model="characterModelConfigMap[character][emotion].gptModel"
                :options="ttsModelStore.getGptOptions"
                allow-search
                allow-clear
              />
            </a-form-item>
          </template>
        </a-form>
        <a-button type="primary" @click="saveCharacterModelConfig(character)" long>保存配置</a-button>
      </a-tab-pane>
    </CharacterTabs>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTTSCharacterStore, useTTSModelStore } from '@/stores';
import { cloneDeep } from 'lodash-es';

import CharacterTabs from './CharacterTabs.vue';
import { Message } from '@arco-design/web-vue';
import { EMOTION_CLASS } from '@/datas';
import EmotionTag from '@/components/common/EmotionTag.vue';

const ttsCharacterStore = useTTSCharacterStore();
const ttsModelStore = useTTSModelStore();

const characterModelConfigMap = ref(cloneDeep(ttsCharacterStore.characterModelConfigMap));

const characters = computed(() => {
  return ttsCharacterStore.characters;
});

watch(
  () => characters.value,
  (newCharacters, preCharacters) => {
    if (newCharacters.length > preCharacters.length) {
      for (const character of newCharacters) {
        if (!preCharacters.includes(character)) {
          characterModelConfigMap.value[character] = cloneDeep(ttsCharacterStore.characterModelConfigMap[character]);
        }
      }
    } else {
      for (const character of preCharacters) {
        if (!newCharacters.includes(character)) {
          delete characterModelConfigMap.value[character];
        }
      }
    }
  }
)

const visible = ref(false);

function open() {
  characterModelConfigMap.value = cloneDeep(ttsCharacterStore.characterModelConfigMap);

  visible.value = true;
}

function saveCharacterModelConfig(character: string) {
  const config = characterModelConfigMap.value[character];

  ttsCharacterStore.setCharacterModelConfig(character, cloneDeep(config));

  Message.success('角色模型配置已保存~');
}
</script>
