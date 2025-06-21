<template>
  <el-dialog
    v-model="visible"
    append-to-body
    center
    width="40%"
    title="新增角色"
  >
    <el-form v-model="addCharacterForm">
      <el-form-item label="角色名">
        <el-input v-model="addCharacterForm.name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" plain @click="addCharacter">确定</el-button>
      <el-button type="info" plain @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useTTSCharacterStore } from '@/stores';
import { ref } from 'vue';

defineExpose({
  open,
});

const ttsCharacterStore = useTTSCharacterStore();

const visible = ref(false);

const characters = ref<string[]>([ ...ttsCharacterStore.characters ]);

const addCharacterForm = ref({
  name: ''
});

function open() {
  addCharacterForm.value.name = '';
  
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
