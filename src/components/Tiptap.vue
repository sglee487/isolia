<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-2">
    <div :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor" class="flex flex-row divide-x space-x-2">
      <div>
        <ImagePlusIcon class="inline-block cursor-pointer w-8 h-8" @click="uploadImageFiles"
          :class="{ 'is-active': editor.isActive('image') }" />
      </div>
      <div>
        <BoldIcon class="inline-block cursor-pointer w-8 h-8" @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }" />
        <ItalicIcon class="inline-block cursor-pointer w-8 h-8" @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }" />
        <Strikethrough2Icon class="inline-block cursor-pointer w-8 h-8"
          @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" />
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang='ts'>
import { onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

import { uploadImages } from '@/apis/board'
import BoldIcon from '@/icons/Bold.vue'
import ItalicIcon from '@/icons/Italic.vue'
import Strikethrough2Icon from '@/icons/Strikethrough2.vue'
import ImagePlusIcon from '@/icons/ImagePlus.vue'

const props = defineProps<{
  modelValue: String,
  user: Object
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
    Image
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose dark:prose-invert outline outline-1 outline-offset-2 outline-gray-500 rounded-md min-h-[50vh] text-gray-900 dark:text-gray-100 bg-zinc-50 dark:bg-zinc-800 p-2'
    }
  },
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})

const uploadImageFiles = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.click()

  input.onchange = async () => {
    const files = input.files

    if (!files) {
      return
    }

    uploadImages(props.user.data.token, files).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        editor.chain().focus().setImage({ src: res.data[i] }).run()
        editor.commands.setTextSelection(editor.state.selection.from + 1)
      }
    })
  }
}

</script>

<style lang="scss">
.ProseMirror {
  >*+* {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  p {
    line-height: 1.1em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    // color: rgb(17, 24, 39);
  }

  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid rgb(14 165 233);
    }
  }
}
</style>
