--: Tag()

--! create
INSERT INTO tags(name)
VALUES(:name)
RETURNING id;

--! get_all : Tag
SELECT * FROM tags;
