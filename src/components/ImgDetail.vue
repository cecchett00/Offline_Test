<script setup>
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { defineProps, defineEmits, ref } from 'vue'
import { getComments } from '@/utils/commentCache'
import CommentMaker from './CommentMaker.vue'

const props = defineProps({
  photo: { type: Object, required: true },
  isOpen: { type: Boolean, default: false },
})

const emits = defineEmits(['close', 'saveComment', 'savePhoto'])

function closeModal() {
  emits('close')
}

const comments = ref()

function fetchComments() {
  console.log(getComments(props.photo.id))
  comments.value = getComments(props.photo.id)
}

async function savePhoto() {
  try {
    const imageUrl = props.photo.urls.full

    // Scarico l'immagine come blob
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Creo un link temporaneo
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${props.photo.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Libero l’oggetto URL
    URL.revokeObjectURL(link.href)
  } catch (err) {
    console.error('Errore salvataggio immagine:', err)
  }
}
</script>

<template>
  <div>
    <div v-if="isOpen" class="overlay" @click.self="closeModal">
      <div class="modal">
        <img :src="photo.urls.regular" :alt="photo.alt_description" />

        <button @click="savePhoto" title="Salva foto" class="savePhoto">
          Salva immagine
          <font-awesome-icon :icon="faDownload" class="icon" />
        </button>
        <!-- <div class="commentContainer"> -->
        <CommentMaker :photo-id="props.photo.id" @comment-done="fetchComments" />
        <!-- </div> -->
        <button class="close-btn" @click="closeModal">✖</button>
        <div class="comments-list" v-if="getComments(photo.id).length">
          <div v-for="(c, index) in getComments(photo.id)" :key="index" class="comment-item">
            {{ c }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-list {
  margin-top: 12px;
  width: 100%;
  max-height: 100px;
  overflow: scroll;
}

.comment-item {
  background: #222;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 4px;
  color: white;
  font-size: 14px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #111;
  padding: 20px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Roboto', sans-serif;
}

.modal img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 8px;
  object-fit: contain;
}

.commentContainer {
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

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
}
.icon {
  font-size: 1rem;
}
.savePhoto {
  margin-top: 10px;
  padding: 8px 12px;
  width: 70%;
  border: none;
  background: #b2fc02;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}
</style>
