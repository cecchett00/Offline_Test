<script setup>
import { addComment } from '@/utils/commentCache'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'

const props = defineProps({
  photoId: { type: String, required: true },
})
const emits = defineEmits(['commentDone'])

const comment = ref('')

function saveComment() {
  if (comment.value !== '') {
    addComment(props.photoId, comment.value)
    comment.value = ''
    emits('commentDone')
  }
}
</script>

<template>
  <div class="actions">
    <input
      v-model="comment"
      type="text"
      placeholder="Scrivi un commento..."
      @keyup.enter="saveComment"
    />

    <button @click="saveComment" title="Invia commento">
      <font-awesome-icon :icon="faPaperPlane" class="icon" />
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  margin-top: 12px;
  width: 100%;
  gap: 8px;
}

.actions input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #9d9d9d;
  background: #222;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.actions input:focus {
  outline: none;
  border-color: #b2fc02;
}

.actions button {
  padding: 8px 12px;
  border: none;
  background: #b2fc02;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}

.actions button:hover {
  background: #9de202;
}

.icon {
  font-size: 1rem;
}
</style>
