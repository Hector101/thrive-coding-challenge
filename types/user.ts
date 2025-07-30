export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string
  registeredDate: string
}

export interface UserWithComputed extends User {
  fullName: string
  daysSinceRegistered: number
}

export interface TableState {
  users: User[]
  filteredUsers: UserWithComputed[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  sortConfig: {
    key: keyof UserWithComputed
    direction: "asc" | "desc"
  } | null
  columnOrder: string[]
  pagination: {
    page: number
    pageSize: number
    hasMore: boolean
    totalCount: number
  }
}
