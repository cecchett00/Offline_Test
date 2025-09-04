<script setup>
import { ref } from 'vue'
import ImgDetail from './ImgDetail.vue'

const props = defineProps({
  photos: { type: Array, required: true },
})

const modalOpen = ref(false)
const selectedPhoto = ref()

function openModal(photo) {
  selectedPhoto.value = photo
  modalOpen.value = true
}

function onSavePhoto(photo) {
  console.log('Salvata foto:', photo)
}

function onSaveComment({ photo, comment }) {
  console.log('Commento per', photo.id, ':', comment)
}
</script>

<template>
  <div class="images">
    <img
      v-for="photo in props.photos"
      :key="photo.id"
      :src="photo.urls.small"
      :alt="photo.alt_description"
      @click="openModal(photo)"
      loading="lazy"
      class="fade-in-img"
    />
  </div>

  <ImgDetail
    :photo="selectedPhoto"
    :isOpen="modalOpen"
    @close="modalOpen = false"
    @savePhoto="onSavePhoto"
    @saveComment="onSaveComment"
  />
</template>

<style scoped>
.images {
  column-count: 3;
  column-gap: 12px;
  margin-top: 20px;
}

.fade-in-img {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 10px;
  display: block;
  animation: fadeInSlow 0.7s ease-in-out;
}

@keyframes fadeInSlow {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 900px) {
  .images {
    column-count: 2;
  }
}
@media (max-width: 600px) {
  .images {
    column-count: 2;
  }
}
</style>
