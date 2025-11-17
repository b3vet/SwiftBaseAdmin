# SwiftBase Admin UI - Implementation Plan

## Overview

This document outlines the implementation plan for the Svelte 5-based admin UI for SwiftBase. The UI will be a modern, reactive single-page application that provides complete administrative control over the SwiftBase backend.

**Technology Stack:**
- Svelte 5 (runes-based reactivity)
- Vite 5+ (build tool)
- TypeScript
- TailwindCSS (styling)
- Monaco Editor (query explorer)
- WebSocket client (realtime features)

**Project Location:** `/AdminUI/`

**Build Output:** `/Sources/SwiftBase/Resources/Public/`

---

## Project Structure

```
AdminUI/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.ts
│   ├── App.svelte
│   ├── routes/
│   │   ├── Login.svelte
│   │   ├── Dashboard.svelte
│   │   ├── Collections.svelte
│   │   ├── CollectionDetail.svelte
│   │   ├── Documents.svelte
│   │   ├── DocumentEditor.svelte
│   │   ├── QueryExplorer.svelte
│   │   ├── Users.svelte
│   │   ├── Files.svelte
│   │   ├── Realtime.svelte
│   │   ├── APITester.svelte
│   │   └── Settings.svelte
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   └── Layout.svelte
│   │   ├── common/
│   │   │   ├── Button.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── Table.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Badge.svelte
│   │   │   ├── Alert.svelte
│   │   │   └── Spinner.svelte
│   │   ├── collections/
│   │   │   ├── CollectionList.svelte
│   │   │   ├── CollectionForm.svelte
│   │   │   └── CollectionStats.svelte
│   │   ├── documents/
│   │   │   ├── DocumentList.svelte
│   │   │   ├── DocumentForm.svelte
│   │   │   └── JSONEditor.svelte
│   │   ├── query/
│   │   │   ├── QueryEditor.svelte
│   │   │   ├── QueryResults.svelte
│   │   │   └── SavedQueries.svelte
│   │   └── users/
│   │       ├── UserList.svelte
│   │       └── UserForm.svelte
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── collections.ts
│   │   │   ├── query.ts
│   │   │   ├── users.ts
│   │   │   ├── files.ts
│   │   │   └── realtime.ts
│   │   ├── stores/
│   │   │   ├── auth.svelte.ts
│   │   │   ├── collections.svelte.ts
│   │   │   ├── theme.svelte.ts
│   │   │   └── notifications.svelte.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── collection.ts
│   │   │   ├── document.ts
│   │   │   ├── query.ts
│   │   │   └── user.ts
│   │   └── utils/
│   │       ├── format.ts
│   │       ├── validation.ts
│   │       └── storage.ts
│   └── assets/
│       └── logo.svg
└── public/
    └── favicon.ico
```

---

## Implementation Phases

### Phase 1: Project Setup & Foundation (Day 1)

#### 1.1 Initialize Svelte 5 + Vite Project
- [ ] Create AdminUI directory
- [ ] Initialize pnpm project with `pnpm create vite@latest`
- [ ] Select Svelte + TypeScript template
- [ ] Install core dependencies
- [ ] Configure TypeScript for strict mode
- [ ] Set up path aliases

