-- Induction Lab classroom tracking
-- Students use invisible anonymous Supabase Auth sessions. Teachers use email sign-in.

create table if not exists public.class_sessions (
  id bigint generated always as identity primary key,
  join_code text not null unique,
  teacher_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Induction Lab',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '8 hours'),
  constraint class_sessions_join_code_format check (join_code ~ '^[A-Z2-9]{6}$'),
  constraint class_sessions_title_length check (char_length(btrim(title)) between 1 and 80),
  constraint class_sessions_expiry_after_creation check (expires_at > created_at)
);

create table if not exists public.participants (
  id bigint generated always as identity primary key,
  session_id bigint not null references public.class_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  stage text not null default 'play',
  disc_count smallint not null default 3,
  move_count integer not null default 0,
  hint_count integer not null default 0,
  completed boolean not null default false,
  notice_answer text,
  prove_answer text,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint participants_session_user_unique unique (session_id, user_id),
  constraint participants_display_name_length check (char_length(btrim(display_name)) between 1 and 32),
  constraint participants_stage_valid check (stage in ('play', 'notice', 'prove', 'debrief')),
  constraint participants_disc_count_valid check (disc_count between 2 and 5),
  constraint participants_move_count_valid check (move_count >= 0),
  constraint participants_hint_count_valid check (hint_count >= 0),
  constraint participants_notice_answer_valid check (notice_answer is null or notice_answer in ('possible', 'minimum')),
  constraint participants_prove_answer_valid check (prove_answer is null or prove_answer in ('some', 'all'))
);

create index if not exists class_sessions_teacher_id_idx
  on public.class_sessions (teacher_id, created_at desc);

create index if not exists class_sessions_active_code_idx
  on public.class_sessions (join_code)
  where is_active = true;

create index if not exists participants_session_id_idx
  on public.participants (session_id, updated_at desc);

create index if not exists participants_user_id_idx
  on public.participants (user_id);

create or replace function public.set_induction_lab_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists participants_set_updated_at on public.participants;
create trigger participants_set_updated_at
before update on public.participants
for each row execute function public.set_induction_lab_updated_at();

create or replace function public.join_induction_class(
  p_join_code text,
  p_display_name text
)
returns table (
  participant_id bigint,
  class_session_id bigint,
  session_title text,
  participant_name text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session_id bigint;
  v_session_title text;
  v_participant_id bigint;
  v_participant_name text := btrim(p_display_name);
begin
  if v_user_id is null then
    raise exception 'An authenticated browser session is required.';
  end if;

  if char_length(v_participant_name) < 1 or char_length(v_participant_name) > 32 then
    raise exception 'Choose a display name between 1 and 32 characters.';
  end if;

  select s.id, s.title
    into v_session_id, v_session_title
  from public.class_sessions as s
  where s.join_code = upper(btrim(p_join_code))
    and s.is_active = true
    and s.expires_at > now()
  limit 1;

  if v_session_id is null then
    raise exception 'No active class was found for that code.';
  end if;

  insert into public.participants (session_id, user_id, display_name)
  values (v_session_id, v_user_id, v_participant_name)
  on conflict (session_id, user_id)
  do update set display_name = excluded.display_name
  returning id, display_name
    into v_participant_id, v_participant_name;

  return query
  select v_participant_id, v_session_id, v_session_title, v_participant_name;
end;
$$;

alter table public.class_sessions enable row level security;
alter table public.participants enable row level security;

drop policy if exists "Teachers read their class sessions" on public.class_sessions;
create policy "Teachers read their class sessions"
on public.class_sessions for select
to authenticated
using (
  teacher_id = (select auth.uid())
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

drop policy if exists "Teachers create class sessions" on public.class_sessions;
create policy "Teachers create class sessions"
on public.class_sessions for insert
to authenticated
with check (
  teacher_id = (select auth.uid())
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

drop policy if exists "Teachers update their class sessions" on public.class_sessions;
create policy "Teachers update their class sessions"
on public.class_sessions for update
to authenticated
using (
  teacher_id = (select auth.uid())
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
)
with check (
  teacher_id = (select auth.uid())
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

drop policy if exists "Teachers delete their class sessions" on public.class_sessions;
create policy "Teachers delete their class sessions"
on public.class_sessions for delete
to authenticated
using (
  teacher_id = (select auth.uid())
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

drop policy if exists "Students read their own progress" on public.participants;
create policy "Students read their own progress"
on public.participants for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Teachers read progress in their sessions" on public.participants;
create policy "Teachers read progress in their sessions"
on public.participants for select
to authenticated
using (
  exists (
    select 1
    from public.class_sessions as s
    where s.id = participants.session_id
      and s.teacher_id = (select auth.uid())
      and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
  )
);

drop policy if exists "Students update their own progress" on public.participants;
create policy "Students update their own progress"
on public.participants for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on table public.class_sessions from anon, authenticated;
revoke all on table public.participants from anon, authenticated;
revoke all on function public.join_induction_class(text, text) from public, anon;

grant select, insert, update, delete on table public.class_sessions to authenticated;
grant select on table public.participants to authenticated;
grant update (
  stage,
  disc_count,
  move_count,
  hint_count,
  completed,
  notice_answer,
  prove_answer
) on table public.participants to authenticated;
grant usage, select on sequence public.class_sessions_id_seq to authenticated;
grant execute on function public.join_induction_class(text, text) to authenticated;

alter table public.participants replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'participants'
  ) then
    alter publication supabase_realtime add table public.participants;
  end if;
end;
$$;

