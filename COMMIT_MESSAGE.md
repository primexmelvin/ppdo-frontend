feat: Add breadcrumbs navigation, outgoing page, and smart table filters

## Overview
This commit introduces comprehensive navigation improvements, a new outgoing documents page, and enhanced table functionality with advanced filtering and sorting capabilities.

## Features Added

### 1. Breadcrumbs Navigation System
- Created reusable `Breadcrumbs` component with automatic route parsing
- Integrated breadcrumbs into dashboard layout for all pages
- Added `BreadcrumbContext` for custom breadcrumb overrides
- Breadcrumbs automatically generate from pathname segments
- Supports custom breadcrumbs via context (e.g., category names)
- Responsive design with text truncation on mobile
- Uses accent color for current page indicator

**Files:**
- `app/dashboard/components/Breadcrumbs.tsx` (new)
- `app/dashboard/contexts/BreadcrumbContext.tsx` (new)
- `app/dashboard/layout.tsx` (modified)

### 2. Outgoing Documents Page
- Complete outgoing documents management page
- Three category cards:
  - Legal Documents (87 documents)
  - Memo (142 documents)
  - Fuel Request (53 documents)
- Square category cards matching incoming page design
- Integrated breadcrumbs with dynamic category names
- Full table view with sortable columns and filters
- Accent color integration throughout

**Files:**
- `app/dashboard/outgoing/page.tsx` (new)

### 3. Smart Table System
Enhanced both incoming and outgoing document tables with:

#### Advanced Filtering
- Multi-select status filters (checkboxes)
- Multi-select priority filters (checkboxes)
- Date range filters (from/to date pickers)
- Collapsible filter panel with toggle button
- Active filter count badge indicator
- Reset filters functionality
- Filters work in combination (AND logic)

#### Enhanced Sorting
- All columns sortable via header clicks
- Toggle ascending/descending on repeated clicks
- Improved date sorting using raw date values
- Visual sort indicators with accent color
- Proper handling of string, number, and date comparisons

#### Search Integration
- Text search across all document fields
- Real-time filtering as user types
- Search works in combination with other filters

#### UI Improvements
- Filter button highlights when filters are active
- Badge showing number of active filters
- "(Filtered)" indicator in table footer
- Responsive filter panel grid layout
- Accent color styling for filter controls

**Files:**
- `app/dashboard/incoming/page.tsx` (modified)
- `app/dashboard/outgoing/page.tsx` (modified)

### 4. Add Document Button
- Added prominent "Add Document" button in category table views
- Visible in both incoming and outgoing pages
- Styled with accent color for consistency
- Positioned between search and filter controls

**Files:**
- `app/dashboard/incoming/page.tsx` (modified)
- `app/dashboard/outgoing/page.tsx` (modified)

### 5. Navigation Improvements
- Removed "Back to Categories" button (replaced by breadcrumbs)
- Simplified page headers in table views
- Improved navigation flow using breadcrumb clicks

**Files:**
- `app/dashboard/incoming/page.tsx` (modified)
- `app/dashboard/outgoing/page.tsx` (modified)

## Technical Details

### State Management
- Added filter state for status, priority, and date range
- Enhanced document interfaces with `dateSubmittedRaw` and `dateIssuedRaw` for proper date sorting
- Implemented `useMemo` for optimized filtering and sorting performance

### Data Structure Changes
- Extended `Document` interface with raw date fields for accurate date comparisons
- Added `Filters` interface for type-safe filter state
- Maintained backward compatibility with existing document structures

### Context Integration
- Breadcrumb context integrated into dashboard provider chain
- Maintains filter and search state across component re-renders
- Proper cleanup on component unmount

## UI/UX Improvements
- Consistent accent color usage across all new components
- Mobile-first responsive design
- Clear visual feedback for active filters and sorting
- Intuitive filter controls with checkboxes and date pickers
- Improved information hierarchy with breadcrumbs

## Browser Compatibility
- Uses native HTML5 date inputs
- CSS Grid for responsive filter layouts
- Fallback support for older browsers via Tailwind utilities

## Performance Optimizations
- Memoized filter calculations to prevent unnecessary re-renders
- Efficient date comparisons using raw timestamp values
- Optimized sort algorithms for large datasets

## Testing Considerations
- Filter combinations should be tested (status + priority + date range)
- Date range edge cases (empty dates, invalid ranges)
- Search + filter combinations
- Sorting with filters active
- Mobile responsiveness across all new components

---

**Breaking Changes:** None
**Migration Notes:** No migration required - all changes are additive
**Documentation:** Component interfaces and props documented in code

