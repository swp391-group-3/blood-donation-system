--: Blog()

--! create
 INSERT INTO blogs (account_id, title, description, content)
 VALUES (:account_id, :title, :description, :content)
 RETURNING id;

--! add_tag
INSERT INTO blog_tags (blog_id, tag_id)
VALUES (:blog_id, :tag_id);

--! get : Blog
SELECT 
    id,
    (SELECT name FROM accounts WHERE id = blogs.account_id) AS name,
    title,
    description,
    content,
    created_at
FROM blogs
WHERE id = :id;

--! get_all (content?) : Blog
SELECT 
    id,
    (SELECT name FROM accounts WHERE id = blogs.account_id) AS name,
    title,
    description,
    content,
    created_at
FROM blogs
WHERE content is null or (content LIKE '%' || :content || '%' )
ORDER BY created_at DESC;

--! update (title?, description?, content?)
UPDATE blogs
SET title = COALESCE(:title, title),
    description = COALESCE(:description, description),
    content = COALESCE(:content, content)
WHERE id = :id AND account_id = :account_id;

--! delete
DELETE FROM blogs
WHERE id = :id AND account_id = :account_id;
