<script setup>
import { onMounted, ref, reactive } from 'vue'
import SearchForm from './components/SearchForm.vue'
import { getKeywordImgs, getRandomImgs } from './utils/api'
import Pager from './components/Pager.vue'
import ImageDisplayer from './components/ImageDisplayer.vue'

const photos = ref([])
const currentPage = ref(1)
const totalPage = ref()
const keyword = ref()

const MAX_PAGE_KEYWORD_CACHE = 5

const photoCache = reactive({})
const cacheOrder = []

function addToCache(key, data) {
  if (!photoCache[key]) {
    photoCache[key] = data
    cacheOrder.push(key)
  }

  const keysForThisKeyword = cacheOrder.filter((k) => k.startsWith(key.split('|')[0]))
  if (keysForThisKeyword.length > MAX_PAGE_KEYWORD_CACHE) {
    const oldestKey = keysForThisKeyword[0]
    delete photoCache(oldestKey)
    const index = cacheOrder.indexOf(oldestKey)
    if (index > -1) cacheOrder.splice(index, 1)
  }
}

async function fetchPhotos() {
  try {
    const cacheKey =
      keyword.value !== '' ? `${keyword.value}|${currentPage.value}` : `random|${currentPage.value}`

    // Se cache esiste, la uso
    if (photoCache[cacheKey]) {
      photos.value = photoCache[cacheKey]
      return
    }

    if (keyword.value) {
      // Fetch per keyword
      const res = await getKeywordImgs(keyword.value, currentPage.value, 12)

      console.log(res)
      photos.value = res.data.results

      totalPage.value = res.data.total_pages

      addToCache(cacheKey, res.data.results)
    } else {
      // Fetch random
      const res = await getRandomImgs(12)

      const fetchedPhotos = Array.isArray(res.data) ? res.data : [res.data]

      photos.value = fetchedPhotos
      totalPage.value = null

      addToCache(cacheKey, fetchedPhotos)
    }
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
  }
}

async function searchImages(query) {
  console.log(query)
  keyword.value = query
  currentPage.value = 1
  fetchPhotos()
}

onMounted(() => {
  fetchPhotos()
})

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPhotos()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (!totalPage.value || currentPage.value < totalPage.value) {
    currentPage.value++
    fetchPhotos()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchPhotos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
