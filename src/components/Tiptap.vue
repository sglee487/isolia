<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <editor-content :editor="editor" class="element" />
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

const editor = new Editor({
  extensions: [
    StarterKit,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose outline outline-2 outline-offset-2 rounded-md min-h-[50vh]'
    },
  },

})
</script>
