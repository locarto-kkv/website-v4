DROP VIEW IF EXISTS total_vendor_summary;

CREATE VIEW public.total_vendor_summary AS
SELECT 
    v.id AS vendor_id,
    v.name AS vendor_name,

    -- total products for this vendor
    COUNT(DISTINCT p.id) AS products_count,

    -- all consumers who ordered this vendor’s products
    ARRAY_AGG(DISTINCT o.consumer_id) 
        FILTER (WHERE o.consumer_id IS NOT NULL) AS consumer_ids,

    -- order amounts
    COUNT(DISTINCT o.id) AS orders_count,
    AVG(o.amount) AS average_amount,
(
  SELECT SUM(amount)
  FROM (
    SELECT DISTINCT o2.id, o2.amount
    FROM public.products p2
    JOIN public.order_items oi2 ON oi2.product_id = p2.id
    JOIN public.orders o2 ON o2.id = oi2.order_id
    WHERE p2.vendor_id = v.id
  ) o2
) AS total_amount,

    -- category distribution for vendor products
    (
      SELECT jsonb_object_agg(category, count_category)
      FROM (
        SELECT category, COUNT(*) AS count_category
        FROM public.products p2
        WHERE p2.vendor_id = v.id
        GROUP BY category
      ) s
    ) AS category_count,

    -- order status counts (via order_items)
    (
      SELECT jsonb_object_agg(order_status, count_order_status)
      FROM (
        SELECT COALESCE(oi2.order_status, 'unknown') AS order_status,
               COUNT(*) AS count_order_status
        FROM public.products p2
        JOIN public.order_items oi2 ON oi2.product_id = p2.id
        WHERE p2.vendor_id = v.id
        GROUP BY COALESCE(oi2.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    -- payment mode counts (via orders)
    (
      SELECT jsonb_object_agg(payment_mode, count_payment_mode)
      FROM (
        SELECT COALESCE(o2.payment_mode, 'unknown') AS payment_mode,
               COUNT(*) AS count_payment_mode
        FROM public.products p2
        JOIN public.order_items oi2 ON oi2.product_id = p2.id
        JOIN public.orders o2 ON o2.id = oi2.order_id
        WHERE p2.vendor_id = v.id
        GROUP BY COALESCE(o2.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    -- payment status counts (via order_items)
    (
      SELECT jsonb_object_agg(payment_status, count_payment_status)
      FROM (
        SELECT COALESCE(oi3.payment_status, 'unknown') AS payment_status,
               COUNT(*) AS count_payment_status
        FROM public.products p2
        JOIN public.order_items oi3 ON oi3.product_id = p2.id
        WHERE p2.vendor_id = v.id
        GROUP BY COALESCE(oi3.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM public.vendors v
LEFT JOIN public.products p ON p.vendor_id = v.id
LEFT JOIN public.order_items oi ON oi.product_id = p.id
LEFT JOIN public.orders o ON o.id = oi.order_id
GROUP BY v.id, v.name
ORDER BY v.id;
