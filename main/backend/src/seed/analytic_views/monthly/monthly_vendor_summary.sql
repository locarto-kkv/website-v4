DROP VIEW monthly_vendor_summary;

CREATE VIEW public.monthly_vendor_summary AS
WITH vendor_orders AS (
  SELECT
    v.id                           AS vendor_id,
    v.name                         AS vendor_name,
    p.id                           AS product_id,
    COALESCE(p.category, 'unknown') AS category,
    o.id                           AS order_id,
    o.amount,
    o.order_status,
    o.payment_mode,
    o.payment_status,
    DATE_TRUNC('month', o.created_at) AS order_month
  FROM public.vendors v
  LEFT JOIN public.products p ON v.id = p.vendor_id
  JOIN public.orders o   ON p.id = o.product_id
)
SELECT
  vo.vendor_id,
  vo.vendor_name,
  vo.order_month,

  COUNT(DISTINCT vo.product_id) AS products_count,
  COUNT(vo.order_id)          AS orders_count,
  SUM(vo.amount)              AS total_amount,
  AVG(vo.amount)              AS avg_amount,

  -- category counts for that vendor-month
  (
    SELECT jsonb_object_agg(category, count_category)
    FROM (
      SELECT category, COUNT(*) AS count_category
      FROM vendor_orders
      WHERE vendor_id = vo.vendor_id
        AND order_month = vo.order_month
      GROUP BY category
    ) s
  ) AS category_count,

  -- order_status counts for that vendor-month
  (
    SELECT jsonb_object_agg(order_status, count_status)
    FROM (
      SELECT COALESCE(order_status, 'unknown') AS order_status, COUNT(*) AS count_status
      FROM vendor_orders
      WHERE vendor_id = vo.vendor_id
        AND order_month = vo.order_month
      GROUP BY COALESCE(order_status, 'unknown')
    ) s
  ) AS order_status_counts,

  -- payment_mode counts for that vendor-month
  (
    SELECT jsonb_object_agg(payment_mode, count_mode)
    FROM (
      SELECT COALESCE(payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_mode
      FROM vendor_orders
      WHERE vendor_id = vo.vendor_id
        AND order_month = vo.order_month
      GROUP BY COALESCE(payment_mode, 'unknown')
    ) s
  ) AS payment_mode_counts,

  -- payment_status counts for that vendor-month
  (
    SELECT jsonb_object_agg(payment_status, count_status)
    FROM (
      SELECT COALESCE(payment_status, 'unknown') AS payment_status, COUNT(*) AS count_status
      FROM vendor_orders
      WHERE vendor_id = vo.vendor_id
        AND order_month = vo.order_month
      GROUP BY COALESCE(payment_status, 'unknown')
    ) s
  ) AS payment_status_counts

FROM vendor_orders vo
GROUP BY vo.vendor_id, vo.vendor_name, vo.order_month
ORDER BY vo.vendor_id, vo.order_month;
