--! create
INSERT INTO answers(question_id, appointment_id, content)
VALUES (:question_id, :appointment_id, :content);

--! get_by_appointment_id : Answer()
SELECT questions.content as question, answers.content as answer
FROM answers
INNER JOIN questions ON questions.id = answers.question_id
WHERE appointment_id = :appointment_id;
