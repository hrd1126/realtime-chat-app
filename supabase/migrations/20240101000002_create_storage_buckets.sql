-- Create storage buckets for avatars and message attachments
-- Note: These SQL commands create the bucket structure
-- Storage policies are defined separately

-- Create avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,  -- Public bucket for avatar images
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create message-attachments bucket for file uploads in messages
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
    'message-attachments',
    'message-attachments',
    false,  -- Private bucket, access controlled by policies
    52428800  -- 50MB limit
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
-- Allow public read access
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for message-attachments bucket
-- Allow access to attachments if user can access the message
CREATE POLICY "Users can view message attachments they have access to"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'message-attachments'
    AND (
        -- Extract message_id from the path (format: channel_id/message_id/filename or dm_id/message_id/filename)
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id::text = (storage.foldername(name))[2]
            AND (
                -- Channel message access
                (m.channel_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.channel_members cm
                    WHERE cm.channel_id = m.channel_id
                    AND cm.user_id = auth.uid()
                ))
                OR
                -- DM message access
                (m.dm_id IS NOT NULL AND EXISTS (
                    SELECT 1 FROM public.direct_messages dm
                    WHERE dm.id = m.dm_id
                    AND (dm.user1_id = auth.uid() OR dm.user2_id = auth.uid())
                ))
            )
        )
    )
);

-- Allow users to upload attachments to their own messages
CREATE POLICY "Users can upload attachments to their messages"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'message-attachments'
    AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id::text = (storage.foldername(name))[2]
        AND m.user_id = auth.uid()
    )
);

-- Allow users to delete attachments from their own messages
CREATE POLICY "Users can delete their message attachments"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'message-attachments'
    AND EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id::text = (storage.foldername(name))[2]
        AND m.user_id = auth.uid()
    )
);