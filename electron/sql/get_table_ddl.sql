-- get_ddl_postgres.sql

WITH columns AS (
    SELECT 
        a.attname AS column_name,
        pg_catalog.format_type(a.atttypid, a.atttypmod) AS column_type,
        CASE WHEN a.attnotnull THEN 'NOT NULL' ELSE '' END AS not_null,
        CASE WHEN a.atthasdef THEN pg_catalog.pg_get_expr(ad.adbin, ad.adrelid) ELSE '' END AS default_value
    FROM 
        pg_catalog.pg_attribute a
    JOIN 
        pg_catalog.pg_class c ON a.attrelid = c.oid
    JOIN 
        pg_catalog.pg_namespace n ON c.relnamespace = n.oid
    LEFT JOIN 
        pg_catalog.pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
    WHERE 
        c.relname = '$$TABLE$$'
        AND a.attnum > 0
        AND NOT a.attisdropped
)
SELECT 
    'CREATE TABLE ' || '$$TABLE$$' || ' (' || 
    string_agg(column_name || ' ' || column_type || ' ' || default_value || ' ' || not_null, ', ') || ');'
AS ddl
FROM 
    columns;
