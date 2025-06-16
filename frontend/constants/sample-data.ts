import {
    House,
    Droplet,
    Calendar,
    Activity,
    CircleAlert,
    Settings,
    BookOpen,
    History,
} from 'lucide-react';

export const sidebarItems = [
    { icon: House, label: 'Dashboard', href: '/member' },
    {
        icon: Droplet,
        label: 'Blood Requests',
        href: '/member/request',
    },
    {
        icon: BookOpen,
        label: 'Blog',
        href: '/member/blog',
    },
    {
        icon: Calendar,
        label: 'Appointments',
        href: '/member/appointment',
    },
    {
        icon: Activity,
        label: 'Health Profile',
        href: '/member/health-profile',
    },
    {
        icon: History,
        label: 'History',
        href: '/member/history',
    },

    { icon: Settings, label: 'Settings', href: '/member/profile' },
];

export const requests = [
    {
        id: 'req-001',
        title: 'Emergency Surgery Blood Needed',
        blood_group: 'O+',
        time: '08:00 - 18:00',
        compatible: true,
        staff_name: 'Dr. Smith',
    },
    {
        id: 'req-003',
        title: 'Accident Victim Needs Blood',
        blood_group: 'O+',
        time: '10:00 - 16:00',
        compatible: true,
        staff_name: 'Dr. Wilson',
    },
];

export const actions = [
    {
        icon: Calendar,
        title: 'Schedule Donation',
        color: 'bg-green-50 text-green-600',
        href: '/member/appointment',
    },
    {
        icon: Droplet,
        title: 'View Requests',
        color: 'bg-red-50 text-red-500',
        href: '/member/request',
    },
    {
        icon: Activity,
        title: 'Health Records',
        color: 'bg-purple-50 text-purple-600',
        href: '/member/health-profile',
    },
];

export const donations = [
    {
        type: 'Whole Blood',
        amount: '450ml',
        date: '4/15/2023',
    },
    {
        type: 'Plasma',
        amount: '600ml',
        date: '4/15/2023',
    },
    {
        type: 'Platelets',
        amount: '200ml',
        date: '4/15/2023',
    },
];

export const appointments = [
    {
        type: 'Blood Donation',
        date: '7/10/2025',
        time: '10:00 AM',
        status: 'Confirm',
        statusColor: 'bg-green-100 text-green-800',
    },
    {
        type: 'Health Check',
        date: '7/10/2025',
        time: '10:00 AM',
        status: 'Pending',
        statusColor: 'bg-yellow-100 text-yellow-800',
    },
];

export const mockRequests = [
    {
        id: '1',
        title: 'Emergency O- needed for surgery',
        bloodGroup: 'O-',
        priority: 'high',
        startDate: '2025-06-01',
        endDate: '2025-06-03',
        maxPeople: 5,
        currentPeople: 2,
        createdAt: '2025-05-30',
        description:
            'Urgent need for O- blood for multiple emergency surgeries.',
        estimatedTimeLeft: '2 days',
        applications: 3,
        createdBy: 'staff1',
    },
    {
        id: '2',
        title: 'Regular donation drive',
        bloodGroup: 'All',
        priority: 'medium',
        startDate: '2025-06-05',
        endDate: '2025-06-10',
        maxPeople: 20,
        currentPeople: 19,
        createdAt: '2025-05-29',
        description:
            'Community blood drive to replenish our general inventory.',
        estimatedTimeLeft: '5 days',
        applications: 10,
        createdBy: 'staff2',
    },
    {
        id: '3',
        title: 'Platelets needed for cancer patients',
        bloodGroup: 'A+',
        priority: 'medium',
        startDate: '2025-06-08',
        endDate: '2025-06-15',
        maxPeople: 10,
        currentPeople: 6,
        createdAt: '2025-05-28',
        description: 'Platelet donations needed for ongoing cancer treatments.',
        estimatedTimeLeft: '8 days',
        applications: 5,
        createdBy: 'staff1',
    },
    {
        id: '4',
        title: 'Blood needed for accident victims',
        bloodGroup: 'B+',
        priority: 'high',
        startDate: '2025-06-02',
        endDate: '2025-06-05',
        maxPeople: 15,
        currentPeople: 7,
        createdAt: '2025-05-31',
        description: 'Support for ongoing treatment of accident victims.',
        estimatedTimeLeft: '3 days',
        applications: 0,
        createdBy: 'staff2',
    },
];

