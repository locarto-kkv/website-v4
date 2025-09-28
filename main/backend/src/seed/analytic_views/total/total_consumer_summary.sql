DROP VIEW total_consumer_summary;

CREATE VIEW public.total_consumer_summary AS
SELECT
    c.id AS consumer_id,
    c.name AS consumer_name,
    -- basic aggregations
    COUNT(DISTINCT o.product_id) AS products_count,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_amount,
    AVG(o.amount) AS avg_amount,

    -- dynamic categories
    (
      SELECT jsonb_object_agg(category, count_category)
      FROM (
        SELECT COALESCE(p2.category, 'unknown') AS category, COUNT(*) AS count_category
        FROM public.orders o2
        JOIN public.products p2 ON o2.product_id = p2.id
        WHERE o2.consumer_id = c.id
        GROUP BY COALESCE(p2.category, 'unknown')
      ) s
    ) AS category_counts,

    -- dynamic order_status
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(o3.order_status, 'unknown') AS order_status, COUNT(*) AS count_status
        FROM public.orders o3
        WHERE o3.consumer_id = c.id
        GROUP BY COALESCE(o3.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    -- dynamic payment_mode
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(o4.payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_mode
        FROM public.orders o4
        WHERE o4.consumer_id = c.id
        GROUP BY COALESCE(o4.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    -- dynamic payment_status
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(o5.payment_status, 'unknown') AS payment_status, COUNT(*) AS count_status
        FROM public.orders o5
        WHERE o5.consumer_id = c.id
        GROUP BY COALESCE(o5.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM public.consumers c
  JOIN public.orders o ON c.id = o.consumer_id
  JOIN public.products p ON o.product_id = p.id
GROUP BY c.id, c.name;
