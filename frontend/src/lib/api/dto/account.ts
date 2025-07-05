import { BloodGroup } from './blood-group';

export const genders = ['male', 'female'] as const;
export type Gender = (typeof genders)[number];

export type Role = 'member' | 'staff' | 'admin';

export interface Account {
    role: Role;
    email: string;
    name: string;
    phone: string;
    address: string;
    birthday: string;
    blood_group: BloodGroup;
    gender: Gender;
    created_at: Date;
}

export const mockAccounts: Account[] = [
    {
        role: 'admin',
        email: 'alice.admin@example.com',
        name: 'Alice Nguyen',
        phone: '0123456789',
        address: '123 Le Loi, District 1, HCMC',
        birthday: '1990-05-15',
        blood_group: 'o_minus',
        gender: 'female',
        created_at: new Date('2023-01-10T10:00:00Z'),
    },
    {
        role: 'member',
        email: 'bob.member@example.com',
        name: 'Bob Tran',
        phone: '0987654321',
        address: '456 Nguyen Hue, District 1, HCMC',
        birthday: '1988-11-22',
        blood_group: 'b_minus',
        gender: 'male',
        created_at: new Date('2023-02-15T11:30:00Z'),
    },
    {
        role: 'staff',
        email: 'charlie.staff@example.com',
        name: 'Charlie Pham',
        phone: '0111222333',
        address: '789 Vo Van Tan, District 3, HCMC',
        birthday: '1992-03-01',
        blood_group: 'o_plus',
        gender: 'female',
        created_at: new Date('2023-03-20T09:15:00Z'),
    },
    {
        role: 'member',
        email: 'diana.le@example.com',
        name: 'Diana Le',
        phone: '0223344556',
        address: '101 Hai Ba Trung, District 3, HCMC',
        birthday: '1995-07-08',
        blood_group: 'a_b_plus',
        gender: 'female',
        created_at: new Date('2023-04-05T14:00:00Z'),
    },
    {
        role: 'admin',
        email: 'edward.hoang@example.com',
        name: 'Edward Hoang',
        phone: '0334455667',
        address: '202 Pasteur, District 1, HCMC',
        birthday: '1985-01-30',
        blood_group: 'a_minus',
        gender: 'male',
        created_at: new Date('2023-05-12T16:45:00Z'),
    },
    {
        role: 'staff',
        email: 'fiona.vo@example.com',
        name: 'Fiona Vo',
        phone: '0445566778',
        address: '303 Dinh Tien Hoang, Binh Thanh District, HCMC',
        birthday: '1993-09-19',
        blood_group: 'b_plus',
        gender: 'female',
        created_at: new Date('2023-06-25T08:00:00Z'),
    },
    {
        role: 'member',
        email: 'george.do@example.com',
        name: 'George Do',
        phone: '0556677889',
        address: '404 Cach Mang Thang Tam, District 10, HCMC',
        birthday: '1991-04-03',
        blood_group: 'o_minus',
        gender: 'male',
        created_at: new Date('2023-07-01T13:00:00Z'),
    },
    {
        role: 'staff',
        email: 'hannah.bui@example.com',
        name: 'Hannah Bui',
        phone: '0667788990',
        address: '505 Ly Thuong Kiet, Tan Binh District, HCMC',
        birthday: '1994-12-10',
        blood_group: 'a_plus',
        gender: 'female',
        created_at: new Date('2023-08-17T10:30:00Z'),
    },
    {
        role: 'member',
        email: 'ian.dinh@example.com',
        name: 'Ian Dinh',
        phone: '0778899001',
        address: '606 Cong Hoa, Tan Binh District, HCMC',
        birthday: '1990-02-28',
        blood_group: 'a_b_minus',
        gender: 'male',
        created_at: new Date('2023-09-30T15:00:00Z'),
    },
    {
        role: 'admin',
        email: 'julia.ly@example.com',
        name: 'Julia Ly',
        phone: '0889900112',
        address: '707 Truong Chinh, Go Vap District, HCMC',
        birthday: '1987-06-05',
        blood_group: 'b_minus',
        gender: 'female',
        created_at: new Date('2023-10-08T09:45:00Z'),
    },
];

export interface Staff {
    email: string;
    password: string;
    phone: string;
    name: string;
}
