/**
 * Complete Database Seeding Script for Blood Donation Platform
 */

import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

if (!process.env.DATABASE_URL) {
    console.error('❌ Missing DATABASE_URL in .env');
    process.exit(1);
}

const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL,
};

const START_DATE = dayjs().subtract(1, 'year').toDate();
const END_DATE = new Date();

const BLOOD_GROUPS = [
    'o_plus',
    'a_plus',
    'b_plus',
    'ab_plus',
    'o_minus',
    'a_minus',
    'b_minus',
    'ab_minus',
] as const;

const BLOOD_GROUP_WEIGHTS = [
    { type: 'o_plus', weight: 37.5 },
    { type: 'a_plus', weight: 26.3 },
    { type: 'b_plus', weight: 22 },
    { type: 'ab_plus', weight: 3.4 },
    { type: 'o_minus', weight: 6.6 },
    { type: 'a_minus', weight: 1.7 },
    { type: 'b_minus', weight: 1.3 },
    { type: 'ab_minus', weight: 0.6 },
] as const;

const BLOOD_COMPATIBILITY: Record<string, string[]> = {
    o_minus: [
        'o_minus',
        'o_plus',
        'a_plus',
        'a_minus',
        'b_plus',
        'b_minus',
        'ab_plus',
        'ab_minus',
    ],
    o_plus: ['o_plus', 'a_plus', 'b_plus', 'ab_plus'],
    a_minus: ['a_minus', 'a_plus', 'ab_plus', 'ab_minus'],
    a_plus: ['a_plus', 'ab_plus'],
    b_minus: ['b_minus', 'b_plus', 'ab_plus', 'ab_minus'],
    b_plus: ['b_plus', 'ab_plus'],
    ab_minus: ['ab_minus', 'ab_plus'],
    ab_plus: ['ab_plus'],
};

const ROLES = ['staff', 'donor'] as const;
const GENDERS = ['male', 'female'] as const;
const PRIORITIES = ['low', 'medium', 'high'] as const;
const APPT_STATUSES = [
    'on_process',
    'approved',
    'checked_in',
    'donated',
    'done',
    'rejected',
] as const;
const DONATION_TYPES = [
    'whole_blood',
    'power_red',
    'platelet',
    'plasma',
] as const;
const COMPONENTS = ['red_cell', 'platelet', 'plasma'] as const;
const DONATION_INTERVALS: Record<string, number> = {
    whole_blood: 56,
    power_red: 112,
    platelet: 7,
    plasma: 14,
};

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted<T extends { weight: number }>(items: readonly T[]): T {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of items) {
        if (rand < item.weight) return item;
        rand -= item.weight;
    }
    return items[items.length - 1];
}

function randomDate(start: Date, end: Date) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
}