// sample-data for appointment page
export const summaryStats = {
    totalDonations: 2,
    lifetimeDonations: 'Lifetime donations',
    nextMilestone: '4/10 to next milestone',
    bloodDonated: '600ml',
    totalVolume: 'Total volume donated',
    livesEquivalent: 'Equivalent to saving 15 lives',
    nextEligible: 'Jun 15',
    nextDonationDate: 'Next donation date',
    weeksRemaining: '2 weeks remaining',
};

export const upcomingAppointments = [
    {
        id: 1,
        title: 'Emergency O- needed for surgery',
        status: 'Confirmed',
        priority: 'High Priority',
        bloodGroup: 'O-',
        date: '6/3/2025',
        time: '10:00 AM',
        duration: '45-60 minutes',
        notes: 'Eat well and stay hydrated before your appointment',
        timeUntil: 'Past',
    },
    {
        id: 2,
        title: 'Regular donation drive',
        status: 'Pending',
        priority: 'Medium Priority',
        bloodGroup: 'All',
        date: '6/15/2025',
        time: '2:30 PM',
        duration: '45-60 minutes',
        notes: 'Bring a valid ID and eat a healthy meal',
        timeUntil: 'In 8 days',
    },
];

export const completedAppointments = [
    {
        id: 3,
        title: 'Regular blood donation',
        status: 'Completed',
        priority: 'Standard',
        bloodGroup: 'O-',
        date: '5/15/2025',
        time: '11:00 AM',
        duration: '45 minutes',
        notes: 'Successful donation - 450ml collected',
    },
    {
        id: 4,
        title: 'Emergency donation request',
        status: 'Completed',
        priority: 'High Priority',
        bloodGroup: 'O-',
        date: '4/20/2025',
        time: '3:15 PM',
        duration: '50 minutes',
        notes: 'Critical need fulfilled - patient stable',
    },
];

