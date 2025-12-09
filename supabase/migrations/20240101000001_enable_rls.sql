-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_receipts ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Allow users to view all profiles
CREATE POLICY "Users profiles are viewable by everyone"
ON public.users FOR SELECT
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Allow authenticated users to insert their profile
CREATE POLICY "Users can insert own profile"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Channels table policies
-- Public channels are viewable by everyone
CREATE POLICY "Public channels are viewable by everyone"
ON public.channels FOR SELECT
USING (is_private = false);

-- Private channels are viewable by members only
CREATE POLICY "Private channels are viewable by members"
ON public.channels FOR SELECT
USING (
    is_private = true 
    AND EXISTS (
        SELECT 1 FROM public.channel_members 
        WHERE channel_id = channels.id 
        AND user_id = auth.uid()
    )
);

-- Users can create channels
CREATE POLICY "Authenticated users can create channels"
ON public.channels FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Channel owners and admins can update channels
CREATE POLICY "Channel owners and admins can update"
ON public.channels FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = channels.id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
);

-- Channel owners can delete channels
CREATE POLICY "Channel owners can delete"
ON public.channels FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = channels.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
);

-- Channel members table policies
-- Members can view channel membership
CREATE POLICY "Channel members can view membership"
ON public.channel_members FOR SELECT
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.channel_members cm
        WHERE cm.channel_id = channel_members.channel_id
        AND cm.user_id = auth.uid()
    )
);

-- Users can join public channels
CREATE POLICY "Users can join public channels"
ON public.channel_members FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.channels
        WHERE id = channel_id
        AND is_private = false
    )
);

-- Admins can add members to private channels
CREATE POLICY "Admins can add members to private channels"
ON public.channel_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = channel_members.channel_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
);

-- Users can leave channels (delete their membership)
CREATE POLICY "Users can leave channels"
ON public.channel_members FOR DELETE
USING (user_id = auth.uid());

-- Admins can remove members
CREATE POLICY "Admins can remove members"
ON public.channel_members FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.channel_members cm
        WHERE cm.channel_id = channel_members.channel_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin')
    )
);

-- Direct messages table policies
-- Users can view their own DMs
CREATE POLICY "Users can view their DMs"
ON public.direct_messages FOR SELECT
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Users can create DMs
CREATE POLICY "Users can create DMs"
ON public.direct_messages FOR INSERT
WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Messages table policies
-- Users can view messages in channels they're members of
CREATE POLICY "Members can view channel messages"
ON public.messages FOR SELECT
USING (
    channel_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = messages.channel_id
        AND user_id = auth.uid()
    )
);

-- Users can view DM messages they're part of
CREATE POLICY "Users can view DM messages"
ON public.messages FOR SELECT
USING (
    dm_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.direct_messages
        WHERE id = messages.dm_id
        AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
);

-- Users can send messages to channels they're members of
CREATE POLICY "Members can send channel messages"
ON public.messages FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND channel_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.channel_members
        WHERE channel_id = messages.channel_id
        AND user_id = auth.uid()
    )
);

-- Users can send DM messages
CREATE POLICY "Users can send DM messages"
ON public.messages FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND dm_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.direct_messages
        WHERE id = messages.dm_id
        AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
);

-- Users can update their own messages
CREATE POLICY "Users can edit own messages"
ON public.messages FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.messages FOR DELETE
USING (user_id = auth.uid());

-- Message attachments table policies
-- Inherit permissions from messages
CREATE POLICY "Attachments viewable if message is viewable"
ON public.message_attachments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.messages
        WHERE id = message_attachments.message_id
        AND (
            (channel_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.channel_members
                WHERE channel_id = messages.channel_id
                AND user_id = auth.uid()
            ))
            OR
            (dm_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.direct_messages
                WHERE id = messages.dm_id
                AND (user1_id = auth.uid() OR user2_id = auth.uid())
            ))
        )
    )
);

-- Users can add attachments to their messages
CREATE POLICY "Users can add attachments to own messages"
ON public.message_attachments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.messages
        WHERE id = message_attachments.message_id
        AND user_id = auth.uid()
    )
);

-- Users can delete attachments from their messages
CREATE POLICY "Users can delete own attachments"
ON public.message_attachments FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.messages
        WHERE id = message_attachments.message_id
        AND user_id = auth.uid()
    )
);

-- Read receipts table policies
-- Users can view read receipts for messages they can see
CREATE POLICY "Users can view read receipts"
ON public.read_receipts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.messages
        WHERE id = read_receipts.message_id
        AND (
            (channel_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.channel_members
                WHERE channel_id = messages.channel_id
                AND user_id = auth.uid()
            ))
            OR
            (dm_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.direct_messages
                WHERE id = messages.dm_id
                AND (user1_id = auth.uid() OR user2_id = auth.uid())
            ))
        )
    )
);

-- Users can mark messages as read
CREATE POLICY "Users can mark messages as read"
ON public.read_receipts FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.messages
        WHERE id = read_receipts.message_id
        AND (
            (channel_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.channel_members
                WHERE channel_id = messages.channel_id
                AND user_id = auth.uid()
            ))
            OR
            (dm_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.direct_messages
                WHERE id = messages.dm_id
                AND (user1_id = auth.uid() OR user2_id = auth.uid())
            ))
        )
    )
);

-- Users can update their own read receipts
CREATE POLICY "Users can update own read receipts"
ON public.read_receipts FOR UPDATE
USING (user_id = auth.uid());