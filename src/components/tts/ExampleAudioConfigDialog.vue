<template>
  <el-button type="primary" text :icon="Setting" @click="open">
    参考音频配置
  </el-button>

  <el-dialog
    class="example-audio-config-dialog"
    v-model="visible"
    append-to-body
    center
    align-center
    width="80%"
    title="参考音频设置"
  >
    <CharacterTabs>
      <el-tab-pane
        v-for="character of characters"
        :key="character"
        :label="character"
        :name="character"
      >
        <ExampleAudioItem
          v-for="characterEmotion of generateCharacterEmotionList(character)"
          :key="`${characterEmotion.character}-${characterEmotion.emotion}`"
          :id="`${characterEmotion.character}-${characterEmotion.emotion}`"
          :emotion="characterEmotion.emotion"
        />
      </el-tab-pane>
    </CharacterTabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import { EMOTIONS } from '@/datas';

import ExampleAudioItem from '@/components/tts/ExampleAudioItem.vue';
import CharacterTabs from './CharacterTabs.vue';
import { Setting } from '@element-plus/icons-vue';

const ttsCharacterStore = useTTSCharacterStore();

const characters = computed(() => {
  return ttsCharacterStore.characters;
});

const visible = ref(false);

function open() {
  visible.value = true;
}

function generateCharacterEmotionList(character: string) {
  return EMOTIONS.map((emotion) => {
    return {
      emotion,
      character,
    };
  });
}
</script>

<style lang="scss">
.example-audio-config-dialog {
  height: 95vh;

  .el-tabs__new-tab {
    width: 90px;
    height: 32px;
    border: none;
  }

  .el-tabs__content {
    max-height: 78vh;
    overflow-y: scroll;

    .el-tab-pane {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>