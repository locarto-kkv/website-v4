create or replace function create_order(payload jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  payment_mode text;
  amount numeric;
  delivery_fee numeric;
  delivery_date timestamptz;
  payment_date timestamptz;
  consumer_address_id bigint;
  vendor_address_id bigint;

  consumer_json jsonb;
  consumer_addr_json jsonb;
  vendor_json jsonb;
  vendor_addr_json jsonb;

  order_row orders%rowtype;
begin
  -- extract fields
  payment_mode := payload->>'payment_mode';
  amount := (payload->>'amount')::numeric;
  delivery_fee := coalesce((payload->>'delivery_fee')::numeric, 0);
  
  delivery_date :=
    case when payload->>'delivery_date' is null
      then null
    else (payload->>'delivery_date')::timestamptz end;

  payment_date :=
    case when payload->>'payment_date' is null
      then null
    else (payload->>'payment_date')::timestamptz end;

  consumer_address_id := (payload->>'consumer_address_id')::bigint;
  vendor_address_id := (payload->>'vendor_address_id')::bigint;

  if consumer_address_id is null then
    raise exception 'consumer_address_id is required';
  end if;

  if vendor_address_id is null then
    raise exception 'vendor_address_id is required';
  end if;

  -- Load consumer address snapshot
  select to_jsonb(a.*) into consumer_addr_json
  from addresses a where a.id = consumer_address_id;

  if consumer_addr_json is null then
    raise exception 'Consumer address % not found', consumer_address_id;
  end if;

  -- Load consumer using address.consumer_id
  select to_jsonb(c.*) into consumer_json
  from consumers c
  where c.id = (consumer_addr_json->>'consumer_id')::bigint;

  if consumer_json is null then
    raise exception 'Consumer linked to address % not found', consumer_address_id;
  end if;

  -- Load vendor address snapshot
  select to_jsonb(a.*) into vendor_addr_json
  from addresses a where a.id = vendor_address_id;

  if vendor_addr_json is null then
    raise exception 'Vendor address % not found', vendor_address_id;
  end if;

  -- Load vendor using address.vendor_id
  select to_jsonb(v.*) into vendor_json
  from vendors v
  where v.id = (vendor_addr_json->>'vendor_id')::bigint;

  if vendor_json is null then
    raise exception 'Vendor linked to address % not found', vendor_address_id;
  end if;

  -- Insert order row with snapshots
  insert into orders (
    consumer_id,
    delivery_date,
    payment_mode,
    amount,
    payment_date,
    vendor_address_id,
    consumer_address_id,
    delivery_fee,
    consumer_profile,
    vendor_profile
  )
  values (
    (consumer_json->>'id')::bigint,
    delivery_date,
    payment_mode,
    amount,
    payment_date,
    vendor_address_id,
    consumer_address_id,
    delivery_fee,
    jsonb_build_object(
      'consumer', consumer_json,
      'consumer_address', consumer_addr_json
    ),
    jsonb_build_object(
      'vendor', vendor_json,
      'vendor_address', vendor_addr_json
    )
      )
  returning * into order_row;

  -- return new row as json
  return to_jsonb(order_row);

exception
  when others then
    raise;
end;
$$;
