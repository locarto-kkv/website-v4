create or replace function get_random_products(limit_count int)
returns setof products
language sql
volatile
as $$
  select * from products
  order by random()
  limit limit_count;
$$;
