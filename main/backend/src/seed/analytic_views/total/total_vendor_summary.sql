DROP VIEW total_vendor_summary;

CREATE VIEW public.total_vendor_summary AS
SELECT v.id AS vendor_id,
       v.name AS vendor_name,
       COUNT(DISTINCT p.id) AS products_count,
       SUM(o.amount) AS total_amount,
       COUNT(o.id) AS orders_count,
       AVG (o.amount) AS average_amount,

    (
      SELECT jsonb_object_agg(category, count_category)
      FROM (
        SELECT category, COUNT(*) AS count_category
        FROM public.products p2
          JOIN public.vendors v2 ON p2.vendor_id = v2.id
        WHERE v2.id = v.id
        GROUP BY category
      ) s
    ) AS category_count,

    (
    SELECT jsonb_object_agg(order_status, count_order_status)
    FROM (
      SELECT COALESCE(o3.order_status, 'unknown') AS order_status, COUNT(*) AS count_order_status
      FROM public.vendors v3
        JOIN public.products p3 ON p3.vendor_id = v3.id
        JOIN public.orders o3 ON o3.product_id = p3.id
      WHERE v3.id = v.id
      GROUP BY COALESCE(o3.order_status, 'unknown')
    ) s
  ) AS order_status_counts,

  (
    SELECT jsonb_object_agg(payment_mode, count_payment_mode)
    FROM (
      SELECT COALESCE(o4.payment_mode, 'unknown') AS payment_mode, COUNT(*) AS count_payment_mode
      FROM public.vendors v4
        JOIN public.products p4 ON p4.vendor_id = v4.id
        JOIN public.orders o4 ON o4.product_id = p4.id
      WHERE v4.id = v.id
      GROUP BY COALESCE(o4.payment_mode, 'unknown')
    ) s
  ) AS payment_mode_counts,

  (
    SELECT jsonb_object_agg(payment_status, count_payment_status)
    FROM (
      SELECT COALESCE(o5.payment_status, 'unknown') AS payment_status, COUNT(*) AS count_payment_status
      FROM public.vendors v5
        JOIN public.products p5 ON p5.vendor_id = v5.id
        JOIN public.orders o5 ON o5.product_id = p5.id
      WHERE v5.id = v.id
      GROUP BY COALESCE(o5.payment_status, 'unknown')
    ) s
  ) AS payment_status_counts


FROM vendors v
LEFT JOIN products p ON p.vendor_id = v.id
LEFT JOIN orders o ON o.product_id = p.id
GROUP BY v.id, v.name
ORDER BY v.id;
