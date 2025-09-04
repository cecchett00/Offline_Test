<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  photos: { type: Array, required: true },
})

onMounted(() => {
  console.log(props.photos)
})
</script>

<template>
  <div class="images">
    <img
      v-for="photo in props.photos"
      :key="photo.id"
      :src="photo.urls.small"
      :alt="photo.alt_description"
    />
  </div>
</template>

<style scoped>
.images {
  column-count: 3;
  column-gap: 12px;
  margin-top: 20px;
}

.images img {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 10px;
  display: block;
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
