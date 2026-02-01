-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;

-- Create a PERMISSIVE policy for public SELECT access (default is PERMISSIVE)
CREATE POLICY "Anyone can view active announcements"
ON public.announcements
FOR SELECT
USING (is_active = true);

-- Also fix carousel_images table
DROP POLICY IF EXISTS "Anyone can view active carousel images" ON public.carousel_images;

CREATE POLICY "Anyone can view active carousel images"
ON public.carousel_images
FOR SELECT
USING (is_active = true);

-- Also fix staff_members table
DROP POLICY IF EXISTS "Anyone can view active staff members" ON public.staff_members;

CREATE POLICY "Anyone can view active staff members"
ON public.staff_members
FOR SELECT
USING (is_active = true);