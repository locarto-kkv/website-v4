DROP VIEW IF EXISTS monthly_vendor_summary;

CREATE VIEW public.monthly_vendor_summary AS
WITH vendor_orders AS (
  SELECT
      v.id                            AS vendor_id,
      v.name                          AS vendor_name,
      p.id                            AS product_id,
      o.consumer_id                   AS consumer_id,
      COALESCE(p.category, 'unknown') AS category,
      o.id                            AS order_id,
      o.amount                        AS amount,
      oi.order_status                 AS order_status,
      o.payment_mode                  AS payment_mode,
      oi.payment_status               AS payment_status,
      DATE_TRUNC('month', o.created_at) AS order_month
  FROM public.vendors v
  LEFT JOIN public.products p 
         ON p.vendor_id = v.id
  LEFT JOIN public.order_items oi
         ON oi.product_id = p.id
  LEFT JOIN public.orders o
         ON o.id = oi.order_id
  WHERE o.id IS NOT NULL   -- ensures only months with real orders appear
)
SELECT
    vo.vendor_id,
    vo.vendor_name,
    vo.order_month,

    COUNT(DISTINCT vo.consumer_id) AS consumers_count,
    ARRAY_AGG(DISTINCT vo.consumer_id) FILTER (WHERE vo.consumer_id IS NOT NULL) AS consumer_ids,

    COUNT(DISTINCT vo.product_id) AS products_count,

    COUNT(DISTINCT vo.order_id) AS orders_count,

    /* --- prevent duplicate amounts using DISTINCT orders --- */
    (
      SELECT SUM(amount)
      FROM (
        SELECT DISTINCT o2.order_id, o2.amount
        FROM vendor_orders o2
        WHERE o2.vendor_id = vo.vendor_id
          AND o2.order_month = vo.order_month
      ) x
    ) AS total_amount,

    (
      SELECT AVG(amount)
      FROM (
        SELECT DISTINCT o2.order_id, o2.amount
        FROM vendor_orders o2
        WHERE o2.vendor_id = vo.vendor_id
          AND o2.order_month = vo.order_month
      ) x
    ) AS avg_amount,

    /* --- category counts --- */
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

    /* --- order status counts --- */
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(order_status, 'unknown') AS order_status,
               COUNT(*) AS count_status
        FROM vendor_orders
        WHERE vendor_id = vo.vendor_id
          AND order_month = vo.order_month
        GROUP BY COALESCE(order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    /* --- payment mode counts --- */
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(payment_mode, 'unknown') AS payment_mode,
               COUNT(*) AS count_mode
        FROM vendor_orders
        WHERE vendor_id = vo.vendor_id
          AND order_month = vo.order_month
        GROUP BY COALESCE(payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    /* --- payment status counts --- */
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(payment_status, 'unknown') AS payment_status,
               COUNT(*) AS count_status
        FROM vendor_orders
        WHERE vendor_id = vo.vendor_id
          AND order_month = vo.order_month
        GROUP BY COALESCE(payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM vendor_orders vo
GROUP BY vo.vendor_id, vo.vendor_name, vo.order_month
ORDER BY vo.vendor_id, vo.order_month;