**Dependencies:**
```json
{
  "dependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

#### 1.2 Configure TailwindCSS
- [ ] Install Tailwind and its dependencies
- [ ] Create tailwind.config.js with SwiftBase theme
- [ ] Create postcss.config.js
- [ ] Add Tailwind directives to main CSS file
- [ ] Configure custom color palette

**Color Scheme:**
- Primary: Blue (#3B82F6)
- Secondary: Slate (#64748B)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Dark: Slate 900 (#0F172A)

#### 1.3 Configure Build System
- [ ] Update vite.config.ts for production build
- [ ] Set output directory to `../Sources/SwiftBase/Resources/Public`
- [ ] Configure base path for embedded serving
- [ ] Add build optimization settings
- [ ] Configure asset handling

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  base: '/admin/',
  build: {
    outDir: '../Sources/SwiftBase/Resources/Public',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### 1.4 Create Type Definitions
- [ ] Define API request/response types
- [ ] Define Collection and Document types
- [ ] Define User and Auth types
- [ ] Define Query DSL types
- [ ] Define component prop types

---

### Phase 2: Core Infrastructure (Day 1-2)

#### 2.1 API Client Library
- [ ] Create base HTTP client with fetch wrapper
- [ ] Implement token management (access + refresh)
- [ ] Add automatic token refresh on 401
- [ ] Implement request/response interceptors
- [ ] Add error handling and retry logic
- [ ] Create typed API methods for all endpoints

**API Modules:**
- `auth.ts` - Login, register, logout, refresh, me
- `collections.ts` - CRUD for collections
- `query.ts` - Query execution, custom queries
- `users.ts` - User management
- `files.ts` - File upload/download
- `realtime.ts` - WebSocket client

#### 2.2 State Management with Svelte 5 Runes
- [ ] Create auth store (user, tokens, isAuthenticated)
- [ ] Create collections store (list, current, stats)
- [ ] Create theme store (dark mode, colors)
- [ ] Create notifications store (toasts, alerts)
- [ ] Implement reactive state using `$state()` rune
- [ ] Add computed values using `$derived()` rune
- [ ] Implement effects using `$effect()` rune

**Example Store Pattern:**
```typescript
// auth.svelte.ts
export const auth = (() => {
  let user = $state<User | null>(null)
  let accessToken = $state<string | null>(null)
  let refreshToken = $state<string | null>(null)

  const isAuthenticated = $derived(!!user && !!accessToken)

  async function login(username: string, password: string) { /* ... */ }
  async function logout() { /* ... */ }
  async function refreshAuth() { /* ... */ }

  return {
    get user() { return user },
    get accessToken() { return accessToken },
    get isAuthenticated() { return isAuthenticated },
    login,
    logout,
    refreshAuth
  }
})()
```

#### 2.3 Routing System
- [ ] Create simple hash-based router
- [ ] Implement route guards for authentication
- [ ] Add route parameter parsing
- [ ] Create navigation helpers
- [ ] Implement browser history management

**Routes:**
```typescript
{
  '/': Dashboard,
  '/login': Login,
  '/collections': Collections,
  '/collections/:id': CollectionDetail,
  '/collections/:id/documents': Documents,
  '/collections/:id/documents/:docId': DocumentEditor,
  '/query': QueryExplorer,
  '/users': Users,
  '/files': Files,
  '/realtime': Realtime,
  '/api-tester': APITester,
  '/settings': Settings
}
```

#### 2.4 Common Components
- [ ] Button (variants: primary, secondary, danger, ghost)
- [ ] Input (text, email, password, number, textarea)
- [ ] Modal (confirmation, form, custom)
- [ ] Table (sortable, paginated, filterable)
- [ ] Card (with header, body, footer)
- [ ] Badge (status indicators)
- [ ] Alert (success, warning, error, info)
- [ ] Spinner (loading states)
- [ ] Form validation wrapper

---

### Phase 3: Authentication & Layout (Day 2)

#### 3.1 Login Screen
- [ ] Create login form with validation
- [ ] Implement admin login flow
- [ ] Add remember me functionality
- [ ] Show loading states
- [ ] Handle errors with user feedback
- [ ] Redirect to dashboard on success

**Features:**
- Username/password inputs
- Form validation
- Error messages
- Loading spinner
- Auto-focus on username

#### 3.2 Main Layout
- [ ] Create responsive navigation bar
- [ ] Implement collapsible sidebar
- [ ] Add user profile dropdown
- [ ] Create breadcrumb navigation
- [ ] Add logout functionality
- [ ] Implement mobile menu

**Layout Structure:**
```
+------------------------------------------+
| Navbar (logo, search, profile, logout)  |
+------------------------------------------+
| Sidebar | Main Content Area              |
|         |                                 |
| - Dash  |  <router-view>                 |
| - Coll  |                                 |
| - Users |                                 |
| - Query |                                 |
| - Files |                                 |
|         |                                 |
+------------------------------------------+
```

#### 3.3 Dashboard Screen
- [ ] Display system statistics
- [ ] Show recent activity
- [ ] Display collection count
- [ ] Show user count
- [ ] Display storage usage
- [ ] Add quick action buttons

**Widgets:**
- Collection count card
- User count card
- Storage usage chart
- Recent documents table
- Quick links

---

### Phase 4: Collection Management (Day 2)

#### 4.1 Collection List View
- [ ] Display all collections in grid/list
- [ ] Show collection statistics (doc count, size)
- [ ] Add create collection button
- [ ] Implement delete collection with confirmation
- [ ] Add search/filter collections
- [ ] Show loading states

#### 4.2 Collection Form
- [ ] Create modal form for new collection
- [ ] Add collection name input with validation
- [ ] Optional schema editor (JSON)
- [ ] Optional index definitions
- [ ] Collection options configuration
- [ ] Form submission and error handling

#### 4.3 Collection Detail View
- [ ] Show collection metadata
- [ ] Display document count
- [ ] Show indexes
- [ ] Add quick stats
- [ ] Link to documents view
- [ ] Add edit/delete actions

---

### Phase 5: Document Management (Day 2-3)

#### 5.1 Document List View
- [ ] Display documents in table format
- [ ] Implement pagination (client-side)
- [ ] Add sorting by fields
- [ ] Implement search/filter
- [ ] Show document preview
- [ ] Add create document button
- [ ] Implement bulk delete

#### 5.2 JSON Document Editor
- [ ] Create Monaco-based JSON editor
- [ ] Add syntax highlighting
- [ ] Implement validation
- [ ] Add format/prettify button
- [ ] Show line numbers
- [ ] Add auto-complete for field names

#### 5.3 Document CRUD
- [ ] Create new document form
- [ ] Implement document update
- [ ] Add delete confirmation
- [ ] Show created/updated metadata
- [ ] Add version history (if available)
- [ ] Implement save and save-as-new

---

### Phase 6: Query Explorer (Day 3)

#### 6.1 Query Editor Interface
- [ ] Create MongoDB query syntax editor
- [ ] Add syntax highlighting for query DSL
- [ ] Implement autocomplete for operators
- [ ] Add query examples dropdown
- [ ] Validate query before execution
- [ ] Show query history

**Supported Operators:**
```json
{
  "$eq", "$ne", "$gt", "$gte", "$lt", "$lte",
  "$in", "$nin", "$and", "$or", "$not",
  "$exists", "$type", "$regex",
  "$all", "$elemMatch", "$size"
}
```

#### 6.2 Query Results Display
- [ ] Display results in table format
- [ ] Show JSON view toggle
- [ ] Implement result pagination
- [ ] Add export to JSON/CSV
- [ ] Show execution time
- [ ] Display result count

#### 6.3 Saved Queries
- [ ] Create query save functionality
- [ ] List saved queries
- [ ] Load saved query
- [ ] Delete saved query
- [ ] Share query (copy to clipboard)

#### 6.4 Query Builder (Optional)
- [ ] Visual query builder UI
- [ ] Drag-and-drop operators
- [ ] Convert to/from JSON
- [ ] Field selector
- [ ] Operator selector

---

### Phase 7: User Management (Day 3)

#### 7.1 User List View
- [ ] Display all users in table
- [ ] Show user email, status, created date
- [ ] Add search users
- [ ] Filter by verification status
- [ ] Show user count
- [ ] Add pagination

#### 7.2 User Detail View
- [ ] Show user profile
- [ ] Display metadata
- [ ] Show active sessions
- [ ] Display last login
- [ ] Show created documents count
- [ ] Add edit/delete actions

#### 7.3 User Actions
- [ ] Create new user
- [ ] Update user metadata
- [ ] Delete user (with confirmation)
- [ ] Revoke all sessions
- [ ] Verify email manually
- [ ] Reset password (future)

---

### Phase 8: File Browser (Day 3)

#### 8.1 File List View
- [ ] Display files in grid view
- [ ] Show file thumbnails (for images)
- [ ] Display file metadata
- [ ] Show file size
- [ ] Add search/filter
- [ ] Implement sorting

#### 8.2 File Upload
- [ ] Create drag-and-drop upload zone
- [ ] Add file picker button
- [ ] Show upload progress
- [ ] Validate file size (100MB limit)
- [ ] Support multiple files
- [ ] Add upload queue

#### 8.3 File Actions
- [ ] Download file
- [ ] Delete file (with confirmation)
- [ ] Preview file (images, text)
- [ ] Copy file URL
- [ ] Update file metadata

---

### Phase 9: Realtime Monitor (Day 3-4)

#### 9.1 WebSocket Connection
- [ ] Implement WebSocket client
- [ ] Add auto-reconnect logic
- [ ] Show connection status
- [ ] Display heartbeat indicator
- [ ] Handle connection errors

#### 9.2 Subscription Management
- [ ] Create subscription interface
- [ ] Subscribe to collection changes
- [ ] Subscribe to specific document
- [ ] List active subscriptions
- [ ] Unsubscribe functionality

#### 9.3 Event Feed
- [ ] Display realtime events stream
- [ ] Show event type (create, update, delete)
- [ ] Display event data
- [ ] Add timestamp
- [ ] Filter events by type
- [ ] Implement event search

#### 9.4 Event Inspector
- [ ] Show detailed event data
- [ ] Display before/after for updates
- [ ] Show collection and document ID
- [ ] Add copy event JSON
- [ ] Implement event replay (future)

---

### Phase 10: API Tester (Day 4)

#### 10.1 Request Builder
- [ ] Create HTTP method selector
- [ ] Add endpoint path input
- [ ] Implement headers editor
- [ ] Add query parameters editor
- [ ] Create request body editor (JSON)
- [ ] Add authentication toggle

#### 10.2 Response Viewer
- [ ] Display response status code
- [ ] Show response headers
- [ ] Format JSON response
- [ ] Display response time
- [ ] Add copy response button
- [ ] Show response size

#### 10.3 Request Collections
- [ ] Save requests
- [ ] Organize in folders
- [ ] Load saved requests
- [ ] Export/import collections
- [ ] Share requests

---

### Phase 11: Settings & Theming (Day 4)

#### 11.1 Theme Customization
- [ ] Light/dark mode toggle
- [ ] Color scheme selector
- [ ] Font size adjustment
- [ ] Sidebar position (left/right)
- [ ] Compact/comfortable density

#### 11.2 User Preferences
- [ ] Default page on login
- [ ] Items per page
- [ ] Query result format
- [ ] Notification preferences
- [ ] Language selection (future)

#### 11.3 System Settings
- [ ] Display SwiftBase version
- [ ] Show system info
- [ ] Display database stats
- [ ] Connection settings
- [ ] Backup/restore (future)

---

### Phase 12: Polish & Optimization (Day 4)

#### 12.1 Responsive Design
- [ ] Test all screens on mobile
- [ ] Implement mobile-specific layouts
- [ ] Add touch-friendly interactions
- [ ] Optimize for tablets
- [ ] Test on different screen sizes

#### 12.2 Accessibility
- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Test with screen readers
- [ ] Ensure proper contrast ratios
- [ ] Add focus indicators

#### 12.3 Performance Optimization
- [ ] Implement code splitting
- [ ] Lazy load routes
- [ ] Optimize bundle size
- [ ] Add virtual scrolling for large lists
- [ ] Implement query result caching
- [ ] Optimize images and assets

#### 12.4 Error Handling
- [ ] Global error boundary
- [ ] Network error handling
- [ ] Form validation errors
- [ ] API error display
- [ ] Retry mechanisms

#### 12.5 Loading States
- [ ] Add skeleton loaders
- [ ] Implement progress bars
- [ ] Show spinners for actions
- [ ] Add optimistic updates
- [ ] Handle slow connections

---

## Build & Deployment

### Development Build
```bash
cd AdminUI
pnpm install
pnpm dev
```

### Production Build
```bash
cd AdminUI
pnpm build
# Output: ../Sources/SwiftBase/Resources/Public/
```

### Integration with Swift Binary
The built assets will be automatically included in the Swift binary via:
```swift
.resources([
    .copy("Resources/Public")
])
```

---

## Testing Plan

### Component Testing
- [ ] Test all common components in isolation
- [ ] Test form validation logic
- [ ] Test API client methods
- [ ] Test store state mutations

### Integration Testing
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test query execution
- [ ] Test file upload/download
- [ ] Test realtime subscriptions

### E2E Testing (Future)
- [ ] Set up Playwright
- [ ] Test complete user workflows
- [ ] Test error scenarios
- [ ] Test responsive layouts

---

## UI/UX Guidelines

### Design Principles
1. **Simplicity**: Clean, uncluttered interface
2. **Consistency**: Uniform components and patterns
3. **Feedback**: Clear user feedback for all actions
4. **Efficiency**: Minimize clicks to accomplish tasks
5. **Responsive**: Works on all screen sizes

### Component Guidelines
- Use consistent spacing (4px grid system)
- Maintain color consistency
- Provide loading states for all async operations
- Show meaningful error messages
- Use animations sparingly for feedback

### Interaction Patterns
- Confirm destructive actions
- Show success feedback after mutations
- Implement undo for critical actions (future)
- Provide keyboard shortcuts for power users
- Auto-save where appropriate

---

## Performance Targets

- **Initial Load**: < 2 seconds
- **Route Change**: < 100ms
- **API Response Render**: < 50ms
- **Bundle Size**: < 500KB (gzipped)
- **Time to Interactive**: < 3 seconds

---

## Future Enhancements

### Phase 13+ (Post-MVP)
- [ ] GraphQL query interface
- [ ] Real-time collaboration
- [ ] Advanced data visualization
- [ ] API documentation generator
- [ ] Schema designer (visual)
- [ ] Database migration tool
- [ ] Export/import functionality
- [ ] Audit log viewer
- [ ] Role-based access control UI
- [ ] Custom dashboards
- [ ] Plugin system
- [ ] Multi-language support
- [ ] Dark mode theme variants
- [ ] Keyboard shortcuts panel
- [ ] Command palette (CMD+K)

---

## Dependencies Reference

### Core Dependencies
```json
{
  "dependencies": {
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "vite": "^5.4.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Optional Dependencies (As Needed)
```json
{
  "dependencies": {
    "monaco-editor": "^0.50.0",  // For query editor
    "@codemirror/lang-json": "^6.0.0",  // Alternative to Monaco
    "chart.js": "^4.4.0",  // For charts
    "date-fns": "^3.0.0"  // Date formatting
  }
}
```

---

## Checklist Summary

### Day 1
- [ ] Project setup and configuration
- [ ] TypeScript and build configuration
- [ ] TailwindCSS setup
- [ ] Type definitions
- [ ] API client library
- [ ] State management stores
- [ ] Routing system
- [ ] Common components
- [ ] Login screen
- [ ] Main layout

### Day 2
- [ ] Dashboard
- [ ] Collection management
- [ ] Document list view
- [ ] Document editor

### Day 3
- [ ] Query explorer
- [ ] User management
- [ ] File browser
- [ ] Realtime monitor

### Day 4
- [ ] API tester
- [ ] Settings and theming
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Build and test
- [ ] Final polish

---

**Total Estimated Tasks**: ~150
**Timeline**: 4 days
**Status**: Ready to implement

**Next Step**: Begin Phase 1 - Project Setup & Foundation
