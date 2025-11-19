DROP VIEW IF EXISTS total_consumer_summary;

CREATE VIEW public.total_consumer_summary AS
SELECT
    c.id AS consumer_id,
    c.name AS consumer_name,

    /* --- DISTINCT PRODUCTS BOUGHT --- */
    (
      SELECT COUNT(DISTINCT oi.product_id)
      FROM public.orders o2
      JOIN public.order_items oi ON oi.order_id = o2.id
      WHERE o2.consumer_id = c.id
    ) AS products_count,

    /* --- DISTINCT ORDER COUNT --- */
    (
      SELECT COUNT(DISTINCT o2.id)
      FROM public.orders o2
      WHERE o2.consumer_id = c.id
    ) AS order_count,

    /* --- TOTAL AMOUNT (dedup orders) --- */
    (
      SELECT SUM(amount)
      FROM (
        SELECT DISTINCT o2.id, o2.amount
        FROM public.orders o2
        WHERE o2.consumer_id = c.id
      ) uniq_orders
    ) AS total_amount,

    (
      SELECT AVG(amount)
      FROM (
        SELECT DISTINCT o2.id, o2.amount
        FROM public.orders o2
        WHERE o2.consumer_id = c.id
      ) uniq_orders
    ) AS avg_amount,

    /* --- CATEGORY COUNTS --- */
    (
      SELECT jsonb_object_agg(category, count_category)
      FROM (
        SELECT COALESCE(p2.category, 'unknown') AS category,
               COUNT(*) AS count_category
        FROM public.orders o2
        JOIN public.order_items oi2 ON oi2.order_id = o2.id
        JOIN public.products p2 ON p2.id = oi2.product_id
        WHERE o2.consumer_id = c.id
        GROUP BY COALESCE(p2.category, 'unknown')
      ) s
    ) AS category_counts,

    /* --- ORDER STATUS COUNTS (order_items) --- */
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(oi3.order_status, 'unknown') AS order_status,
               COUNT(*) AS count_status
        FROM public.orders o3
        JOIN public.order_items oi3 ON oi3.order_id = o3.id
        WHERE o3.consumer_id = c.id
        GROUP BY COALESCE(oi3.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    /* --- PAYMENT MODE COUNTS --- */
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(o4.payment_mode, 'unknown') AS payment_mode,
               COUNT(*) AS count_mode
        FROM public.orders o4
        WHERE o4.consumer_id = c.id
        GROUP BY COALESCE(o4.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    /* --- PAYMENT STATUS COUNTS --- */
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(oi5.payment_status, 'unknown') AS payment_status,
               COUNT(*) AS count_status
        FROM public.orders o5
        JOIN public.order_items oi5 ON oi5.order_id = o5.id
        WHERE o5.consumer_id = c.id
        GROUP BY COALESCE(oi5.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts

FROM public.consumers c
WHERE EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.consumer_id = c.id
)
ORDER BY c.id;
