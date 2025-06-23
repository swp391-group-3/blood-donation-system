--: Tag()

--! create
INSERT INTO tags(name)
VALUES(:name)
RETURNING id;

--! get_by_blog_id : Tag
SELECT * FROM tags
WHERE id IN (SELECT tag_id FROM blog_tags WHERE blog_id = :blog_id);

--! get_all : Tag
SELECT * FROM tags;
