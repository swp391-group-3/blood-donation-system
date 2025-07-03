--: Question()

--! create
INSERT INTO questions(content)
VALUES(:content)
RETURNING id;

--! get_all : Question
SELECT *
FROM questions
WHERE is_active = true
ORDER BY id;

--! update
UPDATE questions
SET content = :content
WHERE id = :id;

--! delete
UPDATE questions
SET is_active = false
WHERE id = :id;
