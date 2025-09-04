import { reactive } from 'vue'

export const commentCache = reactive({})

export function addComment(photoId, comment) {
  if (!commentCache[photoId]) {
    commentCache[photoId] = []
  }
  commentCache[photoId].push(comment)
}

export function getComments(photoId) {
  return commentCache[photoId] || []
}
