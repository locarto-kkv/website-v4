DROP VIEW IF EXISTS monthly_product_summary;

CREATE VIEW public.monthly_product_summary AS
WITH product_orders AS (
  SELECT
      v.id AS vendor_id,
      p.id AS product_id,
      p.name AS product_name,
      p.category AS category,
      o.id AS order_id,
      o.consumer_id AS consumer_id,
      o.amount AS amount,
      oi.order_status AS order_status,
      o.payment_mode AS payment_mode,
      oi.payment_status AS payment_status,
      DATE_TRUNC('month', o.created_at) AS order_month
  FROM public.products p
  LEFT JOIN public.order_items oi
         ON oi.product_id = p.id
  LEFT JOIN public.orders o
         ON o.id = oi.order_id
  LEFT JOIN public.vendors v
         ON v.id = p.vendor_id
  WHERE o.id IS NOT NULL   -- only return months where orders exist
)
SELECT
    po.vendor_id,
    po.product_id,
    po.product_name AS name,
    po.order_month,
    po.category,

    /* --- distinct orders to avoid duplicates --- */
    COUNT(DISTINCT po.order_id) AS orders_count,

    COUNT(DISTINCT po.consumer_id) AS consumers_count,

    /* --- dedup amount because orders can appear multiple times --- */
    (
      SELECT SUM(amount)
      FROM (
        SELECT DISTINCT o2.order_id, o2.amount
        FROM product_orders o2
        WHERE o2.product_id = po.product_id
          AND o2.order_month = po.order_month
      ) x
    ) AS total_amount,

    (
      SELECT AVG(amount)
      FROM (
        SELECT DISTINCT o2.order_id, o2.amount
        FROM product_orders o2
        WHERE o2.product_id = po.product_id
          AND o2.order_month = po.order_month
      ) x
    ) AS avg_amount,

    /* --- order_status counts (from order_items) --- */
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(po2.order_status, 'unknown') AS order_status,
               COUNT(*) AS count_status
        FROM product_orders po2
        WHERE po2.product_id = po.product_id
          AND po2.order_month = po.order_month
        GROUP BY COALESCE(po2.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    /* --- payment_mode counts (from orders) --- */
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(po3.payment_mode, 'unknown') AS payment_mode,
               COUNT(*) AS count_mode
        FROM product_orders po3
        WHERE po3.product_id = po.product_id
          AND po3.order_month = po.order_month
        GROUP BY COALESCE(po3.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    /* --- payment_status counts (from order_items) --- */
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(po4.payment_status, 'unknown') AS payment_status,
               COUNT(*) AS count_status
        FROM product_orders po4
        WHERE po4.product_id = po.product_id
          AND po4.order_month = po.order_month
        GROUP BY COALESCE(po4.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM product_orders po
GROUP BY 
    po.vendor_id, 
    po.product_id, 
    po.product_name, 
    po.category, 
    po.order_month
ORDER BY po.product_id, po.order_month;
