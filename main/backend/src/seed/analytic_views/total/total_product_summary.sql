DROP VIEW IF EXISTS total_product_summary;

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

    /* --- ORDER COUNTS (prevent duplication) --- */
    (
      SELECT COUNT(DISTINCT o.id)
      FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.product_id = p.id
    ) AS orders_count,

    /* --- CONSUMERS WHO BOUGHT THIS PRODUCT --- */
    (
      SELECT COUNT(DISTINCT o.consumer_id)
      FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.product_id = p.id
    ) AS consumers_count,

    /* --- TOTAL AMOUNT (must SUM DISTINCT orders) --- */
    (
      SELECT SUM(amount)
      FROM (
        SELECT DISTINCT o.id, o.amount
        FROM public.order_items oi 
        JOIN public.orders o ON o.id = oi.order_id
        WHERE oi.product_id = p.id
      ) uniq_orders
    ) AS total_amount,

    (
      SELECT AVG(amount)
      FROM (
        SELECT DISTINCT o.id, o.amount
        FROM public.order_items oi 
        JOIN public.orders o ON o.id = oi.order_id
        WHERE oi.product_id = p.id
      ) uniq_orders
    ) AS avg_amount,

    /* --- REVIEW COUNT (reviews reference order_items) --- */
    (
      SELECT COUNT(*)
      FROM public.reviews r
      JOIN public.order_items oi ON oi.id = r.order_item_id
      WHERE oi.product_id = p.id
    ) AS count_reviews,

    /* --- AVG REVIEW RATING --- */
    (
      SELECT AVG(r.rating)
      FROM public.reviews r
      JOIN public.order_items oi ON oi.id = r.order_item_id
      WHERE oi.product_id = p.id
    ) AS avg_review,

    /* --- ORDER STATUS COUNTS (FROM order_items) --- */
    (
      SELECT jsonb_object_agg(order_status, count_status)
      FROM (
        SELECT COALESCE(oi.order_status, 'unknown') AS order_status,
               COUNT(*) AS count_status
        FROM public.order_items oi
        WHERE oi.product_id = p.id
        GROUP BY COALESCE(oi.order_status, 'unknown')
      ) s
    ) AS order_status_counts,

    /* --- PAYMENT MODE COUNTS (FROM orders) --- */
    (
      SELECT jsonb_object_agg(payment_mode, count_mode)
      FROM (
        SELECT COALESCE(o.payment_mode, 'unknown') AS payment_mode,
               COUNT(*) AS count_mode
        FROM public.order_items oi
        JOIN public.orders o ON o.id = oi.order_id
        WHERE oi.product_id = p.id
        GROUP BY COALESCE(o.payment_mode, 'unknown')
      ) s
    ) AS payment_mode_counts,

    /* --- PAYMENT STATUS COUNTS (FROM order_items) --- */
    (
      SELECT jsonb_object_agg(payment_status, count_status)
      FROM (
        SELECT COALESCE(oi.payment_status, 'unknown') AS payment_status,
               COUNT(*) AS count_status
        FROM public.order_items oi
        WHERE oi.product_id = p.id
        GROUP BY COALESCE(oi.payment_status, 'unknown')
      ) s
    ) AS payment_status_counts,

    /* --- CONSUMER LIST COUNTS (wishlist / cart etc.) --- */
    (
      SELECT jsonb_object_agg(list_type, total_quantity)
      FROM (
        SELECT COALESCE(cl.list_type, 'unknown') AS list_type,
               SUM(cl.quantity) AS total_quantity
        FROM public.consumer_lists cl
        WHERE cl.product_id = p.id
        GROUP BY COALESCE(cl.list_type, 'unknown')
      ) s
    ) AS list_type_counts

FROM public.products p
GROUP BY p.id, p.vendor_id, p.name, p.quantity, p.price, p.weight,
         p.category, p.product_images, p.status, p.description
ORDER BY p.id;
