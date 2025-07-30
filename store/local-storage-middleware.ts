import type { Middleware } from "@reduxjs/toolkit"
import type { RootState } from "./store"

const STORAGE_KEY = "_user_data_cache"

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)

  if (typeof window !== "undefined") {
    try {
      const state = store.getState() as RootState
      if (state.table) {
        const serializedState = JSON.stringify({
          table: {
            users: state.table.users || [],
            columnOrder: state.table.columnOrder || [],
            sortConfig: state.table.sortConfig || null,
          },
        })
        localStorage.setItem(STORAGE_KEY, serializedState)
      }
    } catch (error) {
      console.warn("Failed to save state to localStorage:", error)
    }
  }

  return result
}

export const loadStateFromStorage = () => {
  if (typeof window === "undefined") {
    return undefined
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState === null) {
      return undefined
    }
    const parsed = JSON.parse(serializedState)

    if (parsed && parsed.table && Array.isArray(parsed.table.users)) {
      return parsed
    }
    return undefined
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error)
    return undefined
  }
}
