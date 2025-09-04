<script setup>
import { onMounted, ref } from 'vue'
import SearchForm from './components/SearchForm.vue'
import { getKeywordImgs, getRandomImgs } from './utils/api'
import Pager from './components/Pager.vue'
import ImageDisplayer from './components/ImageDisplayer.vue'

const photos = ref([])
const currentPage = ref(1)
const totalPage = ref()
const keyword = ref()

async function searchImages(query) {
  console.log(query)
  keyword.value = query
  try {
    const res = await getKeywordImgs(query)
    console.log(res.data.total_pages)
    totalPage.value = res.data.total_pages
    photos.value = res.data.results
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
  }
}

async function getRandomPhotos(count) {
  try {
    const res = await getRandomImgs(count)
    photos.value = res.data
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
  }
}

onMounted(() => {
  getRandomPhotos(12)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (!totalPage.value || currentPage.value < totalPage.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  currentPage.value = page
}
</script>

<template>
  <div>
    <SearchForm @onSearch="searchImages" />
    <ImageDisplayer :photos="photos" />
  </div>
  <div>
    <Pager
      :current-page="currentPage"
      :total-page="totalPage"
      @prev="prevPage"
      @next="nextPage"
      @go="goToPage"
    />
  </div>
</template>

<style scoped></style>
