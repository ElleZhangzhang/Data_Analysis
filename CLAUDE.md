# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
pnpm dev          # Start Vite dev server (with proxy to dashscope.aliyuncs.com for AI API)
pnpm build        # Type-check + build (runs via npm-run-all)
pnpm preview      # Preview production build
pnpm type-check   # vue-tsc --build
pnpm lint         # oxlint + eslint (both with --fix --cache)
```

## Tech Stack

- **Vue 3** (Composition API + `<script setup lang="ts">`), **Vite 7**, **TypeScript 5.9**
- **Pinia** with `pinia-plugin-persistedstate` (used by dashboard store)
- **Element Plus** (auto-imported via unplugin-vue-components/resolvers)
- **ECharts 6** for chart rendering
- **idb** (IndexedDB wrapper) for dataset persistence
- **Web Worker** (Excel parsing) — `excel-parser.worker.ts`
- **xlsx** (SheetJS) for Excel file parsing
- **AI chart recommendations** via `apis/qianwen.ts` — calls DashScope (Tongyi Qianwen) API proxied through Vite

## Project Architecture

```
src/
├── apis/qianwen.ts            # AI chart recommendation: builds prompt with data stats, calls DashScope API, validates & normalizes response
├── components/
│   ├── Charts/
│   │   ├── BaseChart.vue            # ECharts renderer with 4 chart types (bar/line/pie/scatter), binning transform, drag support
│   │   ├── ChartConfigDialog.vue     # Manual chart creation form (type, title, X/Y axis selection)
│   │   └── ChartRecommendDialog.vue  # AI recommendation dialog: fetches from qianwen.ts, shows cards, one-click create
│   ├── DataTable/
│   │   ├── VirtualTable.vue         # Virtual-scroll table for large datasets
│   │   └── useVirtualScroll.ts      # Virtual scroll composable (visible window + buffer)
│   ├── Dashboard/
│   │   ├── GridLayout.vue           # (empty — drag grid layout to be built)
│   │   ├── ChartWidget.vue          # (empty — chart widget wrapper to be built)
│   │   └── useDrag.ts               # (empty — drag composable for grid layout)
│   └── AIAnalysis/
│       └── AIInsight.vue            # (empty — AI analysis panel to be built)
├── composables/
│   ├── useDrag.ts                   # Drag composable: mouse event handling, grid snapping, boundary constraints
│   └── useFileParse.ts              # File upload composable: spawns Web Worker, adds parsed dataset to store
├── stores/
│   ├── data.ts                      # Data store: datasets[], currentDataset, hydrate from IndexedDB on init
│   └── dashboard.ts                 # Dashboard store: charts[], CRUD operations, persisted to localStorage
├── types/index.ts                   # DataRow, ColumnDef, Dataset, ChartConfig, ChartTransform
├── utils/datasetDB.ts               # IndexedDB wrapper (idb): getAll/upsert/get for datasets
├── workers/excel-parser.worker.ts   # Web Worker: parses Excel via xlsx, infers column types, builds Dataset
└── views/
    ├── Upload.vue                   # (disabled — file input commented out; upload moved to DataView sidebar)
    ├── DataView.vue                 # Main app view: sidebar with dataset list, upload button, VirtualTable, chart section
    └── Dashboard.vue                # (drag dashboard view — under construction)
```

## Key Data Flow

1. **Upload**: User clicks "添加新档案" in DataView sidebar → `handleUpload` → `useFileParse().parseFile(file)`
2. **Web Worker**: Worker parses Excel via `xlsx`, infers column types (number/date/string), returns `Dataset` object
3. **Storage**: Dataset stored in both Pinia `dataStore.datasets[]` (in-memory) and IndexedDB via `datasetDB.ts` (persistence)
4. **Display**: `VirtualTable` renders rows with virtual scrolling; chart section renders `BaseChart` instances per `ChartConfig`
5. **AI Recommendation**: `ChartRecommendDialog` → `recommendCharts()` sends data stats to DashScope API → validates/normalizes → user one-click creates charts

## Important Notes

- **Router is commented out** — the app currently shows Upload and DataView side-by-side in `App.vue`. No page routing needed.
- **`.env` contains `VITE_DEEPSEEK_KEY`** — API key for AI features, proxied through Vite (`/api` → `dashscope.aliyuncs.com`)
- **Two drag systems coexist**: `composables/useDrag.ts` (used by BaseChart for chart-level dragging) and `components/Dashboard/useDrag.ts` (empty, for future grid layout)
- **Auto-imports**: Element Plus components and common Vue APIs are auto-imported — no manual imports needed for them
- **`noUncheckedIndexedAccess: true`** in tsconfig — array/object access requires null checking
- **Pinia stores use different persistence**: `dashboard` store uses `pinia-plugin-persistedstate` (localStorage), `data` store uses manual IndexedDB via `datasetDB.ts`
- **Chart types** (types/index.ts line 34): `'line' | 'bar' | 'pie' | 'scatter'` — maintained in both the type and the AI prompt
- **Binning transform**: A `ChartTransform` with `binning.field` and optional `binCount` enables histogram-style analysis (e.g., salary ranges)
