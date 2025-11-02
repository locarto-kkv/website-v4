DROP VIEW total_product_summary;

CREATE VIEW public.total_product_summary AS
SELECT
    p.id AS product_id,
    p.name AS name,
    p.vendor_id AS vendor_id,
    p.quantity AS quantity,
    p.price AS price,
    p.weight AS weight,
    p.category AS category,
    p.product_images AS product_images,
    p.status AS status,
    p.description AS description,
    -- basic aggregations
    COUNT(DISTINCT o.id) AS orders_count,
    COUNT(DISTINCT o.consumer_id) AS consumers_count,
    SUM(o.amount) AS total_amount,
    AVG(o.amount) AS avg_amount,

    -- dynamic order_status counts
    (
      SELECT 
        COUNT(r.id)
        FROM public.reviews r
        LEFT JOIN public.orders o ON r.order_id = o.id
        WHERE o.product_id = p.id
    ) AS count_reviews,

    (
      SELECT 
        AVG(r.rating)
        FROM public.reviews r
        LEFT JOIN public.orders o ON r.order_id = o.id
        WHERE o.product_id = p.id
    ) AS avg_review,  

    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(o2.order_status, 'unknown') AS order_status, COUNT(*) AS count_status
        FROM public.orders o2
        WHERE o2.product_id = p.id
        GROUP BY COALESCE(o2.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    -- dynamic payment_mode counts
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(o3.payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_mode
        FROM public.orders o3
        WHERE o3.product_id = p.id
        GROUP BY COALESCE(o3.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    -- dynamic payment_status counts
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(o4.payment_status, 'unknown') AS payment_status, COUNT(*) AS count_status
        FROM public.orders o4
        WHERE o4.product_id = p.id
        GROUP BY COALESCE(o4.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts,

    -- consumer_list counts (list_type + quantity)
    (
      SELECT jsonb_object_agg(list_type, total_quantity)
      FROM (
        SELECT COALESCE(cl.list_type, 'unknown') AS list_type, SUM(cl.quantity) AS total_quantity
        FROM public.consumer_lists cl
        WHERE cl.product_id = p.id
        GROUP BY COALESCE(cl.list_type, 'unknown')
      ) s
    ) AS list_type_counts

FROM public.products p
LEFT JOIN public.orders o ON p.id = o.product_id
GROUP BY p.vendor_id, p.id, p.name, p.quantity;
