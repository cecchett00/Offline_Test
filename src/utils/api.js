import axios from 'axios'

const api_url = import.meta.env.VITE_UNSPLASH_API_URL
const api_key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

const unsplashApi = axios.create({
  baseURL: api_url,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Client-ID ${api_key}`,
  },
})

export async function getRandomImgs(count) {
  const res = await unsplashApi.get('/photos/random', { params: { count } })
  return res
}

export async function getKeywordImgs(query, page, perpage) {
  const res = await unsplashApi.get('/search/photos', {
    params: { query: query, page: page, per_page: perpage },
  })
  return res
}
