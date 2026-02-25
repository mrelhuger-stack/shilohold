

## Fix: Remove GPU Compositing from Staff Photos

### Problem
The `transform: translateZ(0)` and `backface-visibility: hidden` CSS rules on images force Chrome/Firefox to rasterize images on a GPU compositor layer. When large photos are downscaled into small cards, this GPU rasterization produces visible color artifacts — the "gold sprinkles" effect. Safari uses a different compositing pipeline that handles this gracefully, which is why it looks fine there.

### Solution
Remove all GPU-forcing properties from images globally and from the staff page inline styles. Let the browser use its default, high-quality CPU-based image scaling.

### Changes

**1. `src/index.css` — Remove GPU hints from global `img` rule**
- Remove `backface-visibility: hidden`, `-webkit-backface-visibility: hidden`, and `transform: translateZ(0)` from the `img` selector
- Keep only `image-rendering: auto`

**2. `src/pages/StaffPage.tsx` — Remove inline GPU styles from staff images**
- Remove the entire `style` prop containing `imageRendering`, `WebkitBackfaceVisibility`, `backfaceVisibility`, and `transform: translateZ(0)`
- Keep `loading="lazy"` and `decoding="async"` attributes (these are fine and helpful for performance)

### Why This Works
Without `translateZ(0)`, Chrome will render images on the main thread using its standard bilinear/bicubic downscaling algorithm, which produces clean results. The GPU compositing trick is useful for animations but harmful for static image display at reduced sizes.
