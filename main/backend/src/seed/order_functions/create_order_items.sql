create or replace function create_order_items(itemsData jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  item jsonb;
  product_row record;
  product_snapshot jsonb;

  new_row order_items%rowtype;
  inserted_items jsonb := '[]'::jsonb;

  order_id bigint;
  product_id bigint;
  quantity numeric;
  payment_status text;
  support_status text;
  order_status text;

begin
  -- Loop through the array: itemsData = [ {...}, {...} ]
  for item in
    select * from jsonb_array_elements(itemsData)
  loop
    -- Extract fields for this item
    product_id := (item->>'product_id')::bigint;
    quantity := coalesce((item->>'quantity')::numeric, 1);
    payment_status := item->>'payment_status';
    support_status := item->>'support_status';
    order_status := item->>'order_status';
    order_id := (item->>'order_id')::bigint;

    if product_id is null then
      raise exception 'product_id missing in order_items payload';
    end if;

    if order_id is null then
      raise exception 'order_id missing in order_items payload';
    end if;

    -- Fetch the product row
    select *
    into product_row
    from products
    where id = product_id;

    if not found then
      raise exception 'Product % not found', product_id;
    end if;

    -- Build the snapshot JSON
    product_snapshot := jsonb_build_object(
      'product_id', product_row.id,
      'name', product_row.name,
      'price', product_row.price,
      'quantity', product_row.quantity,
      'category', product_row.category,
      'status', product_row.status,
      'description', product_row.description,
      'product_images', product_row.product_images,
      'weight', product_row.weight,
      'attribute_type', product_row.attribute_type,
      'attribute_name', product_row.attribute_name,
      'base', product_row.base,
      'product_uuid', product_row.product_uuid,
      'return_refund', product_row.return_refund,
      'replace', product_row.replace,
      'cod', product_row.cod,
      'vendor_id', product_row.vendor_id
    );

    -- Insert order_item row
    insert into order_items (
      order_id,
      product_id,
      quantity,
      payment_status,
      support_status,
      order_status,
      product_info
    )
    values (
      order_id,
      product_id,
      quantity,
      payment_status,
      support_status,
      order_status,
      product_snapshot
    )
    returning * into new_row;

    -- Append returned row to JS array
    inserted_items := inserted_items || to_jsonb(new_row);
  end loop;

  -- Return inserted rows
  return inserted_items;

exception
  when others then
    raise;
end;
$$;
