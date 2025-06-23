'use client';

import { DonationForm } from '@/components/donation-form';
import { DonationOverviewCard } from '@/components/donation-overview-card';
import { useAppointment } from '@/hooks/use-appointment';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { formatDateTime } from '@/lib/utils';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { capitalCase } from 'change-case';

export default function AppointmentDonationPage() {
    const { id } = useParams<{ id: string }>();
    const { data: appointment, isPending, error } = useAppointment(id);

    if (isPending) {
        return <div></div>;
    }
    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    if (!appointment.donation) {
        return <DonationForm appointmentId={id} />;
    }

    const onPrint = async () => {
        const url = await QRCode.toDataURL(window.location.href);

        const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="margin: 0; color: #dc2626; font-size: 24px;">BLOOD DONATION RECORD</h1>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 10px;">
              <strong style="font-size: 18px;">Donation ID:</strong><br>
              <span style="font-size: 24px; font-weight: bold; color: #dc2626;">${appointment.donation.id}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
              <strong>Date & Time:</strong><br>
              ${formatDateTime(new Date(appointment.donation.created_at))}
            </div>
            
            <div style="margin-bottom: 10px;">
              <strong>Donor:</strong> ${appointment.member.name}<br>
              <strong>Blood Group:</strong> ${bloodGroupLabels[appointment.member.blood_group]}<br>
              <strong>Phone:</strong> ${appointment.member.phone}
            </div>
            
            <div style="margin-bottom: 10px;">
              <strong>Donation Type:</strong> ${capitalCase(appointment.donation.type)}<br>
              <strong>Volume:</strong> ${appointment.donation.amount}ml<br>
            </div>
          </div>
          
          <div style="text-align: center; margin-left: 20px;">
            <img src="${url}" alt="QR Code" style="width: 150px; height: 150px; border: 2px solid #ccc;">
            <div style="font-size: 12px; margin-top: 5px; color: #666;">Scan for Processing</div>
          </div>
        </div>
        
        <div style="border-top: 2px solid #ccc; padding-top: 15px; margin-top: 20px;">
          <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <strong>Instructions:</strong><br>
            1. Attach this label to blood collection bag<br>
            2. Scan QR code for component processing<br>
            3. Store according to component requirements
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666;">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p><strong>Appointment ID:</strong> ${appointment.id}</p>
          </div>
        </div>
      </div>
    `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Donation Label - ${appointment.donation.id}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div>
            <DonationOverviewCard
                appointmentId={id}
                onPrint={onPrint}
                donation={appointment.donation}
            />
        </div>
    );
}
