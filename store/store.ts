import { configureStore } from "@reduxjs/toolkit"
import tableReducer from "./table-slice"
import { localStorageMiddleware, loadStateFromStorage } from "./local-storage-middleware"

const getPreloadedState = () => {
  try {
    const persistedState = loadStateFromStorage()
    if (persistedState && persistedState.table) {
      return persistedState
    }
  } catch (error) {
    console.warn("Failed to load persisted state:", error)
  }
  return undefined
}

export const store = configureStore({
  reducer: {
    table: tableReducer,
  },
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["table/fetchUsers/pending", "table/fetchUsers/fulfilled"],
      },
    }).concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
