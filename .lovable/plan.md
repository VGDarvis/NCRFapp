

# Update App Color Scheme — Warm Orange/Gold/Cream Palette

## Inspiration
The reference image uses a warm, elegant palette: cream/off-white backgrounds, deep orange-red primary buttons, golden accents, warm amber highlights, and soft warm shadows. Light mode, clean, premium feel.

## Approach
Only update CSS variables and utility classes in `src/index.css` and gradient references in `tailwind.config.ts`. No layout, component, or functional changes.

## New Color Palette

| Role | Current (Cyber Blue/Green) | New (Warm Gold/Orange) |
|------|---------------------------|----------------------|
| Background | `#0F0F23` dark navy | `#FFF8F0` warm cream |
| Foreground | `#FAFAFA` white | `#2D1810` dark brown |
| Card | `#1A1A3A` dark | `#FFFFFF` white |
| Primary | `#00D4FF` neon blue | `#C4420A` deep orange-red |
| Secondary | `#26263A` dark | `#FFF0E5` light peach |
| Accent | `#00FF88` cyber green | `#D4890A` warm gold |
| Muted | dark gray | `#FEF3E8` warm beige |
| Border | dark border | `#F0D9C4` warm tan |
| Destructive | red (keep similar) | stays red |

## File Changes

### 1. `src/index.css` — Rewrite CSS variables
- Replace `:root` variables with warm palette HSL values
- Update `.dark` to use a warm dark variant (dark brown/maroon tones instead of navy)
- Update all glass classes: swap `rgba(26, 26, 58, ...)` to warm cream/brown tones
- Update glow effects: blue glows → warm orange/gold glows
- Update hover effects, shadows, gradients to match warm theme
- Change body background gradient to cream

### 2. `tailwind.config.ts` — Update keyframe glow colors
- `glow-pulse` and `neon-glow` keyframes: change blue/green HSL values to orange/gold
- Gradient references stay as CSS variable references (auto-updated via CSS)

## What does NOT change
- All component files, layouts, sections, routing, and functions remain untouched
- Only the color tokens and utility class colors change
- The design system structure (glass classes, hover effects, transitions) stays — just new colors

