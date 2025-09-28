DROP VIEW weekly_consumer_summary;

CREATE VIEW public.weekly_consumer_summary AS
WITH consumer_orders AS (
  SELECT
  c.id AS consumer_id,
  c.name AS consumer_name,
    p.id AS product_id,
    p.name AS product_name,
    p.category AS category,
    o.id AS order_id,
    o.amount,
    o.order_status,
    o.payment_mode,
    o.payment_status,
    DATE_TRUNC('week', o.created_at) AS order_week
  FROM public.consumers c
  JOIN public.orders o ON c.id = o.consumer_id
  LEFT JOIN public.products p ON o.product_id = p.id
)
SELECT
    co.consumer_id AS consumer_id,
    co.consumer_name AS consumer_name,
    co.order_week AS order_week,
    -- basic aggregations
    COUNT(DISTINCT co.product_id) AS products_count,
    COUNT(co.order_id) AS orders_count,
    SUM(co.amount) AS total_amount,
    AVG(co.amount) AS avg_amount,

    -- dynamic categories
    (
      SELECT jsonb_object_agg(category, count_category)
      FROM (
        SELECT COALESCE(co2.category, 'unknown') AS category, COUNT(*) AS count_category
        FROM consumer_orders co2
        WHERE co2.consumer_id = co.consumer_id
          AND co2.order_week = co.order_week
        GROUP BY COALESCE(co2.category, 'unknown')
      ) s
    ) AS category_counts,

    -- dynamic order_status
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(co3.order_status, 'unknown') AS order_status, COUNT(*) AS count_status
        FROM consumer_orders co3
        WHERE co3.consumer_id = co.consumer_id
            AND co3.order_week = co.order_week
        GROUP BY COALESCE(co3.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    -- dynamic payment_mode
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(co4.payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_mode
        FROM consumer_orders co4
        WHERE co4.consumer_id = co.consumer_id
          AND co4.order_week = co.order_week
        GROUP BY COALESCE(co4.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    -- dynamic payment_status
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(co5.payment_status, 'unknown') AS payment_status, COUNT(*) AS count_status
        FROM consumer_orders co5
        WHERE co5.consumer_id = co.consumer_id
          AND co5.order_week = co.order_week
        GROUP BY COALESCE(co5.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM consumer_orders co
GROUP BY co.consumer_id, co.consumer_name, co.order_week;
