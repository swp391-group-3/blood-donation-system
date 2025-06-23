--: Blog()

--! create
 INSERT INTO blogs (account_id, title, content)
 VALUES (:account_id, :title, :content)
 RETURNING id;

--! add_tag
INSERT INTO blog_tags (blog_id, tag_id)
VALUES (:blog_id, :tag_id);

--! get : Blog
SELECT *
FROM blogs
WHERE id = :id;

--! get_all : Blog
SELECT *
FROM blogs
ORDER BY created_at DESC;

--! search : Blog
SELECT *
FROM blogs
WHERE content LIKE '%' || :content || '%'
ORDER BY created_at DESC;

--! update (title?, content?)
UPDATE blogs
SET title = COALESCE(:title, title),
    content = COALESCE(:content, content)
WHERE id = :id 
AND account_id = :account_id;

--! delete
DELETE FROM blogs
WHERE id = :id AND account_id = :account_id;
