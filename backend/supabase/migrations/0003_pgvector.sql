-- Enable vector extension
create extension if not exists vector with schema extensions;

-- Drop tables if they exist so you can easily re-run this script
drop table if exists public.chat_memory;
drop table if exists public.medical_guidelines;

-- Create medical guidelines table
create table public.medical_guidelines (
    id uuid default uuid_generate_v4() primary key,
    content text not null,
    metadata jsonb,
    embedding vector(3072), -- Gemini models/embedding-001 output
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: We are dropping RLS entirely from this file for testing since we are using
-- the service_role key anyway, which bypasses RLS natively.

-- Create chat memory table
create table public.chat_memory (
    id uuid default uuid_generate_v4() primary key,
    -- Removed the foreign key constraint on users just for API testing since test users don't exist
    user_id uuid not null,
    role text not null check (role in ('user', 'assistant', 'system')),
    content text not null,
    embedding vector(3072),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
