<script setup>
import { onMounted, ref } from 'vue'
import SearchForm from './components/SearchForm.vue'
import unsplash from './utils/api'

const photos = ref([])

async function searchImages(query) {
  console.log(query)
  try {
    const res = await unsplash.get('/search/photos', {
      params: { query, per_page: 6 },
    })
    photos.value = res.data.results
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
  }
}

onMounted(() => {
  getRandomPhotos(12)
})

async function getRandomPhotos(count) {
  try {
    const res = await unsplash.get('/photos/random', { params: { count } })
    photos.value = res.data
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
  }
}
</script>

<template>
  <div>
    <SearchForm @onSearch="searchImages" />

    <div class="images">
      <img
        v-for="photo in photos"
        :key="photo.id"
        :src="photo.urls.small"
        :alt="photo.alt_description"
      />
    </div>
  </div>
</template>

<style scoped>
.images {
  column-count: 3; /* numero di colonne */
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
