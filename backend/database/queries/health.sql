--! create (note?)
INSERT INTO healths(
    appointment_id,
    temperature,
    weight,
    upper_blood_pressure,
    lower_blood_pressure,
    heart_pulse,
    hemoglobin,
    is_good_health,
    note
)
VALUES(
    :appointment_id,
    :temperature,
    :weight,
    :upper_blood_pressure,
    :lower_blood_pressure,
    :heart_pulse,
    :hemoglobin,
    :is_good_health,
    :note
)
RETURNING id;

--! get_by_appointment_id
SELECT *
FROM healths
WHERE appointment_id = :appointment_id;

--! get_by_member_id
SELECT *
FROM healths
WHERE appointment_id IN (SELECT id FROM appointments WHERE member_id = :member_id)
ORDER BY created_at DESC;

--! update(temperature?, weight?, upper_blood_pressure?, lower_blood_pressure?, heart_pulse?, hemoglobin?, is_good_health?, note?)
UPDATE healths
SET
    temperature = COALESCE(:temperature, temperature),
    weight = COALESCE(:weight, weight),
    upper_blood_pressure = COALESCE(:upper_blood_pressure, upper_blood_pressure),
    lower_blood_pressure = COALESCE(:lower_blood_pressure, lower_blood_pressure),
    heart_pulse = COALESCE(:heart_pulse, heart_pulse),
    hemoglobin = COALESCE(:hemoglobin, hemoglobin),
    is_good_health = COALESCE(:is_good_health, is_good_health),
    note = COALESCE(:note, note)
WHERE id = :id;
