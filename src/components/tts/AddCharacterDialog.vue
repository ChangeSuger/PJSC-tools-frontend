<template>
  <a-button @click="open">
    新增角色
  </a-button>

  <a-modal
    v-model:visible="visible"
    width="500px"
    title="新增角色"
  >
    <a-form :model="addCharacterForm" auto-label-width>
      <a-form-item label="角色名" class="mb-0!">
        <a-input v-model="addCharacterForm.name" allow-clear />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button type="primary" plain @click="addCharacter">确定</a-button>
      <a-button plain @click="close">取消</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { useTTSCharacterStore } from '@/stores';
import { ref } from 'vue';

const ttsCharacterStore = useTTSCharacterStore();

const visible = ref(false);

const characters = ref<string[]>([ ...ttsCharacterStore.characters ]);

const addCharacterForm = ref({
  name: ''
});

function open() {
  addCharacterForm.value.name = '';
  characters.value = [ ...ttsCharacterStore.characters ];

  visible.value = true;
}

function close() {
  visible.value = false;
}

function addCharacter() {
  const newCharacterName = addCharacterForm.value.name;

  if (newCharacterName && !characters.value.includes(newCharacterName)) {
    characters.value.push(newCharacterName);

    ttsCharacterStore.setCharacters(characters.value);

    addCharacterForm.value.name = '';
  }

  close();
}
</script>
