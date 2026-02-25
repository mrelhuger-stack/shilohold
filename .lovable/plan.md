

## Fix: Remove Residual GPU Compositing from Scroll Animations

### Problem
While we removed the explicit `transform: translateZ(0)` and `backface-visibility` from images, the scroll-triggered animations (`animate-fade-in-up`) still apply `transform: translateY(0)` as their final state via `animation-fill-mode: forwards`. This keeps a CSS transform on the parent container indefinitely, which promotes all child elements (including images) to GPU compositor layers in Chrome — recreating the same "gold sprinkles" artifact.

Sections that are visible on initial load animate immediately, while sections further down animate when scrolled into view. This explains why "some photos are fixed but others aren't" — it depends on timing and which GPU layers Chrome decides to create.

### Solution
Change the animation keyframes so the final state uses `transform: none` instead of `transform: translateY(0)`. The value `none` explicitly removes the transform from the element, preventing GPU layer promotion. The visual animation effect (sliding up from 30px) is identical — only the resting state changes.

### Changes

**1. `tailwind.config.ts` — Fix animation keyframes**

Update these keyframes to end with `transform: "none"` instead of `translateY(0)` or `translateX(0)`:
- `fade-in`: `to` changes from `translateY(0)` to `none`
- `fade-in-up`: `to` changes from `translateY(0)` to `none`
- `fade-in-down`: `to` changes from `translateY(0)` to `none`
- `slide-in-left`: `to` changes from `translateX(0)` to `none`
- `slide-in-right`: `to` changes from `translateX(0)` to `none`
- `scale-in`: `to` changes from `scale(1)` to `none`

**2. No changes needed to `StaffPage.tsx` or `index.css`** — the current state of those files is correct.

### Why This Works
`transform: translateY(0)` is technically a "no-op" visually but it still tells the browser "this element has a transform," causing Chrome to create a GPU compositor layer. `transform: none` explicitly tells the browser "no transform exists," so no GPU layer is created and images render using the standard high-quality CPU pipeline.

