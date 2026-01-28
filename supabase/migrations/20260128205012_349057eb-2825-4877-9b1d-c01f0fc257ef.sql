-- Add image_position column to carousel_images table
ALTER TABLE public.carousel_images 
ADD COLUMN image_position text NOT NULL DEFAULT 'top';

-- Add a comment explaining the valid values
COMMENT ON COLUMN public.carousel_images.image_position IS 'CSS object-position value: top, center, bottom, or custom like "center 20%"';