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

export function generateUniqueId(prefix: string = "id"): string {
    const random = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${timestamp}-${random}`;
}
