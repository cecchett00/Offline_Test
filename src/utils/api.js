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

export default unsplashApi
