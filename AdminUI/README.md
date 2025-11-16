# SwiftBase Admin UI

Modern admin interface for SwiftBase built with Svelte 5, TypeScript, and TailwindCSS.

## Features

- **Svelte 5** with runes-based reactivity
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Vite** for fast development and optimized builds
- Embeds directly into Swift binary

## Project Structure

```
src/
├── routes/           # Page components
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (Navbar, Sidebar)
│   ├── common/      # Common components (Button, Input, Modal)
│   ├── collections/ # Collection-specific components
│   ├── documents/   # Document-specific components
│   ├── query/       # Query explorer components
│   └── users/       # User management components
├── lib/
│   ├── api/         # API client library
│   ├── stores/      # Svelte stores (state management)
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
└── assets/          # Static assets

```

## Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The dev server will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output: `../Sources/SwiftBase/Resources/Public/`

### Type Check

```bash
npm run check
```

## Configuration

### Vite Configuration

- **Base Path**: `/admin/` (configured for embedded serving)
- **Output**: `../Sources/SwiftBase/Resources/Public/`
- **Path Aliases**:
  - `@/*` → `src/*`
  - `@components/*` → `src/components/*`
  - `@lib/*` → `src/lib/*`
  - `@routes/*` → `src/routes/*`
  - `@assets/*` → `src/assets/*`

### TailwindCSS

Custom color scheme configured for SwiftBase:
- Primary: Blue (#3B82F6)
- Secondary: Slate (#64748B)

## Integration with SwiftBase

The built UI is automatically embedded in the SwiftBase binary via Swift Package Manager resources:

```swift
.resources([
    .copy("Resources/Public")
])
```

Access the admin UI at: `http://localhost:8090/admin/`

## Tech Stack

- **Svelte**: 5.43.5+
- **TypeScript**: 5.9.3+
- **Vite**: 7.2.2+
- **TailwindCSS**: 4.1.17+
- **PostCSS**: 8.5.6+

## License

Part of the SwiftBase project
