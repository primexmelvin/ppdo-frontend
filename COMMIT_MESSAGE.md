feat: major dashboard redesign with office management system and MongoDB integration

This commit introduces a comprehensive dashboard redesign with office management functionality, MongoDB database integration, and external API connectivity for HRMO office data.

## Major Features

### Dashboard Layout Redesign

- **Restructured main dashboard grid**: Reorganized from 2-column to 3-column layout (3-6-3 grid)
  - Left column: Client Satisfaction Rating, Office Selection, SGLG Data
  - Middle column: Physical & Financial Accomplishment bar charts
  - Right column: Overall Completion Rate & Utilization Rate gauges
- **Status of Mandatory Fund card**: Spans full width (12 columns) below main section with responsive grid layout
- **Repositioned key components**: Moved Overall Performance Score and Login Trail below main dashboard section
- **Added banner image**: Integrated external banner image with proper Next.js Image optimization

### Office Management System

- **Windows-style folder gallery**: Created office listing page (`/dashboard/office`) with:
  - 28 official provincial offices displayed as Windows-style folder icons
  - Responsive grid layout (2-6 columns based on screen size)
  - Hover effects and visual feedback
- **Office selection component**: Searchable combobox with:
  - Real-time filtering by office name or code
  - Recent selections (top 5) persisted in localStorage
  - Clear button and collapsible list
- **Office detail pages**: Individual office pages (`/dashboard/office/[code]`) with:
  - Summary cards (Total, Approved, In Review, Draft)
  - Search and filter functionality (Type, Sector)
  - Data table with ID, Title, Type, Sector, Percentage columns
  - View-only actions (no edit/delete)
  - Pagination controls
- **External API integration**: HRMO office connected to external API:
  - Proxy route `/api/ppdo/external/ppe` for CORS handling
  - Environment variable `NEXT_PUBLIC_HRMO_API_URL` for deployment
  - Data transformation with fallback field mapping
  - Loading and error states

### New Components

- **BarChartCard**: Horizontal bar chart component for physical/financial accomplishments
- **MiniGauge**: Compact half-circle gauge for status indicators
- **OfficeSelect**: Searchable combobox for office selection with recent items
- **Office detail page**: Complete table view with filtering and search

### MongoDB Integration

- **Database connection utility**: Created `lib/mongodb.ts` with:
  - Serverless-safe connection pooling (reuses connections in dev)
  - Database helper functions (`getDb()`, `closeConnection()`)
  - Proper error handling and environment variable validation
- **API endpoints**:
  - `/api/test-db`: Connection test endpoint
  - `/api/offices`: CRUD operations for offices (GET, POST)
  - `/api/ppdo/external/ppe`: Proxy for external HRMO API
- **Environment configuration**: Added MongoDB URI and database name to `.env.local`

### Sidebar Updates

- **Cross Department section**: Consolidated multiple office links into single "Office" menu item
- **Navigation**: Office menu item links to `/dashboard/office` gallery page

### Data Visualization

- **Gauge charts**: Overall Completion Rate and Utilization Rate with speedometer-style visualization
- **Bar charts**: Physical and Financial Accomplishment by office with responsive design
- **Status blocks**: Mandatory fund status with mini gauges for LDF, MDRRMF, GAD, Trust Fund
- **SGLG Data**: Compliance metrics with mini gauges and revenue growth display
- **Client Satisfaction**: Large percentage display card

### Dashboard Data Integration

- **Office selection filtering**: Dashboard charts and gauges update based on selected office
- **Dynamic metrics**: Completion rate, utilization rate, and accomplishment data change per office
- **Responsive height matching**: Physical and Financial charts match gauge card heights (min-h-[315px])

## Technical Improvements

### Build Fixes

- **Fixed import paths**: Corrected relative imports for `FinancialBreakdownItem` type across budget components
- **Fixed ref callbacks**: Updated ref assignments to return void instead of value (TypeScript compliance)
- **TypeScript errors**: Resolved all compilation errors for production build

### Code Quality

- **Mobile-first design**: All new components follow responsive design principles
- **Accent color integration**: Buttons and UI elements use global accent color system
- **Error handling**: Comprehensive error states and loading indicators
- **Type safety**: Proper TypeScript interfaces and type definitions

### Configuration

- **Next.js config**: Updated image domains for external banner images
- **Environment variables**: Added `NEXT_PUBLIC_HRMO_API_URL` for external API connection
- **MongoDB setup**: Connection string and database name configuration

## Files Added

### New Components

- `app/dashboard/components/BarChartCard.tsx` - Bar chart visualization component
- `app/dashboard/components/MiniGauge.tsx` - Compact gauge component
- `app/dashboard/components/OfficeSelect.tsx` - Searchable office selection combobox

### New Pages

- `app/dashboard/office/page.tsx` - Office gallery with Windows-style folders
- `app/dashboard/office/[code]/page.tsx` - Individual office detail page with data table

### API Routes

- `app/api/test-db/route.ts` - MongoDB connection test endpoint
- `app/api/offices/route.ts` - Office CRUD operations
- `app/api/ppdo/external/ppe/route.ts` - External HRMO API proxy

### Utilities

- `lib/mongodb.ts` - MongoDB connection utility with Next.js serverless support

## Files Modified

### Dashboard

- `app/dashboard/page.tsx` - Complete layout restructure, added gauges/charts/status blocks
- `app/dashboard/components/Sidebar.tsx` - Updated Office menu item
- `app/dashboard/components/PersonalKPICard.tsx` - Position adjustments
- `app/dashboard/components/SpeedometerCard.tsx` - Integration in main dashboard

### Budget Components

- `app/dashboard/budget/[particularId]/[projectId]/components/FinancialBreakdownItemForm.tsx` - Fixed import path
- `app/dashboard/budget/[particularId]/[projectId]/components/FinancialBreakdownTable.tsx` - Fixed import path and ref callback
- `app/dashboard/budget/[particularId]/[projectId]/data.ts` - Fixed import path
- `app/dashboard/budget/[particularId]/[projectId]/utils.ts` - Fixed import path
- `app/dashboard/budget/[particularId]/components/ProjectsTable.tsx` - Fixed ref callback
- `app/dashboard/budget/components/BudgetTrackingTable.tsx` - Fixed ref callback

### Configuration

- `next.config.ts` - Added image domains for external images
- `README.md` - Updated with MongoDB setup and HRMO API configuration
- `package.json` - MongoDB driver already present

## Environment Variables Required

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ppdo

# External APIs
NEXT_PUBLIC_HRMO_API_URL=https://hrmo.netlify.app

# OpenAI (existing)
OPENAI_API_KEY=your_key_here
```

## Breaking Changes

- Removed old incoming/outgoing/orm modules (cleanup)
- Dashboard layout structure changed (requires UI review)
- Office selection now affects dashboard data (previously static)

## Migration Notes

- Ensure MongoDB is running or Atlas connection string is configured
- Set `NEXT_PUBLIC_HRMO_API_URL` environment variable for production
- Office data will be fetched from MongoDB or external API depending on office code

## Performance Considerations

- MongoDB connection pooling optimized for Next.js serverless functions
- External API calls proxied through Next.js to avoid CORS issues
- Image optimization with Next.js Image component
- Responsive grid layouts reduce layout shifts

## Testing Recommendations

- Test office selection filtering on dashboard
- Verify MongoDB connection with `/api/test-db` endpoint
- Test HRMO office page with external API connectivity
- Verify responsive layouts on mobile devices
- Check gauge and chart rendering with different data values
