<template>
  <el-tabs
    class="
      [&_.el-tabs\_\_new-tab]:w-22.5!
      [&_.el-tabs\_\_new-tab]:h-8!
      [&_.el-tabs\_\_new-tab]:border-none!
    "
    v-model="activeName"
    type="card"
    editable
    @edit="handleTabEdit"
  >
    <template #add-icon>
      <el-button plain>新增角色</el-button>
    </template>

    <slot></slot>
  </el-tabs>

  <AddCharacterDialog ref="addCharacterDialogRef" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTTSCharacterStore } from '@/stores';

import { type TabPaneName, ElMessageBox } from 'element-plus';
import AddCharacterDialog from '@/components/tts/AddCharacterDialog.vue';

const ttsCharacterStore = useTTSCharacterStore();

const addCharacterDialogRef = ref<InstanceType<typeof AddCharacterDialog>>();

const characters = computed(() => {
  return ttsCharacterStore.characters;
});

const activeName = ref(characters.value[0]);

function handleTabEdit(
  targetName: TabPaneName | undefined,
  action: 'remove' | 'add'
) {
  if (action === 'add') {
    addCharacterDialogRef.value?.open();
  } else if (action === 'remove') {
    ElMessageBox.confirm(
      '确认删除该角色？',
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      removeCharacter(targetName as string);
    });
  }
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
