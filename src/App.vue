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

async function fetchPhotos(page) {
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

      if (res.data.results.length === 0) return false

      photos.value = res.data.results

      totalPage.value = res.data.total_pages

      addToCache(cacheKey, res.data.results)
    } else {
      // Fetch random
      const res = await getRandomImgs(12)
      if (res.data.length === 0) return false

      const fetchedPhotos = Array.isArray(res.data) ? res.data : [res.data]

      photos.value = fetchedPhotos
      currentPage.value = page
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
  fetchPhotos(1)
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
  if (!totalPage.value || currentPage.value < totalPage.value) {
    const ok = await fetchPhotos(currentPage.value + 1)
    if (!ok) console.log('non ci sono più pagine da caricare')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function goToPage(page) {
  const ok = await fetchPhotos(page)
  if (!ok) console.log('non ci sono più pagine da caricare')
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
