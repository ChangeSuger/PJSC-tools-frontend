<template>
  <a-button type="text" @click="open">
    参考音频配置
  </a-button>

  <a-modal
    modal-class="h-[95vh]"
    v-model:visible="visible"
    width="80%"
    title="参考音频设置"
    :footer="false"
  >
    <CharacterTabs>
      <a-tab-pane
        v-for="character of characters"
        :key="character"
        :title="character"
      >
        <div class="max-h-[calc(95vh-150px)] flex flex-col gap-2 overflow-y-scroll">
          <ExampleAudioItem
            v-for="characterEmotion of generateCharacterEmotionList(character)"
            :key="`${characterEmotion.character}-${characterEmotion.emotion}`"
            :id="`${characterEmotion.character}-${characterEmotion.emotion}`"
            :emotion="characterEmotion.emotion"
          />
        </div>
      </a-tab-pane>
    </CharacterTabs>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';
import { EMOTIONS } from '@/datas';

import ExampleAudioItem from '@/components/tts/exampleAudio/ExampleAudioItem.vue';
import CharacterTabs from '@/components/tts/CharacterTabs.vue';

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
