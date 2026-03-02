# Chart Dashboard Template

A professional, dark-themed dashboard template inspired by ADS-B Exchange, featuring a main chart display area and a collapsible configuration panel.

## 🎨 Design Features

### Color Scheme
- **Primary Background**: Deep navy (`#0a0e27`)
- **Secondary Background**: Dark blue-gray (`#1a1f3a`, `#0f1229`)
- **Accent Color**: Cyan blue (`#00d4ff`)
- **Text Colors**: Light gray (`#e0e0e0`), muted blue (`#8b9dc3`)
- **Borders**: Dark blue-gray (`#2a3f5f`)

### Visual Elements
- **Gradients**: Smooth linear gradients for depth
- **Glassmorphism**: Backdrop blur effects on info cards
- **Animations**: Pulsing status indicator, smooth transitions
- **Shadows**: Subtle box shadows for elevation
- **Custom Scrollbar**: Styled scrollbar matching the theme

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                        HEADER                           │
│  Logo | Nav Tabs          Status | Settings            │
├──────────────────────────────────┬──────────────────────┤
│                                  │                      │
│                                  │   CONFIG PANEL       │
│         CHART AREA               │                      │
│                                  │   ┌──────────────┐   │
│  ┌────────────────────────┐      │   │ Filters      │   │
│  │ Info Cards (overlay)   │      │   ├──────────────┤   │
│  │                        │      │   │ Display Opts │   │
│  │   Chart Display        │      │   ├──────────────┤   │
│  │                        │      │   │ Data Sources │   │
│  └────────────────────────┘      │   ├──────────────┤   │
│                                  │   │ Actions      │   │
├──────────────────────────────────┤   └──────────────┘   │
│  Bottom Info Bar                 │                      │
└──────────────────────────────────┴──────────────────────┘
```

## 🧩 Components

### Header
- **Logo**: Gradient text with icon
- **Navigation**: Tab-style buttons (Live View, History, Reports)
- **Status Indicator**: Animated pulsing dot with "Live" status
- **Settings Button**: Subtle hover effect

### Chart Area
- **Info Cards**: Overlay cards showing key metrics
  - Total Records
  - Active count
  - Update Rate
- **Chart Container**: Main display area with gradient background
- **Bottom Info Bar**: Shows last update time, zoom level, performance

### Config Panel
- **Collapsible**: Can be collapsed to 50px width
- **Sections**: Expandable/collapsible sections
  - **Filters**: Date range, category, checkboxes
  - **Display Options**: Chart type, color scheme, toggles
  - **Data Sources**: Connection status indicators
- **Action Buttons**: Primary (Apply) and Secondary (Reset)

## 🎯 Key Features

### Interactive Elements
✅ Collapsible config panel with smooth animation  
✅ Expandable/collapsible sections within panel  
✅ Hover effects on all interactive elements  
✅ Active state indicators  
✅ Pulsing live status indicator  

### Responsive Design
✅ Desktop: Side-by-side layout  
✅ Tablet: Narrower config panel  
✅ Mobile: Stacked layout with config panel at bottom  

### Professional Touches
✅ Custom scrollbar styling  
✅ Backdrop blur effects  
✅ Gradient backgrounds  
✅ Smooth transitions (0.2s - 0.3s)  
✅ Consistent spacing and alignment  

## 🎨 Styling Inspiration

Inspired by **ADS-B Exchange**:
- Dark, professional theme
- High-contrast accent colors
- Information-dense layout
- Real-time status indicators
- Collapsible side panels
- Overlay information cards
- Clean, modern typography

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (> 1024px)
- **Tablet**: Narrower panel (768px - 1024px)
- **Mobile**: Stacked layout (< 768px)

## 🔧 Customization

### Adding Your Chart
Replace the `.chart-content` placeholder with your actual chart component:

```tsx
<div className="chart-content">
    <YourChartComponent />
</div>
```

### Modifying Colors
Update the CSS variables or replace color values:
- Primary: `#00d4ff`
- Background: `#0a0e27`
- Borders: `#2a3f5f`

### Adding Sections
Follow the pattern in the config panel:

```tsx
<div className="panel-section">
    <div className="section-header" onClick={() => toggleSection("new")}>
        <span>New Section</span>
        <span className="section-toggle">
            {activeSection === "new" ? "−" : "+"}
        </span>
    </div>
    {activeSection === "new" && (
        <div className="section-content">
            {/* Your content */}
        </div>
    )}
</div>
```

## 🚀 Usage

The dashboard is set as the default view in `App.tsx`. It displays immediately when the app loads.

```tsx
import ChartDashboard from "./components/ChartDashboard";

function App() {
    return <ChartDashboard />;
}
```

## 📦 Files

- `ChartDashboard.tsx` (285 lines) - Main component
- `ChartDashboard.css` (539 lines) - Complete styling

## 🎯 Next Steps

To make this functional:
1. Replace chart placeholder with actual chart library (Vega, Chart.js, D3, etc.)
2. Connect filters to actual data
3. Implement data source connections
4. Add real-time data updates
5. Implement settings functionality
6. Add data export features