async function seed() {
    const client = new Client(DB_CONFIG);
    await client.connect();

    const tables = [
        'blood_bags',
        'donations',
        'healths',
        'answers',
        'appointments',
        'request_blood_groups',
        'blood_requests',
        'blog_tags',
        'comments',
        'blogs',
        'tags',
        'questions',
        'accounts',
    ];
    for (const table of tables) {
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    const questions = [
        'Are you feeling healthy today?',
        'Have you recently been ill or had symptoms like fever, cough, diarrhea, or skin infection?',
        'Have you had recent medical treatments—surgeries, dental procedures, injections, vaccines, or antibiotics?',
        'Have you traveled to any malaria-risk areas or lived in those regions in recent years?',
        'Are you taking any medications—such as for infections, PrEP/PEP, or others with potential deferral?',
        'Do you have any history of bloodborne infections (like HIV, hepatitis), or recent risky exposures?',
    ];
    const questionIds: number[] = [];
    for (const q of questions) {
        const res = await client.query(
            `INSERT INTO questions (content, is_active) VALUES ($1,true) RETURNING id`,
            [q],
        );
        questionIds.push(res.rows[0].id);
    }

    const accountIds: string[] = [];
    const staffIds: string[] = [];
    const donorIds: string[] = [];
    const donorDonationMap: Record<string, Record<string, Date>> = {};
    const donorActiveApptMap: Record<string, boolean> = {};
    const donorBloodMap: Record<string, string> = {};

    for (let i = 0; i < 200; i++) {
        const id = uuidv4();
        const role = i < 7 ? 'staff' : 'donor';
        const email = faker.internet.exampleEmail();
        const password =
            '$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W';
        const phone = '09' + faker.string.numeric(8);
        const name = faker.person.firstName() + ' ' + faker.person.lastName();
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        const address = faker.location.streetAddress();
        const birthday = faker.date.birthdate({
            min: 18,
            max: 60,
            mode: 'age',
        });
        const blood_group = pickWeighted(BLOOD_GROUP_WEIGHTS).type;
        const created_at = randomDate(START_DATE, END_DATE);

        await client.query(
            `INSERT INTO accounts (id, role, email, password, phone, name, gender, address, birthday, blood_group, is_active, created_at, is_banned)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11,false)`,
            [
                id,
                role,
                email,
                password,
                phone,
                name,
                gender,
                address,
                birthday,
                blood_group,
                created_at,
            ],
        );

        accountIds.push(id);
        if (role === 'staff') staffIds.push(id);
        else {
            donorIds.push(id);
            donorDonationMap[id] = {
                whole_blood: START_DATE,
                power_red: START_DATE,
                platelet: START_DATE,
                plasma: START_DATE,
            };
            donorActiveApptMap[id] = false;
            donorBloodMap[id] = blood_group;
        }
    }

    const requestBloodMap: Record<string, Set<string>> = {};
    const requestIds: string[] = [];
    const requestTimeMap = new Map<string, [Date, Date]>();
    const requestPeopleMap = new Map<string, number>();
    const currentActiveRequests: string[] = [];
    const requestMaxMap: Record<string, number> = {};

    for (const staffId of staffIds) {
        for (let i = 0; i < 3; i++) {
            const id = uuidv4();
            const priority = pick(PRIORITIES);
            const title = `Blood Drive - ${priority}`;
            const baseMax = faker.number.int({ min: 30, max: 100 });
            const pct = faker.number.float({
                min: 0.10,
                max: 0.70,
                multipleOf: 0.01,
            });
            const actualMax = Math.max(1, Math.floor(baseMax * pct));
            requestMaxMap[id] = actualMax;
            let start: Date, end: Date;
            if (Math.random() < 0.3) {
                start = randomDate(
                    dayjs().subtract(4, 'day').toDate(),
                    new Date()
                );
                end = dayjs(start)
                    .add(faker.number.int({ min: 1, max: 10 }), 'day')
                    .toDate();
            } else {
                start = randomDate(START_DATE, END_DATE);
                end = dayjs(start)
                    .add(faker.number.int({ min: 1, max: 10 }), 'day')
                    .toDate();
            }
            const hoursBefore = faker.number.int({ min: 1, max: 24 });
            const created_at = dayjs(start)
                .subtract(hoursBefore, 'hour')
                .toDate();
            const currentTime = new Date();
            const isActive = currentTime >= start && currentTime <= end;

            await client.query(
                `INSERT INTO blood_requests (id, staff_id, priority, title, max_people, start_time, end_time, is_active, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [
                    id,
                    staffId,
                    priority,
                    title,
                    baseMax,
                    start,
                    end,
                    isActive,
                    created_at,
                ],
            );

            requestIds.push(id);
            requestTimeMap.set(id, [start, end]);
            requestPeopleMap.set(id, 0);
            if (isActive) currentActiveRequests.push(id);

            const bloodGroups = faker.helpers.uniqueArray(
                BLOOD_GROUPS,
                faker.number.int({ min: 1, max: 4 }),
            );
            requestBloodMap[id] = new Set(bloodGroups);
            for (const group of bloodGroups) {
                await client.query(
                    `INSERT INTO request_blood_groups (request_id, blood_group) VALUES ($1,$2)`,
                    [id, group],
                );
            }
        }
    }

    for (const requestId of requestIds) {
        const [start, end] = requestTimeMap.get(requestId)!;
        const isActive = new Date() >= start && new Date() <= end;
        const donors = faker.helpers.shuffle(donorIds);

        for (const donorId of donors) {
            if (requestPeopleMap.get(requestId)! >= requestMaxMap[requestId]) continue;
            if (donorActiveApptMap[donorId]) continue;

            const donorBlood = donorBloodMap[donorId];
            const allowedBloods = requestBloodMap[requestId]!;
            const compatible = BLOOD_COMPATIBILITY[donorBlood].some((bg) =>
                allowedBloods.has(bg),
            );
            if (!compatible) continue;

            donorActiveApptMap[donorId] = true;
            const id = uuidv4();

            const temp = faker.number.float({
                min: 36.0,
                max: 37.5,
                fractionDigits: 1,
            });
            const sys = faker.number.int({ min: 100, max: 140 });
            const dia = faker.number.int({ min: 60, max: 90 });
            const hr = faker.number.int({ min: 60, max: 100 });
            const weight = faker.number.int({ min: 45, max: 100 });
            const good = Math.random() < 0.9;

            let status: typeof APPT_STATUSES[number];

            if (!good) {
                status = 'rejected';
            } else if (isActive) {
                status = pick(['on_process', 'approved', 'checked_in', 'donated']);
            } else {
                status = 'done';
            }

            const reason =
                status === 'rejected'
                    ? pick([
                        'Low hemoglobin level',
                        'High blood pressure',
                        'Recent illness or infection',
                        'Not feeling well today',
                        'Recent vaccination',
                        'Ineligible due to recent travel',
                        'Did not meet health requirements',
                    ])
                    : null;

            await client.query(
                `INSERT INTO appointments (id, request_id, donor_id, status, reason)
         VALUES ($1,$2,$3,$4,$5)`,
                [id, requestId, donorId, status, reason],
            );
            requestPeopleMap.set(
                requestId,
                requestPeopleMap.get(requestId)! + 1,
            );

            for (const qid of questionIds) {
                await client.query(
                    `INSERT INTO answers (question_id, appointment_id, content)
           VALUES ($1, $2, $3)`,
                    [qid, id, pick(['yes', 'no', 'maybe'])],
                );
            }

            let shouldSeedHealth = false;
            let shouldSeedDonation = false;

            if (status === 'done' || status === 'donated') {
                shouldSeedHealth = true;
                shouldSeedDonation = true;
            } else if (status === 'checked_in') {
                shouldSeedHealth = true;
            } else if (status === 'rejected') {
                const r = Math.random();
                if (r < 0.2) {
                    shouldSeedHealth = true;
                    shouldSeedDonation = true;
                } else if (r < 0.5) {
                    shouldSeedHealth = true;
                }
            }

            const healthDate = randomDate(start, end);
            const donationDate = dayjs(healthDate).add(1, 'hour').toDate();
            if (shouldSeedHealth) {
                await client.query(
                    `INSERT INTO healths (id, appointment_id, temperature, weight, upper_blood_pressure, lower_blood_pressure, heart_rate, is_good_health, note, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                    [
                        uuidv4(),
                        id,
                        temp,
                        weight,
                        sys,
                        dia,
                        hr,
                        good,
                        good ? 'All vitals normal' : 'Vitals slightly off',
                        healthDate,
                    ],
                );
            };

            if (shouldSeedDonation) {
                const donationId = uuidv4();

                let donationType = pick(DONATION_TYPES);
                const last = donorDonationMap[donorId][donationType];
                let tries = 0;
                while (
                    dayjs(donationDate).diff(last, 'day') <
                    DONATION_INTERVALS[donationType] &&
                    tries < 10
                ) {
                    donationType = pick(DONATION_TYPES);
                    tries++;
                }
                if (tries >= 10) continue;

                donorDonationMap[donorId][donationType] = donationDate;

                const amount = faker.number.int({ min: 450, max: 550 });
                await client.query(
                    `INSERT INTO donations (id, appointment_id, type, amount, created_at)
          VALUES ($1, $2, $3, $4, $5)`,
                    [donationId, id, donationType, amount, donationDate],
                );

                if (status === 'done') {
                    for (const comp of COMPONENTS) {
                        let expired;
                        if (comp === 'plasma')
                            expired = dayjs(donationDate).add(365, 'day').toDate();
                        else if (comp === 'platelet')
                            expired = dayjs(donationDate).add(5, 'day').toDate();
                        else expired = dayjs(donationDate).add(42, 'day').toDate();

                        const isUsed = expired < new Date();
                        await client.query(
                            `INSERT INTO blood_bags (id, donation_id, component, is_used, amount, expired_time)
            VALUES ($1, $2, $3, $4, $5, $6)`,
                            [
                                uuidv4(),
                                donationId,
                                comp,
                                isUsed,
                                comp === 'red_cell' ? 300 : 100,
                                expired,
                            ],
                        );
                    }
                }
            }
        }
    }

    const tagNames = [
        'Donation',
        'Health',
        'Events',
        'Volunteers',
        'Urgent',
        'Awareness',
    ];
    const tagIds: string[] = [];
    for (const name of tagNames) {
        const id = uuidv4();
        await client.query(`INSERT INTO tags (id, name) VALUES ($1, $2)`, [
            id,
            name,
        ]);
        tagIds.push(id);
    }

    const blogIds: string[] = [];
    for (let i = 0; i < 49; i++) {
        const blogId = uuidv4();
        const authorId = pick(accountIds);
        const title = faker.lorem.sentence();
        const description = faker.lorem.sentences(2);
        const content = faker.lorem.paragraphs(3);
        const created_at = randomDate(START_DATE, END_DATE);

        await client.query(
            `INSERT INTO blogs (id, account_id, title, description, content, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [blogId, authorId, title, description, content, created_at],
        );
        blogIds.push(blogId);

        const usedTags = faker.helpers.uniqueArray(
            tagIds,
            faker.number.int({ min: 1, max: 3 }),
        );
        for (const tagId of usedTags) {
            await client.query(
                `INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)`,
                [blogId, tagId],
            );
        }

        const numComments = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < numComments; j++) {
            const commentId = uuidv4();
            const commenter = pick(accountIds);
            const comment = faker.lorem.sentences(2);
            const commentTime = randomDate(created_at, END_DATE);

            await client.query(
                `INSERT INTO comments (id, blog_id, account_id, content, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
                [commentId, blogId, commenter, comment, commentTime],
            );
        }
    }

    console.log('✅ Database seeded successfully.');
    await client.end();
}

seed().catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
});
