# User Info Dashboard

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

## License

This project is open source and available under the [MIT License](LICENSE).

---