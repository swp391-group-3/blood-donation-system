--: Comment()

--! create
INSERT INTO comments(blog_id, account_id, content)
VALUES(:blog_id, :account_id, :content)
RETURNING id;

--! get_by_blog_id : Comment
SELECT * FROM comments
WHERE blog_id = :blog_id;

--! delete
DELETE FROM comments
WHERE id = :id;

--! update(content?)
UPDATE comments
SET content = COALESCE(:content, content)
WHERE id = :id;
