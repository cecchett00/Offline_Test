<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, reactive, watch } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import { getKeywordImgs } from '../utils/api'
import Pager from '../components/Pager.vue'
import ImageDisplayer from '../components/ImageDisplayer.vue'
import { useRoute, useRouter } from 'vue-router'

const photos = ref([])
const currentPage = ref(1)
const keyword = ref('')

const MAX_PAGE_KEYWORD_CACHE = 5

const router = useRouter()
const route = useRoute()

const photoCache = reactive({})
const cacheOrder = []
const randomWords = [
  'nature',
  'city',
  'ocean',
  'mountains',
  'forest',
  'animals',
  'technology',
  'art',
  'space',
  'flowers',
]

function getRandomWord() {
  const index = Math.floor(Math.random() * randomWords.length)
  return randomWords[index]
}

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

async function fetchPhotos(page, kw) {
  try {
    if (!kw) kw = getRandomWord()
    const cacheKey = `${kw}|${page}`

    if (photoCache[cacheKey]) {
      photos.value = photoCache[cacheKey]
      currentPage.value = page
      keyword.value = kw
      return true
    }

    const res = await getKeywordImgs(kw, page, 12)
    if (!res.data.results || res.data.results.length === 0) return false

    photos.value = res.data.results
    currentPage.value = page
    keyword.value = kw
    addToCache(cacheKey, res.data.results)

    return true
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
    return false
  }
}

async function searchImages(query) {
  const kw = query.trim() || getRandomWord()
  router.push({ name: 'Search', params: { keyword: kw, page: 1 } })
  await fetchPhotos(1, kw)
}

watch(
  () => [route.params.keyword, route.params.page],
  ([kw, page]) => {
    const resolvedKeyword = kw || getRandomWord()
    const resolvedPage = parseInt(page) || 1

    keyword.value = resolvedKeyword
    currentPage.value = resolvedPage

    fetchPhotos(resolvedPage, resolvedKeyword)
  },
  { immediate: true },
)

async function prevPage() {
  if (currentPage.value > 1) {
    const page = currentPage.value - 1
    router.push({ name: 'Search', params: { keyword: keyword.value, page } })
    await fetchPhotos(page, keyword.value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function nextPage() {
  const page = currentPage.value + 1
  router.push({ name: 'Search', params: { keyword: keyword.value, page } })
  const ok = await fetchPhotos(page, keyword.value)
  if (!ok) console.log('Non ci sono più pagine da caricare')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function goToPage(page) {
  router.push({ name: 'Search', params: { keyword: keyword.value, page } })
  const ok = await fetchPhotos(page, keyword.value)
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
