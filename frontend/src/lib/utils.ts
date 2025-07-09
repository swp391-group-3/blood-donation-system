import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Donation } from './api/dto/donation';
import { Account } from './api/dto/account';
import { capitalCase } from 'change-case';
import { bloodGroupLabels } from './api/dto/blood-group';
import QRCode from 'qrcode';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDateTime = (value: Date) => {
    return `${value.toLocaleDateString()} at ${value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
};

export const generateCertificate = async (
    donation: Donation,
    member: Account,
): Promise<string> => {
    const donationDate = new Date(donation.created_at).toLocaleDateString(
        'en-GB',
    );
    return `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blood Donation Certificate</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Open Sans', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .certificate {
                width: 800px;
                height: 600px;
                background: white;
                border: 8px solid #d4af37;
                border-radius: 15px;
                position: relative;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .certificate::before {
                content: '';
                position: absolute;
                top: 15px;
                left: 15px;
                right: 15px;
                bottom: 15px;
                border: 2px solid #d4af37;
                border-radius: 8px;
                pointer-events: none;
            }
            
            .decorative-corner {
                position: absolute;
                width: 80px;
                height: 80px;
                background: linear-gradient(45deg, #d4af37, #f4e4a6);
                clip-path: polygon(0 0, 100% 0, 0 100%);
            }
            
            .corner-top-left {
                top: 0;
                left: 0;
            }
            
            .corner-top-right {
                top: 0;
                right: 0;
                transform: rotate(90deg);
            }
            
            .corner-bottom-left {
                bottom: 0;
                left: 0;
                transform: rotate(-90deg);
            }
            
            .corner-bottom-right {
                bottom: 0;
                right: 0;
                transform: rotate(180deg);
            }
            
            .header {
                text-align: center;
                padding: 40px 60px 20px;
                position: relative;
                z-index: 2;
            }
            
            .logo {
                width: 60px;
                height: 60px;
                background: #dc2626;
                border-radius: 50%;
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            
            .title {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 10px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }
            
            .subtitle {
                font-size: 18px;
                color: #6b7280;
                font-weight: 300;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            
            .content {
                padding: 20px 60px;
                text-align: center;
                position: relative;
                z-index: 2;
            }
            
            .presented-to {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 15px;
                font-style: italic;
            }
            
            .recipient-name {
                font-family: 'Playfair Display', serif;
                font-size: 32px;
                font-weight: 700;
                color: #dc2626;
                margin-bottom: 25px;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 10px;
                display: inline-block;
                min-width: 300px;
            }
            
            .recognition-text {
                font-size: 16px;
                line-height: 1.6;
                color: #374151;
                margin-bottom: 30px;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .highlight {
                color: #dc2626;
                font-weight: 600;
            }
            
            .footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 60px 40px;
                position: relative;
                z-index: 2;
            }
            
            .date-section, .signature-section {
                text-align: center;
            }
            
            .date-line, .signature-line {
                width: 200px;
                height: 2px;
                background: #d1d5db;
                margin-bottom: 8px;
            }
            
            .date-label, .signature-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .blood-drop {
                position: absolute;
                width: 20px;
                height: 20px;
                background: #dc2626;
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                transform: rotate(-45deg);
                opacity: 0.1;
            }
            
            .drop-1 { top: 100px; left: 100px; }
            .drop-2 { top: 150px; right: 120px; }
            .drop-3 { bottom: 120px; left: 80px; }
            .drop-4 { bottom: 180px; right: 90px; }
            
            .seal {
                position: absolute;
                bottom: 30px;
                right: 30px;
                width: 80px;
                height: 80px;
                background: radial-gradient(circle, #dc2626, #b91c1c);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                text-align: center;
                font-weight: bold;
                line-height: 1.2;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .certificate {
                    box-shadow: none;
                    margin: 0;
                }
            }
            
            @media (max-width: 850px) {
                .certificate {
                    width: 95%;
                    height: auto;
                    min-height: 600px;
                }
                
                .header, .content, .footer {
                    padding-left: 30px;
                    padding-right: 30px;
                }
                
                .title {
                    font-size: 28px;
                }
                
                .recipient-name {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <!-- Decorative corners -->
            <div class="decorative-corner corner-top-left"></div>
            <div class="decorative-corner corner-top-right"></div>
            <div class="decorative-corner corner-bottom-left"></div>
            <div class="decorative-corner corner-bottom-right"></div>
            
            <!-- Background blood drops -->
            <div class="blood-drop drop-1"></div>
            <div class="blood-drop drop-2"></div>
            <div class="blood-drop drop-3"></div>
            <div class="blood-drop drop-4"></div>
            
            <!-- Header -->
            <div class="header">
                <div class="logo">♥</div>
                <h1 class="title">Certificate of Appreciation</h1>
                <p class="subtitle">Blood Donation Recognition</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <p class="presented-to">This certificate is proudly presented to</p>
                <div class="recipient-name">${member.name}</div>
                <!-- Added donation date -->
                <p class="presented-to" style="margin-top: -10px;">Date of Donation: <span class="highlight">${donationDate}</span></p>
                <p class="recognition-text">
                    In recognition of your <span class="highlight">generous and life-saving contribution</span> 
                    through blood donation. Your selfless act of kindness has the power to save lives and 
                    brings hope to those in need. Thank you for being a <span class="highlight">hero</span> 
                    in our community and making a difference in the lives of others.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const generateDonationLabel = async (
    donation: Donation,
    member: Account,
): Promise<string> => {
    const url = await QRCode.toDataURL(window.location.href);

    return `
    <html>
        <head>
            <title>Blood Donation Label - ${donation.id}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f8f9fa;
                }
                .label {
                    background: white;
                    border: 2px solid #dc2626;
                    border-radius: 12px;
                    padding: 24px;
                    width: fit-content;
                    margin: 0 auto;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    background: linear-gradient(135deg, #dc2626, #ef4444);
                    color: white;
                    padding: 16px;
                    margin: -24px -24px 20px -24px;
                    border-radius: 10px 10px 0 0;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    display: grid;
                    gap: 20px;
                    align-items: start;
                }
                .info-section {
                    display: grid;
                    gap: 12px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .label-text {
                    font-weight: 600;
                    color: #374151;
                    min-width: 120px;
                }
                .value-text {
                    font-weight: 700;
                    color: #111827;
                }
                .qr-section {
                    text-align: center;
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .qr-code {
                    margin-bottom: 8px;
                }
                .qr-label {
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 500;
                }
                .blood-type {
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 18px;
                    display: inline-block;
                    border: 2px solid #fecaca;
                }
                .footer {
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 2px solid #e5e7eb;
                    text-align: center;
                    font-size: 12px;
                    color: #6b7280;
                }
                .urgent {
                    background: #fef3c7;
                    color: #d97706;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 16px;
                    border: 1px solid #fbbf24;
                }
                @media print {
                    body {
                        background: white;
                    }
                    .label {
                        box-shadow: none;
                    }
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
        </head>
        <body>
            <div class="label">
                <div class="header">🩸 BLOOD DONATION LABEL</div>

                <div class="urgent">⚠️ HANDLE WITH CARE - BIOLOGICAL MATERIAL</div>

                <div class="content">
                    <div class="qr-section">
                        <div class="qr-code">
                            <img id='qrcode' src="${url}" alt="QR Code" style="width: 240; height: 240">
                        </div>
                        <div class="qr-label">Scan for Details</div>
                    </div>
                    <div class="info-section">
                        <div class="info-row">
                            <span class="label-text">Donation ID:</span>
                            <span class="value-text"
                                >${donation.id}</span
                            >
                        </div>
                        <div class="info-row">
                            <span class="label-text">Type:</span>
                            <span class="value-text"
                                >${capitalCase(donation.type)}</span
                            >
                        </div>
                        <div class="info-row">
                            <span class="label-text">Volume:</span>
                            <span class="value-text">${donation.amount}ml</span>
                        </div>
                        <div class="info-row">
                            <span class="label-text">Donor:</span>
                            <span class="value-text">${member.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="label-text">Blood Group:</span>
                            <span class="blood-type"
                                >${bloodGroupLabels[member.blood_group]}</span
                            >
                        </div>
                        <div class="info-row">
                            <span class="label-text">Collection Date:</span>
                            <span class="value-text"
                                >${new Date().toLocaleDateString()}</span
                            >
                        </div>
                        <div class="info-row">
                            <span class="label-text">Collection Time:</span>
                            <span class="value-text"
                                >${new Date().toLocaleTimeString()}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `;
};

export function generateUniqueId(prefix: string = 'id'): string {
    const random = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${timestamp}-${random}`;
}
