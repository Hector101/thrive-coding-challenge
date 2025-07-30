# Advanced Data Table

A high-performance React data table built with Next.js, featuring virtualization, infinite scrolling pagination, column sorting, drag-and-drop reordering, and localStorage persistence.

## Features

### 🚀 Performance
- **Virtualization**: Handles large datasets efficiently using `react-window`
- **Infinite Scrolling**: Loads data in chunks of 100 records as you scroll
- **Optimized Rendering**: Only renders visible rows for smooth performance

### 📊 Data Management
- **Pagination API**: RESTful pagination with 100 records per page
- **Local Sorting**: Sort by any column on currently loaded data
- **Computed Fields**: Automatically calculates full names and days since registration
- **Persistent State**: Saves table state to localStorage

### 🎨 User Experience
- **Drag & Drop**: Reorder columns by dragging column headers
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Clear indicators for initial load and pagination
- **Error Handling**: Graceful error states with retry functionality

### 🛠 Technical Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **TanStack Table** for table functionality
- **DND Kit** for drag and drop
- **Tailwind CSS** for styling
- **Faker.js** for mock data generation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone or download the project
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   └── VirtualizedTable.tsx # Main table component
├── store/
│   ├── store.ts             # Redux store configuration
│   ├── tableSlice.ts        # Table state management
│   └── localStorageMiddleware.ts # Persistence middleware
├── hooks/
│   ├── useAppDispatch.ts    # Typed dispatch hook
│   └── useAppSelector.ts    # Typed selector hook
├── api/
│   └── apiClient.ts         # Mock API client
├── types/
│   └── user.ts              # TypeScript interfaces
└── lib/
    └── utils.ts             # Utility functions
```

## API Design

The table uses a paginated API structure:

```typescript
// API Response
interface ApiResponse {
  users: User[]
  totalCount: number
  hasMore: boolean
}

// Usage
const response = await apiClient.getUsers(page, pageSize)
```

### Endpoints
- `getUsers(page, pageSize)` - Fetch paginated user data

## State Management

The application uses Redux Toolkit with the following state structure:

```typescript
interface TableState {
  users: User[]
  filteredUsers: UserWithComputed[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  sortConfig: SortConfig | null
  columnOrder: string[]  
  pagination: {
    page: number
    pageSize: number
    hasMore: boolean
    totalCount: number
  }
}
```

## Key Components

### VirtualizedTable
The main table component that handles:
- Data rendering with virtualization
- Infinite scroll detection
- Column sorting and reordering
- Loading states and error handling

### Table Row Component
Individual row renderer that:
- Triggers pagination when near the end
- Displays loading indicators
- Handles cell rendering

### SortableHeader
Draggable column headers with:
- Drag and drop functionality
- Sort indicators
- Click-to-sort behavior

## Data Flow

1. **Initial Load**: Component mounts → Rehydrate from localStorage → Fetch first 100 records
2. **Infinite Scroll**: User scrolls → Detect scroll position → Load next 100 records → Append to existing data
3. **Sorting**: User clicks column → Sort current dataset → Update display
4. **Persistence**: Any state change → Save to localStorage → Restore on reload

## Performance Optimizations

- **Virtualization**: Only renders visible rows (typically 10-15 rows)
- **Memoization**: Uses `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Debounced Loading**: Prevents multiple simultaneous API calls
- **Efficient Updates**: Redux state updates are optimized for minimal re-renders

## Customization

### Adding New Columns
1. Update the `User` interface in `types/user.ts`
2. Add column definition in `virtualized-table.tsx`
3. Update the `columnOrder` array

### Modifying API
Update `api/apiClient.ts` to connect to your real API:

```typescript
async getUsers(page = 1, pageSize = 100) {
  const response = await fetch(`/api/users?page=\${page}&limit=\${pageSize}`)
  return response.json()
}
```

**Table not loading data:**
- Check browser console for errors
- Verify API client is working
- Clear localStorage and refresh

## License

This project is open source and available under the [MIT License](LICENSE).

---