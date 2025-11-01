feat: enhance dashboard UI with improved navigation, time/location display, and table features

This commit introduces several major UI/UX improvements to the dashboard application:

## UI/UX Enhancements

### Header Improvements
- **Move theme toggle to profile dropdown**: Relocated the theme toggle from the header to the user profile dropdown menu for a cleaner header interface
- **Replace email with full name in welcome message**: Updated "Welcome back" message to display user's full name (currently using mock data "Maria Cristina Santos") instead of email address
- **Reorganize header layout**: Simplified header structure with welcome message on left and action buttons on right

### Navigation & Layout
- **Create reusable TimeLocation component**: Extracted time and location display into a standalone component (`TimeLocation.tsx`) for better maintainability
- **Reposition time/location display**: Moved time and location from header to main content area, positioned on the right side opposite breadcrumbs for better visual balance
- **Remove back button from FB Pages**: Removed "Back to Accounts" button from individual Facebook page messenger interfaces, relying on breadcrumbs for navigation

## Table Enhancements

### Category Tables (Incoming & Outgoing)
- **Add row numbering column**: Introduced "No." column as the first column in category tables showing sequential row numbers based on pagination
- **Implement comprehensive pagination system**:
  - Added pagination state management with configurable items per page (5, 10, 25, 50)
  - Implemented page navigation with Previous/Next buttons
  - Added dynamic page number buttons (displays up to 5 pages with smart positioning)
  - Auto-reset to page 1 when filters, search, or sorting changes
  - Enhanced footer with range display (e.g., "Showing 1-10 of 50 documents")
  - Added items-per-page selector dropdown
  
- **Add delete functionality**:
  - Implemented delete icon/button in each table row's Actions column
  - Added two-step confirmation (click delete → show Confirm/Cancel buttons)
  - Integrated delete functionality that updates state immediately
  - Works seamlessly with filtering, sorting, and pagination

## Technical Improvements

### Component Architecture
- Extracted static data into separate files (`data.ts`/`data.tsx`) for incoming and outgoing categories
- Improved component organization and separation of concerns
- Enhanced responsive design with mobile-first approach

### State Management
- Converted documents from `useMemo` to `useState` to support deletion operations
- Added proper state management for pagination across multiple pages
- Improved state synchronization between filters, search, and pagination

## Files Changed

### New Files
- `app/dashboard/components/TimeLocation.tsx` - Reusable time and location component
- `app/dashboard/incoming/data.tsx` - Static data for incoming categories
- `app/dashboard/outgoing/data.ts` - Static data for outgoing categories
- `app/dashboard/incoming/[categoryId]/page.tsx` - Dynamic route for incoming category pages
- `app/dashboard/outgoing/[categoryId]/page.tsx` - Dynamic route for outgoing category pages
- `app/dashboard/orm/fb-pages/[accountId]/page.tsx` - Dynamic route for FB account messenger
- `app/dashboard/orm/econcern/page.tsx` - E-Concern submenu page

### Modified Files
- `app/dashboard/components/Header.tsx` - Header reorganization, theme toggle removal, welcome message update
- `app/dashboard/components/Sidebar.tsx` - Theme toggle integration (removed from header)
- `app/dashboard/layout.tsx` - TimeLocation component integration, layout adjustments
- `app/dashboard/incoming/page.tsx` - Navigation updates, data extraction
- `app/dashboard/outgoing/page.tsx` - Navigation updates, data extraction
- `app/dashboard/orm/fb-pages/[accountId]/page.tsx` - Removed back button

## User Experience Impact

- **Improved Navigation**: Time/location and breadcrumbs positioned for better visual hierarchy
- **Enhanced Data Management**: Row numbers and pagination make large datasets more manageable
- **Better Information Density**: Tables can now handle more data with pagination
- **Streamlined Actions**: Delete functionality with confirmation prevents accidental deletions
- **Cleaner Header**: Reduced header clutter improves focus on main content
- **Consistent Experience**: All category tables now have uniform features and behavior

## Breaking Changes
None - all changes are backward compatible and enhance existing functionality.
