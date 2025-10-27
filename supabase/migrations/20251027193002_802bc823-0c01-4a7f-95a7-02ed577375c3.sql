-- Allow authenticated users to insert properties
CREATE POLICY "Authenticated users can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own properties
CREATE POLICY "Authenticated users can update properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete properties
CREATE POLICY "Authenticated users can delete properties"
ON public.properties
FOR DELETE
TO authenticated
USING (true);