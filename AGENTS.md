# AGENTS.md - Developer & Agent Guidelines

This repository contains the personal portfolio website for **Shahadat Islam Alif** (Digital Marketing Specialist & Language Influencer). It is built as a clean, responsive vanilla static site hosted with Vercel serverless capabilities.

---

## Architecture & Technology Stack

- **HTML5**: Structural markup (`index.html`).
- **Tailwind CSS (CDN)**: Primary utility classes for layout, typography, and responsive spacing (`https://cdn.tailwindcss.com`).
- **Custom CSS (`style.css`)**: Glassmorphic designs, custom animations (gradient shift, floating effects, typing indicators, color sweeps), scrollbars, and non-Tailwind UI components.
- **Vanilla JavaScript (`script.js`)**: Interactive DOM behavior (mobile navigation toggling, smooth scrolling, skill bar animation on intersection observer, WhatsApp form dispatch, modal dialogs, and AI chat widget UI).
- **Serverless API (`api/chat.js`)**: Vercel Serverless Function communicating with Google's Gemini API (`gemini-1.5-flash`).

---

## HTML & CSS Structure

The HTML document (`index.html`) follows a standard single-page portfolio layout with fixed/sticky headers and section divides:

1. **Top Utilities & Navigation (`nav`)**:
   - `scroll-progress` bar & `loading-bar` fixed at top.
   - Sticky header with glassmorphism styling (`glass-card`).
   - Desktop menu links & mobile accordion navigation menu (`#mobileNav`).
   - AI Chat launcher button (`.ai-pill`).

2. **Hero Section (`#home`)**:
   - Dynamic gradient background (`.gradient-bg`).
   - Profile photo with border/shadow glow and floating animation (`.floating`).
   - Heading with animated text gradient (`.text-gradient-animate`).
   - Key skill badges (`.badge-blue`, `.badge-green`, dynamic gradient badges) and direct social/contact CTAs.

3. **Experience Section (`#experience`)**:
   - Vertical timeline layout with center line guide on desktop view (`md:block`).
   - Cards using glassmorphism (`glass-card`) and hover dynamics (`card-hover`).

4. **Skills & Certifications Section (`#skills`)**:
   - Skill progress bars initialized dynamically when scrolled into view via `IntersectionObserver`.
   - Technical skill tag pills and Google Certification highlight box.

5. **Education Section (`#education`)**:
   - Grid layout of educational qualifications in glassmorphism cards with FontAwesome icons.

6. **Contact Section (`#contact`)**:
   - Contact details, mailing address, and interactive reference reveal toggles (`revealReference()`).
   - Form handling direct dispatch to WhatsApp via `wa.me` links (`#contactForm`).

7. **Footer (`footer`)**:
   - Dynamic year auto-update, professional summary, and quote display.

8. **AI Chat Window Overlay (`#chat-window`)**:
   - Floating modal chat widget anchored at bottom right.
   - Handles chat interaction, typing indicators, and backend API requests (`sendToGemini()`).

---

## Color Scheme & Styling Tokens

### Backgrounds & Cards
- **Primary Background**: `#0f172a` (Tailwind `slate-900` / Base page background)
- **Secondary / Card Background**: `#1e293b` (Tailwind `slate-800` / Section background overlays with transparency)
- **Glassmorphism Base**: `rgba(30, 41, 59, 0.7)` with `backdrop-filter: blur(10px)` and border `rgba(14, 165, 233, 0.2)`

### Accent & Text Colors
- **Text Base**: `slate-300` (`#cbd5e1`) and White (`#ffffff`) for contrast headers
- **Primary Accent / Sky**: `#0ea5e9` (`sky-500` / `sky-400`)
- **Secondary Accent / Blue**: `#3b82f6` (`blue-500`)
- **Purple Accent**: `#8b5cf6` (`purple-500`)
- **Success / Green**: `#10b981` (`emerald-500` / WhatsApp `#25D366`)

### Gradients
- **Hero Background Gradient**: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0ea5e9 100%)`
- **Text Gradient**: `linear-gradient(90deg, #0ea5e9, #3b82f6, #8b5cf6)`
- **AI / Highlight Gradient**: `linear-gradient(135deg, #667eea, #764ba2)`

---

## Guidelines for Keeping the Site Clean

1. **Maintain Vanilla Simplicity**:
   - Do not add complex frontend frameworks (React, Vue, etc.) or heavy bundle tools unless explicitly required. Keep the build step minimal.
   - Maintain native browser features for DOM interactions and lightweight event listeners.

2. **CSS & Styling Separation**:
   - Use Tailwind utility classes directly in `index.html` for layout, flexbox/grid, spacing, and standard responsiveness (`md:`, `lg:` breakpoints).
   - Keep custom keyframe animations, glassmorphism overlays, custom scrollbar rules, and unique class overrides inside `style.css`. Avoid inline `style="..."` attributes whenever possible.

3. **JavaScript Organization (`script.js`)**:
   - Wrap event listeners in `DOMContentLoaded` or window initialization checks to prevent null reference errors.
   - Keep global helper functions attached to `window` if invoked via inline HTML handlers (e.g. `window.revealReference`, `window.toggleChat`).
   - Keep WhatsApp & API integrations modular with clear validation and user feedback toasts.

4. **Responsive & Accessible Design**:
   - Always ensure mobile compatibility. Test navigation menus, font sizes, modal positioning, and button targets on mobile screen widths (< 640px and < 768px).
   - Ensure external image URLs (e.g. avatar images) have robust fallback handling (`onerror`).

5. **Serverless & API Security**:
   - Never expose API keys (such as `GEMINI_API_KEY`) in client-side HTML or JS files. All sensitive requests must route through `api/` serverless endpoints.
