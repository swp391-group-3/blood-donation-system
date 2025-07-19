--: Blog()

--! create
WITH blog AS (
    INSERT INTO blogs (account_id, title, description, content)
    VALUES (:account_id, :title, :description, :content)
    RETURNING id
),
new_tags AS (
    INSERT INTO tags (name)
    SELECT DISTINCT tag
    FROM UNNEST(:tags::text[]) AS tag
    ON CONFLICT DO NOTHING
    RETURNING id
),
existing_tags AS (
    SELECT id FROM tags
    WHERE name = ANY(:tags)
),
all_tags AS (
    SELECT id FROM new_tags
    UNION
    SELECT id FROM existing_tags
),
blog_tags_insert AS (
    INSERT INTO blog_tags (blog_id, tag_id)
    SELECT (SELECT id FROM blog), id
    FROM all_tags
)
SELECT id AS blog_id FROM blog;

--! get : Blog
SELECT 
    id,
    (SELECT name FROM accounts WHERE id = blogs.account_id) AS owner,
    (
        SELECT ARRAY(
            SELECT name FROM tags
            WHERE id IN (SELECT tag_id FROM blog_tags WHERE blog_id = :id)
        )
    ) AS tags,
    title,
    description,
    content,
    created_at
FROM blogs
WHERE id = :id;

--! get_all (query?, tag?) : Blog
SELECT 
    id,
    (SELECT name FROM accounts WHERE id = blogs.account_id) AS owner,
    (
        SELECT ARRAY(
            SELECT name FROM tags
            WHERE id IN (SELECT tag_id FROM blog_tags WHERE blog_id = blogs.id)
        )
    ) AS tags,
    title,
    description,
    content,
    created_at
FROM blogs
WHERE (
    :query::text IS NULL OR
    (title LIKE '%' || :query || '%' ) OR
    (description LIKE '%' || :query || '%' ) OR
    (content LIKE '%' || :query || '%' )
) AND (
    :tag::text is NULL OR
    EXISTS (
        SELECT 1
        FROM tags
        WHERE id IN (
            SELECT tag_id 
            FROM blog_tags 
            WHERE blog_id = blogs.id
        )
        AND name = :tag
    )
)
ORDER BY
    CASE WHEN :mode = 'Most Recent'  THEN created_at END DESC,
    CASE WHEN :mode = 'Oldest First' THEN created_at END ASC,
    CASE WHEN :mode = 'Title A-Z'    THEN title      END ASC
LIMIT  :page_size::int
OFFSET :page_size::int * :page_index::int;

--! update (title?, description?, content?)
UPDATE blogs
SET title = COALESCE(:title, title),
    description = COALESCE(:description, description),
    content = COALESCE(:content, content)
WHERE id = :id AND account_id = :account_id;

--! delete
DELETE FROM blogs
WHERE id = :id
AND (
    (SELECT role FROM accounts WHERE id = :account_id) = 'admin'::role
    OR account_id = :account_id
);
