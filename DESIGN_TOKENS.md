# Chart Dashboard - Design Tokens

## 🎨 Color Palette

### Primary Colors
```css
--primary-bg: #0a0e27;           /* Deep navy - main background */
--secondary-bg-1: #1a1f3a;       /* Dark blue-gray - panels */
--secondary-bg-2: #0f1229;       /* Darker blue - alternating sections */
--accent-primary: #00d4ff;       /* Cyan blue - primary accent */
--accent-secondary: #0099ff;     /* Darker cyan - gradients */
```

### Text Colors
```css
--text-primary: #e0e0e0;         /* Light gray - main text */
--text-secondary: #8b9dc3;       /* Muted blue - secondary text */
--text-accent: #00d4ff;          /* Cyan - highlighted text */
--text-muted: #4a5568;           /* Dark gray - placeholder text */
```

### Border Colors
```css
--border-primary: #2a3f5f;       /* Dark blue-gray - main borders */
--border-accent: #00d4ff;        /* Cyan - active borders */
--border-subtle: rgba(255, 255, 255, 0.1);  /* Subtle borders */
```

### Status Colors
```css
--status-success: #00ff88;       /* Green - active/connected */
--status-error: #ff4444;         /* Red - inactive/error */
--status-warning: #ffaa00;       /* Orange - warning */
--status-info: #00d4ff;          /* Cyan - info */
```

### Overlay Colors
```css
--overlay-dark: rgba(0, 0, 0, 0.5);
--overlay-darker: rgba(0, 0, 0, 0.6);
--overlay-light: rgba(255, 255, 255, 0.05);
--overlay-accent: rgba(0, 212, 255, 0.1);
```

## 📏 Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 40px;
```

## 🔤 Typography

### Font Families
```css
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
```

### Font Sizes
```css
--text-xs: 11px;
--text-sm: 12px;
--text-base: 13px;
--text-md: 14px;
--text-lg: 16px;
--text-xl: 18px;
--text-2xl: 20px;
--text-3xl: 24px;
--text-4xl: 28px;
```

### Font Weights
```css
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

## 🎭 Effects

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 2px 10px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 4px 12px rgba(0, 212, 255, 0.4);
--shadow-inset: inset 0 2px 10px rgba(0, 0, 0, 0.3);
--shadow-glow: 0 0 8px currentColor;
```

### Transitions
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### Backdrop Blur
```css
--blur-sm: blur(4px);
--blur-md: blur(8px);
--blur-lg: blur(10px);
```

## 📐 Layout

### Widths
```css
--panel-width: 350px;
--panel-width-tablet: 300px;
--panel-collapsed: 50px;
```

### Heights
```css
--header-height: auto;
--info-bar-height: auto;
```

### Z-Index
```css
--z-base: 1;
--z-overlay: 10;
--z-header: 100;
--z-modal: 1000;
```

## 🎯 Component-Specific

### Info Cards
```css
--info-card-bg: rgba(0, 0, 0, 0.6);
--info-card-border: rgba(0, 212, 255, 0.3);
--info-card-padding: 12px 16px;
--info-card-min-width: 100px;
```

### Buttons
```css
--btn-padding: 8px 16px;
--btn-padding-lg: 12px 32px;
--btn-primary-bg: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
--btn-primary-text: #0a0e27;
--btn-secondary-bg: rgba(255, 255, 255, 0.05);
--btn-secondary-border: rgba(255, 255, 255, 0.1);
```

### Inputs
```css
--input-bg: rgba(0, 0, 0, 0.4);
--input-border: #2a3f5f;
--input-padding: 10px 12px;
--input-focus-border: #00d4ff;
```

### Scrollbar
```css
--scrollbar-width: 8px;
--scrollbar-track: rgba(0, 0, 0, 0.2);
--scrollbar-thumb: rgba(0, 212, 255, 0.3);
--scrollbar-thumb-hover: rgba(0, 212, 255, 0.5);
```

## 🌈 Gradients

```css
--gradient-header: linear-gradient(135deg, #1a1f3a 0%, #0f1229 100%);
--gradient-panel: linear-gradient(135deg, #1a1f3a 0%, #0f1229 100%);
--gradient-chart: linear-gradient(135deg, #0f1229 0%, #1a1f3a 100%);
--gradient-button: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
--gradient-logo: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
```

## 📱 Breakpoints

```css
--breakpoint-mobile: 768px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1280px;
```

## 💡 Usage Example

To use these tokens in your CSS:

```css
.my-component {
    background: var(--primary-bg);
    color: var(--text-primary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    transition: var(--transition-base);
}
```

