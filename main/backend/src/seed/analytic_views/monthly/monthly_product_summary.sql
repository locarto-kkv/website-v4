DROP VIEW monthly_product_summary;

CREATE VIEW public.monthly_product_summary AS
WITH product_orders AS (
  SELECT
  v.id AS vendor_id,
    p.id AS product_id,
    p.name AS product_name,
    p.category AS category,
    o.id AS order_id,
    o.consumer_id AS consumer_id,
    o.amount,
    o.order_status,
    o.payment_mode,
    o.payment_status,
    DATE_TRUNC('month', o.created_at) AS order_month
  FROM public.products p
  JOIN public.orders o ON p.id = o.product_id
  LEFT JOIN public.vendors v ON p.vendor_id = v.id
)
SELECT
    po.vendor_id AS vendor_id,
    po.product_id AS product_id,
    po.product_name AS product_name,
    po.order_month AS order_month,
    -- basic aggregations
    COUNT(DISTINCT po.order_id) AS orders_count,
    COUNT(DISTINCT po.consumer_id) AS consumers_count,
    SUM(po.amount) AS total_amount,
    AVG(po.amount) AS avg_amount,

    -- dynamic order_status counts
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(po2.order_status, 'unknown') AS order_status, COUNT(*) AS count_status
        FROM product_orders po2
        WHERE po2.product_id = po.product_id
          AND po2.order_month = po.order_month
        GROUP BY COALESCE(po2.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    -- dynamic payment_mode counts
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(po3.payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_mode
        FROM product_orders po3
        WHERE po3.product_id = po.product_id
          AND po3.order_month = po.order_month
        GROUP BY COALESCE(po3.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    -- dynamic payment_status counts
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(po4.payment_status, 'unknown') AS payment_status, COUNT(*) AS count_status
        FROM product_orders po4
        WHERE po4.product_id = po.product_id
          AND po4.order_month = po.order_month
        GROUP BY COALESCE(po4.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM product_orders po
GROUP BY po.vendor_id, po.product_id, po.product_name, po.category, po.order_month;
