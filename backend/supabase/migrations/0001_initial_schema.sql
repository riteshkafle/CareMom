-- Enable UUID extension
create extension if not exists "uuid-ossp" with schema extensions;

-- Create users profile table (links to auth.users)
create table public.profiles (
    id uuid references auth.users not null primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pregnancy profiles table
create table public.pregnancy_profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    gestational_age integer, -- in weeks or days
    risk_factors text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create symptom logs table
create table public.symptom_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    symptom_text text not null,
    structured_symptoms jsonb,
    severity integer, -- 1-10 or similar scale
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create appointments table
create table public.appointments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    doctor_id uuid not null, -- could reference a doctors table, keeping it simple for now as uuid
    appointment_time timestamp with time zone not null,
    status text default 'scheduled',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null 
);
