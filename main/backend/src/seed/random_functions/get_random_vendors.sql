drop function get_random_vendors(integer);

create or replace function get_random_vendors(limit_count int)
returns table (
  id int,
  created_at timestamptz,
  name text,
  email text,
  phone_no text,
  brand_logo_1 text,
  brand_logo_2 text,
  website text
)
language sql
volatile
as $$
  select id, created_at, name, email, phone_no, brand_logo_1, brand_logo_2, website
  from vendors
  where status = 'verified'
  order by random()
  limit limit_count;
$$;
