<script setup>
import { onMounted, ref, reactive } from 'vue'
import SearchForm from './components/SearchForm.vue'
import { getKeywordImgs, getRandomImgs } from './utils/api'
import Pager from './components/Pager.vue'
import ImageDisplayer from './components/ImageDisplayer.vue'

const photos = ref([])
const currentPage = ref(1)
const keyword = ref('')

const MAX_PAGE_KEYWORD_CACHE = 5

const photoCache = reactive({})
const cacheOrder = []

function addToCache(key, data) {
  if (!photoCache[key]) {
    photoCache[key] = data
    cacheOrder.push(key)
  }

  const baseKey = key.split('|')[0]
  const keysForThisKeyword = cacheOrder.filter((k) => k.startsWith(baseKey))

  if (keysForThisKeyword.length > MAX_PAGE_KEYWORD_CACHE) {
    const oldestKey = keysForThisKeyword[0]
    delete photoCache[oldestKey]
    const index = cacheOrder.indexOf(oldestKey)
    if (index > -1) cacheOrder.splice(index, 1)
  }
}

async function fetchPhotos(page) {
  try {
    const cacheKey = keyword.value ? `${keyword.value}|${page}` : `random|${page}`

    // Usa cache se disponibile
    if (photoCache[cacheKey]) {
      photos.value = photoCache[cacheKey]
      currentPage.value = page
      return true
    }

    if (keyword.value) {
      const res = await getKeywordImgs(keyword.value, page, 12)
      if (!res.data.results || res.data.results.length === 0) return false

      photos.value = res.data.results
      currentPage.value = page
      addToCache(cacheKey, res.data.results)
    } else {
      const res = await getRandomImgs(12)
      const fetchedPhotos = Array.isArray(res.data) ? res.data : [res.data]
      if (fetchedPhotos.length === 0) return false

      photos.value = fetchedPhotos
      currentPage.value = page
      addToCache(cacheKey, fetchedPhotos)
    }

    return true
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
    return false
  }
}

async function searchImages(query) {
  keyword.value = query.trim()
  currentPage.value = 1
  await fetchPhotos(1)
}

onMounted(() => {
  fetchPhotos(1)
})

async function prevPage() {
  if (currentPage.value > 1) {
    await fetchPhotos(currentPage.value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function nextPage() {
  const ok = await fetchPhotos(currentPage.value + 1)
  if (!ok) console.log('Non ci sono più pagine da caricare')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function goToPage(page) {
  const ok = await fetchPhotos(page)
  if (!ok) console.log('Non ci sono più pagine da caricare')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <SearchForm @onSearch="searchImages" />
    <ImageDisplayer :photos="photos" />
  </div>

  <Pager :current-page="currentPage" @prev="prevPage" @next="nextPage" @go="goToPage" />
</template>
