<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPage: { type: Number, required: false },
})

const pagesToShow = computed(() => {
  const pages = []

  // Prima pagina
  pages.push({ number: 1, label: '1', key: 1 })

  if (props.totalPage) {
    if (props.totalPage <= 5) {
      for (let i = 2; i <= props.totalPage; i++) {
        pages.push({ number: i, label: String(i), key: i })
      }
    } else {
      let start = Math.max(2, props.currentPage - 1)
      let end = Math.min(props.totalPage - 1, start + 2)
      start = Math.max(2, end - 2)

      for (let i = start; i <= end; i++) {
        pages.push({ number: i, label: String(i), key: i })
      }
      pages.push({ number: props.totalPage, label: String(props.totalPage), key: props.totalPage })
    }
  } else {
    let start = Math.max(2, props.currentPage - 1)
    const end = start + 2
    for (let i = start; i <= end; i++) {
      pages.push({ number: i, label: String(i), key: i })
    }
    pages.push({ number: end + 1, label: '…', key: 'next', placeholder: true })
  }

  return pages
})
</script>

<template>
  <div class="pager-container">
    <div class="pager">
      <button @click="$emit('prev')" :disabled="currentPage <= 1" class="pager-btn">◀</button>

      <div class="page-boxes">
        <span
          v-for="page in pagesToShow"
          :key="page.key"
          @click="!page.placeholder && $emit('go', page.number)"
          :class="[
            'page-box',
            { active: page.number === currentPage, placeholder: page.placeholder },
          ]"
        >
          {{ page.label }}
        </span>
      </div>

      <button
        @click="$emit('next')"
        :disabled="totalPage ? currentPage >= totalPage : false"
        class="pager-btn"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<style scoped>
.pager {
  position: fixed;
  right: 10px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 10px 0px;
  font-family: 'Roboto', sans-serif;
  background-color: transparent;
}

.pager-btn {
  padding: 8px 16px;
  border: 2px solid #9d9d9d;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pager-btn:hover:not(:disabled) {
  border-color: #b2fc02;
}

.page-boxes {
  display: flex;
  gap: 6px;
}

.page-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: 2px solid #9d9d9d;
  background: #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
  user-select: none;
}

.page-box.active {
  background: #f0f0f0;
  border-color: #b2fc02;
  color: black;
  font-weight: bold;
}

.page-box.placeholder {
  cursor: default;
  opacity: 0.5;
}

.page-box:hover:not(.active):not(.placeholder) {
  border-color: #b2fc02;
  background: #f0f0f0;
}
</style>
