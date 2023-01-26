<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <editor-content :editor="editor" />
</template>

<script setup lang='ts'>
import { onBeforeUnmount, watch } from 'vue'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: String
  placeholder?: String
}>()

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, (value) => {
  const isSame = editor.getHTML() === value
  if (isSame) {
    return
  }

  editor.commands.setContent(value, false)
})

const editor = new Editor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder ?? ''
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose dark:prose-invert outline outline-1 outline-offset-2 outline-gray-500 rounded-md max-h-[40vh] text-gray-900 dark:text-gray-100 bg-zinc-50 dark:bg-zinc-800 py-1 px-2'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})

</script>

<style lang="scss">
.ProseMirror {
  >*+* {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  overflow-y: scroll;

  p {
    line-height: 1.1em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    // color: rgb(17, 24, 39);
  }
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
  font-size: 0.875rem;
}
</style>
