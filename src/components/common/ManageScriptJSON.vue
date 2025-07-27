<template>
  <a-space>
    <a-form :model="form" layout="inline">
      <a-form-item label="剧本名" class="mb-0!">
        <a-input
          class="w-37.5!"
          v-model="form.scriptName"
          allow-clear
        />
      </a-form-item>

      <a-button-group>
        <a-button type="text" @click="importScriptJSON">
          导入剧本
        </a-button>

        <a-button type="text" @click="exportScriptJSON" :disabled="exportDisabled">
          导出剧本
        </a-button>
      </a-button-group>
    </a-form>
  </a-space>
</template>

<script setup lang="ts">
import type { StoryScriptFull } from '@/types';
import { ref, computed, type PropType } from 'vue';

defineExpose({
  getScriptName,
});

const form = ref({
  scriptName: '',
});

const props = defineProps({
  suffix: {
    type: String,
    default: '',
  },
  storyScript: {
    type: Object as PropType<StoryScriptFull>,
    required: true,
  },
  onFileLoad: {
    type: Function as PropType<(file: File) => void>,
    required: false,
    default: () => {},
  },
  preprocessStoryScript: {
    type: Function as PropType<(storyScript: StoryScriptFull) => StoryScriptFull>,
    default: (storyScript: StoryScriptFull) => storyScript,
  },
  onReaderLoad: {
    type: Function as PropType<(reader: FileReader) => void>,
    required: true,
  },
});

const exportDisabled = computed(() => props.storyScript?.length === 0);

function importScriptJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      form.value.scriptName = file.name.split('.')[0];

      props.onFileLoad(file);

      const reader = new FileReader();

      reader.onload = () => {
        props.onReaderLoad(reader);
      }

      reader.readAsText(file);
    }
  }
  input.click();
}

function exportScriptJSON() {
  const { storyScript, suffix } = props;
  const filename = form.value.scriptName;
  const storyScriptData = props.preprocessStoryScript(storyScript);

  const json = JSON.stringify(storyScriptData);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.download = suffix
    ? `${filename}.${suffix}.json`
    : `${filename}.json`;

  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function getScriptName() {
  return form.value.scriptName;
}
</script>
