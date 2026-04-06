-- ============================================================
-- Rate limiting for inquiry submissions
-- Prevents more than 5 inquiries per email per hour
-- ============================================================

create or replace function public.check_inquiry_rate_limit()
returns trigger as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.inquiries
  where email = new.email
    and created_at > now() - interval '1 hour';

  if recent_count >= 5 then
    raise exception 'Rate limit exceeded. Please try again later.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger inquiry_rate_limit
  before insert on public.inquiries
  for each row execute function public.check_inquiry_rate_limit();
