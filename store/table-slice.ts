import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User, UserWithComputed, TableState } from "../types/user";
import { apiClient } from "../api/apiClient";

const initialState: TableState = {
  users: [],
  filteredUsers: [],
  loading: false,
  loadingMore: false,
  error: null,
  sortConfig: null,
  columnOrder: [
    "id",
    "firstName",
    "lastName",
    "fullName",
    "email",
    "city",
    "registeredDate",
    "daysSinceRegistered",
  ],
  pagination: {
    page: 0,
    pageSize: 100,
    hasMore: true,
    totalCount: 0,
  },
};

export const fetchUsers = createAsyncThunk(
  "table/fetchUsers",
  async (page: number) => {
    try {
      const response = await apiClient.getUsers(page, 100);
      return { ...response, page };
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }
);

export const loadMoreUsers = createAsyncThunk(
  "table/loadMoreUsers",
  async (_, { getState }) => {
    try {
      const state = getState() as { table: TableState };
      const nextPage = state.table.pagination.page + 1;
      const response = await apiClient.getUsers(nextPage, 100);
      return { ...response, page: nextPage };
    } catch (error) {
      throw new Error("Failed to load more users");
    }
  }
);

const computeUserFields = (user: User): UserWithComputed => {
  const registeredDate = new Date(user.registeredDate);
  const today = new Date();
  const daysSinceRegistered = Math.floor(
    (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    daysSinceRegistered,
  };
};

const sortUsers = (
  users: UserWithComputed[],
  sortConfig: TableState["sortConfig"]
): UserWithComputed[] => {
  if (!sortConfig || !users || users.length === 0) return users;

  return [...users].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setSortConfig: (
      state,
      action: PayloadAction<{
        key: keyof UserWithComputed;
        direction: "asc" | "desc";
      }>
    ) => {
      state.sortConfig = action.payload;
      state.filteredUsers = sortUsers(state.filteredUsers, state.sortConfig);
    },
    setColumnOrder: (state, action: PayloadAction<string[]>) => {
      state.columnOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    rehydrateUsers: (state) => {
      if (state.users && state.users.length > 0) {
        const computedUsers = state.users.map(computeUserFields);
        state.filteredUsers = sortUsers(computedUsers, state.sortConfig);
      }
    },
    resetPagination: (state) => {
      state.users = [];
      state.filteredUsers = [];
      state.pagination = {
        page: 0,
        pageSize: 100,
        hasMore: true,
        totalCount: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.pagination = {
          page: action.payload.page,
          pageSize: 100,
          hasMore: action.payload.hasMore,
          totalCount: action.payload.totalCount,
        };
        const computedUsers = (action.payload.users || []).map(
          computeUserFields
        );
        state.filteredUsers = sortUsers(computedUsers, state.sortConfig);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(loadMoreUsers.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreUsers.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.users = [...state.users, ...(action.payload.users || [])];
        state.pagination = {
          page: action.payload.page,
          pageSize: 100,
          hasMore: action.payload.hasMore,
          totalCount: action.payload.totalCount,
        };
        const allComputedUsers = state.users.map(computeUserFields);
        state.filteredUsers = sortUsers(allComputedUsers, state.sortConfig);
      })
      .addCase(loadMoreUsers.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || "Failed to load more users";
      });
  },
});

export const {
  setSortConfig,
  setColumnOrder,
  clearError,
  rehydrateUsers,
  resetPagination,
} = tableSlice.actions;
export default tableSlice.reducer;
