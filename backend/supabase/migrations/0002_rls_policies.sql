-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.pregnancy_profiles enable row level security;
alter table public.symptom_logs enable row level security;
alter table public.appointments enable row level security;

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

-- Pregnancy Profiles: Users can select/insert/update own profile
create policy "Users can view own pregnancy profile" on public.pregnancy_profiles
    for select using (auth.uid() = user_id);

create policy "Users can insert own pregnancy profile" on public.pregnancy_profiles
    for insert with check (auth.uid() = user_id);

create policy "Users can update own pregnancy profile" on public.pregnancy_profiles
    for update using (auth.uid() = user_id);

-- Symptom Logs: Users can select/insert own logs (typically you don't update logs but maybe allow it)
create policy "Users can view own symptom logs" on public.symptom_logs
    for select using (auth.uid() = user_id);

create policy "Users can insert own symptom logs" on public.symptom_logs
    for insert with check (auth.uid() = user_id);

create policy "Users can update own symptom logs" on public.symptom_logs
    for update using (auth.uid() = user_id);

-- Appointments: Users can view own appointments
create policy "Users can view own appointments" on public.appointments
    for select using (auth.uid() = user_id);
