// Global event emitter for real-time updates
class EventEmitter extends EventTarget {
  emit(event: string, data?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail: data }))
  }
}

export const globalEvents = new EventEmitter()

// Event types
export const EVENTS = {
  SAVED_JOBS_UPDATED: 'saved-jobs-updated',
} as const