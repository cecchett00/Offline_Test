<script setup>
import { ref } from 'vue'

const query = ref('')
const emit = defineEmits(['onSearch'])

function handleSubmit() {
  if (query.value.trim()) {
    emit('onSearch', query.value.trim())
    query.value = ''
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="search-form">
    <div class="input-wrapper">
      <input v-model="query" type="text" placeholder="Cerca immagini..." class="search-input" />
      <button type="submit" class="search-btn">🔍</button>
    </div>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 14px;
  border: 2px solid #9d9d9d;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #b2fc02;
  box-shadow: 0 0 5px rgba(178, 252, 2, 0.3);
}

.search-btn {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border: none;
  background-color: white;
  padding: 0 16px;
  border: 2px solid #9d9d9d;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.search-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 500px) {
  .search-form {
    padding: 0 10px;
  }

  .search-input {
    padding-right: 45px;
  }

  .search-btn {
    padding: 0 12px;
  }
}
</style>
