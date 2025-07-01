--: Chat()

--! create
INSERT INTO chat_histories(
    account_id,
    role,
    content,
    created_at
) VALUES(
    :account_id,
    :role,
    :content,
    :created_at
);

--! get_by_account_id : Chat
SELECT * FROM chat_histories WHERE account_id = :account_id;
