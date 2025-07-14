--: Comment()

--! create
INSERT INTO comments(blog_id, account_id, content)
VALUES(:blog_id, :account_id, :content)
RETURNING id;

--! get_by_blog_id : Comment
SELECT
    id,
    blog_id,
    (
        SELECT name
        FROM accounts
        WHERE id = comments.account_id
    ) AS owner,
    content,
    created_at
FROM comments
WHERE blog_id = :blog_id
ORDER BY created_at DESC;

--! delete
DELETE FROM comments
WHERE id = :id
AND account_id = :account_id;

--! update(content?)
UPDATE comments
SET content = COALESCE(:content, content)
WHERE id = :id;
