<template>
  <el-button type="primary" text :icon="Setting" @click="open">
    角色参数配置
  </el-button>

  <el-dialog
    class="tts-character-config-dialog"
    v-model="visible"
    append-to-body
    center
    width="40%"
    title="角色音频生成参数设置"
  >
    <CharacterTabs>
      <el-tab-pane
        class="flex flex-col gap-2"
        v-for="(character, index) of characters"
        :key="character"
        :label="character"
        :name="character"
      >
        <TTSCharacterConfigForm
          :ttsCharacterConfig="ttsCharacterConfigMap[character]"
          :ref="`ttsCharacterConfigFormRefs`"
        />
        <el-button @click="saveTTSCharacterConfig(character, index)">保存配置</el-button>
      </el-tab-pane>
    </CharacterTabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import { cloneDeep } from 'lodash-es';

import CharacterTabs from './CharacterTabs.vue';
import TTSCharacterConfigForm from './TTSCharacterConfigForm.vue';
import { Setting } from '@element-plus/icons-vue';

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
