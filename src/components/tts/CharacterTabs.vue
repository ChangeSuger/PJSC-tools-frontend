<template>
  <a-tabs
    v-model:active-key="activeName"
    editable
    @delete="checkDeleteCharacter"
  >
    <template #extra>
      <AddCharacterDialog />
    </template>

    <slot></slot>
  </a-tabs>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';

import { Modal } from '@arco-design/web-vue';
import AddCharacterDialog from '@/components/tts/AddCharacterDialog.vue';

const ttsCharacterStore = useTTSCharacterStore();

const characters = computed(() => {
  return ttsCharacterStore.characters;
});

const activeName = ref(characters.value[0]);

function checkDeleteCharacter(character: string) {
  Modal.confirm({
    title: '删除确认',
    content: '确认删除该角色？',
    okText: '删除',
    cancelText: '取消',
    onOk: () => {
      removeCharacter(character);
    }
  });
}

function removeCharacter(character: string) {
  const newCharacters = characters.value.filter((chara => {
    return chara !== character;
  }));
  ttsCharacterStore.setCharacters(newCharacters);
  if (character === activeName.value) {
    activeName.value = characters.value[0];
  }
}
</script>