// sample data for health profile page
export const mockHealthRecords = [
    {
        id: '1',
        date: '2025-06-03',
        appointmentId: 'apt-001',
        temperature: 36.8,
        weight: 75,
        bloodPressure: '120/80',
        pulse: 72,
        hemoglobin: 14.2,
        status: 'approved',
        notes: 'All vitals normal. Approved for donation.',
    },
    {
        id: '2',
        date: '2025-04-15',
        appointmentId: 'apt-002',
        temperature: 36.5,
        weight: 74,
        bloodPressure: '118/78',
        pulse: 68,
        hemoglobin: 13.8,
        status: 'approved',
        notes: 'Excellent health parameters.',
    },
    {
        id: '3',
        date: '2025-02-20',
        appointmentId: 'apt-003',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '4',
        date: '2025-02-20',
        appointmentId: 'apt-004',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '5',
        date: '2025-02-20',
        appointmentId: 'apt-004',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '6',
        date: '2025-02-20',
        appointmentId: 'apt-005',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '7',
        date: '2025-02-20',
        appointmentId: 'apt-006',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '8',
        date: '2025-02-20',
        appointmentId: 'apt-007',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
];

export const mockHealthTrends = {
    weight: [73, 74, 75],
    hemoglobin: [14.0, 13.8, 14.2],
    bloodPressure: [
        { systolic: 125, diastolic: 82 },
        { systolic: 118, diastolic: 78 },
        { systolic: 120, diastolic: 80 },
    ],
};

// sample-data for emergency
export const emergencyRequests = [
    {
        id: 1,
        title: 'CRITICAL: Multiple Trauma Victims',
        bloodGroup: 'O-',
        unitsNeeded: 10,
        unitsSecured: 3,
        priority: 'critical',
        timePosted: '15 minutes ago',
        estimatedTime: '2 hours',
        description:
            'Multi-vehicle accident with 4 critical patients requiring immediate blood transfusion',
        contactPerson: 'Dr. Sarah Johnson',
        contactPhone: '+1-555-0123',
    },
    {
        id: 2,
        title: 'URGENT: Pediatric Surgery',
        bloodGroup: 'A+',
        unitsNeeded: 5,
        unitsSecured: 1,
        priority: 'high',
        timePosted: '32 minutes ago',
        estimatedTime: '4 hours',
        description:
            'Emergency surgery for 8-year-old patient with internal bleeding',
        contactPerson: 'Dr. Michael Chen',
        contactPhone: '+1-555-0124',
    },
    {
        id: 3,
        title: 'CRITICAL: Cardiac Surgery',
        bloodGroup: 'B-',
        unitsNeeded: 8,
        unitsSecured: 2,
        priority: 'critical',
        timePosted: '1 hour ago',
        estimatedTime: '6 hours',
        description: 'Emergency heart surgery requiring rare B- blood type',
        contactPerson: 'Dr. Lisa Rodriguez',
        contactPhone: '+1-555-0125',
    },
];

// sample-data of blog
export const blogPosts = [
    {
        id: 'post-001',
        title: 'The Importance of Regular Blood Donation',
        excerpt:
            'Learn why regular blood donation is crucial for maintaining adequate blood supplies and how it benefits both donors and recipients.',
        content: 'Full content here...',
        author: {
            name: 'Dr. Sarah Johnson',
            role: 'staff',
            initials: 'SJ',
        },
        tags: ['donation', 'health', 'community'],
        publishedAt: '2023-05-28',
    },
    {
        id: 'post-002',
        title: 'My First Blood Donation Experience',
        excerpt:
            'A personal story about overcoming fears and making a difference through blood donation.',
        content: 'Full content here...',
        author: {
            name: 'Michael Chen',
            role: 'member',
            initials: 'MC',
        },

        tags: ['experience', 'first-time', 'inspiration'],
        publishedAt: '2023-05-27',
    },
    {
        id: 'post-003',
        title: 'Blood Types and Compatibility: A Complete Guide',
        excerpt:
            'Understanding different blood types, compatibility, and why certain types are more in demand.',
        content: 'Full content here...',
        author: {
            name: 'Dr. Emily Rodriguez',
            role: 'staff',
            initials: 'ER',
        },
        tags: ['blood-types', 'compatibility', 'education'],
        publishedAt: '2023-05-26',
    },
    {
        id: 'post-004',
        title: 'Community Blood Drive Success Story',
        excerpt:
            'How our recent community blood drive exceeded expectations and made a real impact.',
        content: 'Full content here...',
        author: {
            name: 'Jennifer Adams',
            role: 'staff',
            initials: 'JA',
        },
        tags: ['community', 'success', 'impact'],
        publishedAt: '2023-05-25',
    },
    {
        id: 'post-005',
        title: 'Preparing for Your Blood Donation',
        excerpt:
            "Essential tips and guidelines to ensure you're ready for a successful blood donation.",
        content: 'Full content here...',
        author: {
            name: 'Robert Kim',
            role: 'member',
            initials: 'RK',
        },
        tags: ['preparation', 'tips', 'donation'],
        publishedAt: '2023-05-24',
    },
    {
        id: 'post-006',
        title: 'The Science Behind Blood Storage',
        excerpt:
            'Exploring how blood is processed, stored, and maintained to ensure safety and effectiveness.',
        content: 'Full content here...',
        author: {
            name: 'Dr. Amanda Foster',
            role: 'staff',
            initials: 'AF',
        },
        tags: ['science', 'storage', 'technology'],
        publishedAt: '2023-05-23',
    },
];

// health-profile chart data weight
export const weightChartData = [
    { month: 'January', weight: 70 },
    { month: 'Febuary', weight: 75 },
    { month: 'March', weight: 10 },
    { month: 'April', weight: 90 },
    { month: 'May', weight: 100 },
    { month: 'June', weight: 200 },
    { month: 'July', weight: 85 },
];

export const hemoglobinChartData = [
    { month: 'January', hemoglobin: 1.5 },
    { month: 'Febuary', hemoglobin: 1.7 },
    { month: 'March', hemoglobin: 2 },
    { month: 'April', hemoglobin: 3 },
    { month: 'May', hemoglobin: 1 },
    { month: 'June', hemoglobin: 1.1 },
    { month: 'July', hemoglobin: 1.4 },
];

// sample data for blood donation blog
export const bloodDonationTags = [
    { value: 'all', label: 'All Tags' },
    { value: 'blood-donation', label: 'Blood Donation' },
    { value: 'health-tips', label: 'Health Tips' },
    { value: 'blood-types', label: 'Blood Types' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'donor-stories', label: 'Donor Stories' },
    { value: 'blood-drive', label: 'Blood Drive' },
    { value: 'medical-facts', label: 'Medical Facts' },
    { value: 'faq', label: 'FAQ' },
];

// empty blog list to test the empty list state
export const emptyBlogList = [];

// blog data sample

export const post = {
    author: {
        name: 'Dr. Nam Dang',
        role: 'staff',
        initials: 'ND',
    },
    tags: ['donation', 'health', 'community'],
    title: 'The Importance of Regular Blood Donation',
    publishedAt: '2023-05-28',
    content: `
    <article>
        <section>
            <h2>Introduction</h2>
            <p>
            Blood is often called the lifeline of the human body, carrying oxygen, nutrients, and vital cells to every corner of our system.
            But while it’s something most of us take for granted, every day, thousands of patients depend on donated blood for survival.
            Thanks to advances in medical software and blood donation management systems, the process of collecting, tracking, and distributing blood is safer, faster, and more efficient than ever before.
            </p>
        </section>
        <section>
            <h2>The Importance of Regular Blood Donation</h2>
            <p>
            Regular blood donation isn’t just a charitable act—it’s a cornerstone of any healthcare system.
            Hospitals require a constant supply of blood for surgeries, trauma cases, cancer treatments, and chronic illnesses.
            One donation can save up to three lives, but demand often outpaces supply, especially during emergencies or natural disasters.
            </p>
        </section>
        <section>
            <h2>Challenges in Traditional Blood Donation</h2>
            <ul>
            <li><strong>Manual Records:</strong> Paper-based records were prone to errors, duplication, and data loss.</li>
            <li><strong>Traceability:</strong> Tracking each blood unit from donor to recipient was complex, making recalls or investigations difficult during transfusion reactions.</li>
            <li><strong>Donor Management:</strong> Reaching eligible donors for urgent needs or new donation drives was inefficient.</li>
            </ul>
        </section>
        <section>
            <h2>How Modern Systems Transform Blood Donation</h2>
            <ol>
            <li>
                <strong>End-to-End Traceability</strong><br>
                Every unit of blood receives a unique barcode or RFID tag. The system tracks it from donation, through testing, processing, storage, and ultimately to the patient. This minimizes the risk of errors and enables quick responses if there are recalls or safety alerts.
            </li>
            <li>
                <strong>Donor Eligibility and Scheduling</strong><br>
                Donor information—including past donations, deferrals, health screening results, and eligibility—is securely stored. The system automatically calculates when a donor is eligible again, preventing over-donation and ensuring donor health. Online scheduling tools allow donors to book appointments at their convenience, reducing wait times and improving turnout.
            </li>
            <li>
                <strong>Inventory Management</strong><br>
                Real-time dashboards help staff monitor blood stock levels by type and component (red cells, plasma, platelets). When certain blood types run low, the system can trigger alerts, or even automatically send notifications to registered donors with matching types.
            </li>
            <li>
                <strong>Compliance and Data Security</strong><br>
                Modern solutions adhere to strict data protection regulations (HIPAA, GDPR, etc.). All sensitive information is encrypted, and access is role-based, ensuring that only authorized personnel can view or edit critical data.
            </li>
            <li>
                <strong>Community Engagement</strong><br>
                Many platforms integrate with email and SMS systems, making it easy to reach out to donors for upcoming events or urgent needs. Some even provide mobile apps so donors can track their donation history and receive reminders.
            </li>
            </ol>
        </section>
        <section>
            <h2>The Human Side: Stories from the Field</h2>
            <p>
            Behind every pint of blood is a story—a donor who took the time to help, and a patient whose life was changed.
            Our system isn’t just about technology; it’s about connecting people in moments of need and fostering a culture of health and generosity.
            </p>
        </section>
        <section>
            <h2>Conclusion</h2>
            <p>
            The evolution of blood donation systems illustrates the power of technology to improve public health outcomes.
            As more hospitals and blood banks adopt these solutions, we’re better equipped than ever to save lives, respond to emergencies, and ensure that every drop of donated blood counts.
            </p>
        </section>
        </article>
    `,
};
// comment data sample
export const comments = [
    {
        id: 'comment-1',
        author: {
            name: 'Michael Chen',
            initials: 'MC',
            role: 'member',
        },
        content:
            'This is such an informative post! I had no idea that only 3% of eligible people donate blood. It really puts things into perspective.',
        publishedAt: '2023-05-28',
    },
    {
        id: 'comment-2',
        author: {
            name: 'Jennifer Adams',
            initials: 'JA',
            role: 'member',
        },
        content:
            "I've been donating for 5 years now and it's become such a rewarding habit. The health screening is also a nice bonus!",
        publishedAt: '2023-05-28',
    },
    {
        id: 'comment-3',
        author: {
            name: 'Robert Kim',
            initials: 'RK',
            role: 'member',
        },
        content:
            "Great article! I'm planning to start donating regularly. Do you have any tips for first-time donors?",
        publishedAt: '2023-05-29',
    },
];

// donation history sample data

export const donationHistory = [
    {
        id: 'don-001',
        date: '2025-04-15',
        type: 'Whole Blood',
        amount: '450ml',
        location: 'Central Blood Bank',
        address: '123 Main Street, Downtown',
        requestId: 'req-001',
        requestedBy: 'General Hospital',
        urgency: 'Critical',
        patientsHelped: 3,
        hemoglobin: '14.2 g/dL',
        bloodPressure: '120/80',
        pulse: '72 bpm',
        temperature: '98.6°F',
        status: 'completed',
        staffNotes: 'Excellent donation, no complications',
        certificateUrl: '/certificates/don-001.pdf',
    },
    {
        id: 'don-002',
        date: '2025-01-10',
        type: 'Plasma',
        amount: '600ml',
        location: 'Mobile Blood Drive',
        address: 'University Campus, Building A',
        requestId: 'req-002',
        requestedBy: "Children's Hospital",
        urgency: 'High',
        patientsHelped: 2,
        hemoglobin: '13.8 g/dL',
        bloodPressure: '118/78',
        pulse: '68 bpm',
        temperature: '98.4°F',
        status: 'completed',
        staffNotes: 'Good donation, donor felt well throughout',
        certificateUrl: '/certificates/don-002.pdf',
    },
    {
        id: 'don-003',
        date: '2024-10-05',
        type: 'Platelets',
        amount: '200ml',
        location: 'University Hospital',
        address: '789 University Drive',
        requestId: 'req-003',
        requestedBy: 'Cancer Treatment Center',
        urgency: 'Medium',
        patientsHelped: 1,
        hemoglobin: '14.0 g/dL',
        bloodPressure: '122/82',
        pulse: '75 bpm',
        temperature: '98.8°F',
        status: 'completed',
        staffNotes: 'Platelet donation successful, good recovery',
        certificateUrl: '/certificates/don-003.pdf',
    },
    {
        id: 'don-004',
        date: '2024-07-20',
        type: 'Double Red Cells',
        amount: '450ml',
        location: 'Central Blood Bank',
        address: '123 Main Street, Downtown',
        requestId: 'req-004',
        requestedBy: 'Emergency Medical Center',
        urgency: 'Critical',
        patientsHelped: 4,
        hemoglobin: '14.5 g/dL',
        bloodPressure: '115/75',
        pulse: '70 bpm',
        temperature: '98.5°F',
        status: 'completed',
        staffNotes: 'Double red cell donation, excellent vitals',
        certificateUrl: '/certificates/don-004.pdf',
    },
    {
        id: 'don-005',
        date: '2024-04-12',
        type: 'Whole Blood',
        amount: '450ml',
        location: 'Community Health Center',
        address: '456 Oak Avenue, Midtown',
        requestId: 'req-005',
        requestedBy: 'Metro Hospital',
        urgency: 'High',
        patientsHelped: 3,
        hemoglobin: '13.9 g/dL',
        bloodPressure: '125/80',
        pulse: '74 bpm',
        temperature: '98.7°F',
        status: 'completed',
        staffNotes: 'Standard donation, no issues reported',
        certificateUrl: '/certificates/don-005.pdf',
    },
];

export const bloodTypeStats = [
    {
        type: 'A+',
        available: '450ml',
        used: 8,
        demand: 'high',
    },
    {
        type: 'A-',
        available: '200ml',
        used: 4,
        demand: 'medium',
    },
    {
        type: 'B+',
        available: '450ml',
        used: 5,
        demand: 'medium',
    },
    {
        type: 'B-',
        available: '500ml',
        used: 2,
        demand: 'low',
    },
    {
        type: 'AB+',
        available: '500ml',
        used: 3,
        demand: 'low',
    },
    {
        type: 'AB-',
        available: '500ml',
        used: 1,
        demand: 'low',
    },
    {
        type: 'O+',
        available: '1000ml',
        used: 12,
        demand: 'very-high',
    },
    {
        type: 'O-',
        available: '800ml',
        used: 6,
        demand: 'high',
    },
];

export const mockBloodBags = [
    {
        id: 'BB-001',
        donorId: 'D-1001',
        donorName: 'John Smith',
        bloodType: 'A+',
        collectionDate: '2024-01-15',
        expiryDate: '2024-02-15',
        volume: 450,
        status: 'Available',
        storage: 'Refrigerator A1',
        testResults: 'Passed',
        notes: 'Healthy donor, regular donation',
        priority: 'normal',
        temperature: '4°C',
        lastChecked: '2024-01-20T10:30:00Z',
    },
    {
        id: 'BB-002',
        donorId: 'D-1002',
        donorName: 'Sarah Johnson',
        bloodType: 'O-',
        collectionDate: '2024-01-16',
        expiryDate: '2024-02-16',
        volume: 450,
        status: 'Reserved',
        storage: 'Emergency Refrigerator',
        testResults: 'Passed',
        notes: 'Universal donor - high priority',
        priority: 'high',
        temperature: '4°C',
        lastChecked: '2024-01-20T11:15:00Z',
    },
    {
        id: 'BB-003',
        donorId: 'D-1003',
        donorName: 'Michael Brown',
        bloodType: 'B+',
        collectionDate: '2024-01-14',
        expiryDate: '2024-02-14',
        volume: 450,
        status: 'Available',
        storage: 'Refrigerator B2',
        testResults: 'Passed',
        notes: '',
        priority: 'normal',
        temperature: '4°C',
        lastChecked: '2024-01-20T09:45:00Z',
    },
    {
        id: 'BB-004',
        donorId: 'D-1004',
        donorName: 'Emily Davis',
        bloodType: 'AB+',
        collectionDate: '2024-01-13',
        expiryDate: '2024-02-13',
        volume: 450,
        status: 'Available',
        storage: 'Refrigerator C1',
        testResults: 'Passed',
        notes: 'First-time donor',
        priority: 'normal',
        temperature: '4°C',
        lastChecked: '2024-01-20T08:20:00Z',
    },
    {
        id: 'BB-005',
        donorId: 'D-1005',
        donorName: 'David Wilson',
        bloodType: 'A-',
        collectionDate: '2024-01-12',
        expiryDate: '2024-02-12',
        volume: 450,
        status: 'Used',
        storage: 'Archive',
        testResults: 'Passed',
        notes: 'Used for emergency surgery',
        priority: 'normal',
        temperature: 'N/A',
        lastChecked: '2024-01-18T14:30:00Z',
    },
    {
        id: 'BB-006',
        donorId: 'D-1006',
        donorName: 'Jennifer Lee',
        bloodType: 'O+',
        collectionDate: '2024-01-11',
        expiryDate: '2024-02-11',
        volume: 450,
        status: 'Available',
        storage: 'Refrigerator A3',
        testResults: 'Passed',
        notes: '',
        priority: 'normal',
        temperature: '4°C',
        lastChecked: '2024-01-20T12:00:00Z',
    },
    {
        id: 'BB-007',
        donorId: 'D-1007',
        donorName: 'Robert Taylor',
        bloodType: 'B-',
        collectionDate: '2024-01-10',
        expiryDate: '2024-02-10',
        volume: 450,
        status: 'Expiring Soon',
        storage: 'Refrigerator B1',
        testResults: 'Passed',
        notes: 'Regular donor - expires in 3 days',
        priority: 'urgent',
        temperature: '4°C',
        lastChecked: '2024-01-20T13:15:00Z',
    },
    {
        id: 'BB-008',
        donorId: 'D-1008',
        donorName: 'Lisa Anderson',
        bloodType: 'AB-',
        collectionDate: '2024-01-09',
        expiryDate: '2024-02-09',
        volume: 450,
        status: 'Reserved',
        storage: 'Emergency Refrigerator',
        testResults: 'Passed',
        notes: 'Rare blood type - reserved for surgery',
        priority: 'high',
        temperature: '4°C',
        lastChecked: '2024-01-20T14:45:00Z',
    },
];

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const urgencyLevels = [
    {
        value: 'emergency',
        label: 'Emergency - Immediate (Life threatening)',
    },
    { value: 'urgent', label: 'Urgent - Within 24 hours' },
    { value: 'normal', label: 'Normal - Within a week' },
    { value: 'planned', label: 'Planned - Scheduled procedure' },
];
