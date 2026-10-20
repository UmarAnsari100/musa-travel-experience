import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Booking } from '@/types/booking';
import { SITE_CONFIG, buildVerificationUrl } from '@/config/site';
import { generateVerificationToken } from '@/services/verificationService';

export const generateVoucherPDF = async (booking: Booking): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // 1. Generate Secure Verification QR Code
  // Uses centralized domain configuration (https://umarhtransport.com) and cryptographic token
  const verificationToken = booking.verification_token || generateVerificationToken(booking);
  const verificationUrl = buildVerificationUrl(booking.booking_reference, verificationToken);

  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#0B0D0F',
      light: '#FFFFFF',
    },
  });

  // 2. Background: Clean luxury parchment/white A4 canvas with gold and dark framing
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer thin gold border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin - 4) * 2, 3, 3, 'S');

  // Inner subtle border
  doc.setDrawColor(230, 225, 215);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin - 2) * 2, 2, 2, 'S');

  // 3. Header Bar: Deep Obsidian Black with Gold Highlights
  let currentY = margin + 2;
  const headerHeight = 34;

  doc.setFillColor(11, 13, 15);
  doc.roundedRect(margin, currentY, contentWidth, headerHeight, 2, 2, 'F');

  // Gold accent line beneath header
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, currentY + headerHeight - 1.2, contentWidth, 1.2, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(248, 245, 236);
  doc.text('MUSA', margin + 8, currentY + 14);

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('TRANSPORT', margin + 30, currentY + 14);

  // Subtitle
  doc.setFontSize(8.5);
  doc.setTextColor(184, 178, 163);
  doc.text('KINGDOM OF SAUDI ARABIA — PREMIUM UMRAH & HAJJ TRANSFERS', margin + 8, currentY + 22);
  doc.text('Ministry of Transport & Logistics Authorized Service', margin + 8, currentY + 27);

  // Booking Reference Box on the Right of Header
  doc.setFillColor(20, 23, 27);
  doc.roundedRect(pageWidth - margin - 58, currentY + 5, 50, 22, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - margin - 58, currentY + 5, 50, 22, 2, 2, 'S');

  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING REFERENCE', pageWidth - margin - 54, currentY + 11);

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.booking_reference, pageWidth - margin - 54, currentY + 19);

  currentY += headerHeight + 8;

  // 4. Voucher Title & Status Banner (Layout Fixed to Prevent Any Overlap)
  // Dynamically determines title to avoid describing pending bookings as official confirmations
  let voucherHeading = 'OFFICIAL TRANSPORTATION VOUCHER';
  let statusBadgeText = 'CONFIRMED';
  let statusBadgeColor: [number, number, number] = [22, 163, 74]; // Emerald

  if (booking.status === 'pending') {
    voucherHeading = 'RESERVATION REQUEST & TRAVEL VOUCHER';
    statusBadgeText = 'PENDING REVIEW';
    statusBadgeColor = [217, 119, 6]; // Amber
  } else if (booking.status === 'cancelled') {
    voucherHeading = 'CANCELLED RESERVATION VOUCHER';
    statusBadgeText = 'CANCELLED';
    statusBadgeColor = [220, 38, 38]; // Red
  } else if (booking.status === 'in_progress') {
    voucherHeading = 'ACTIVE DISPATCH JOURNEY VOUCHER';
    statusBadgeText = 'IN PROGRESS';
    statusBadgeColor = [37, 99, 235]; // Blue
  } else if (booking.status === 'completed') {
    voucherHeading = 'COMPLETED JOURNEY VOUCHER';
    statusBadgeText = 'COMPLETED';
    statusBadgeColor = [124, 58, 237]; // Purple
  }

  // Title on Left (max width capped at 126mm so it never overlaps the badge)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(11, 13, 15);
  const maxTitleWidth = contentWidth - 48; // 130mm available
  doc.text(voucherHeading, margin, currentY, { maxWidth: maxTitleWidth });

  // Status Badge on Right (fixed 44mm width, positioned cleanly on right margin)
  const badgeWidth = 44;
  const badgeHeight = 7.5;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = currentY - 5.5;

  doc.setFillColor(statusBadgeColor[0], statusBadgeColor[1], statusBadgeColor[2]);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'F');

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(statusBadgeText, badgeX + badgeWidth / 2, badgeY + 5.2, { align: 'center' });

  // Status Clarification Subtitle to prevent any confusion
  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  if (booking.status === 'pending') {
    doc.setTextColor(180, 83, 9);
    doc.text('⚠️ STATUS: PENDING DISPATCH REVIEW — NOT YET AN OFFICIALLY ALLOCATED RESERVATION', margin, currentY);
  } else if (booking.status === 'confirmed') {
    doc.setTextColor(22, 101, 52);
    doc.text('✓ STATUS: CONFIRMED RESERVATION — CHAUFFEUR & VEHICLE DISPATCH ALLOCATED', margin, currentY);
  } else if (booking.status === 'cancelled') {
    doc.setTextColor(185, 28, 28);
    doc.text('✗ STATUS: CANCELLED — THIS VOUCHER IS VOID AND NOT VALID FOR TRAVEL', margin, currentY);
  } else {
    doc.setTextColor(100, 95, 85);
    doc.text(`STATUS: ${statusBadgeText} — VERIFIED SERVICE ITINERARY`, margin, currentY);
  }

  currentY += 6;

  // 5. Customer Information Block (Left) + Verification QR Code (Right)
  const infoBlockHeight = 46;
  doc.setFillColor(245, 243, 238);
  doc.roundedRect(margin, currentY, contentWidth - 44, infoBlockHeight, 2, 2, 'F');
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, contentWidth - 44, infoBlockHeight, 2, 2, 'S');

  // Customer Details
  const col1X = margin + 6;
  const col2X = margin + 70;
  let infoY = currentY + 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 100, 85);
  doc.text('LEAD PASSENGER:', col1X, infoY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 15, 15);
  doc.text(booking.customer_name, col1X, infoY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 100, 85);
  doc.text('TOTAL PASSENGERS:', col2X, infoY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 15, 15);
  doc.text(`${booking.passengers} Person(s)`, col2X, infoY + 5);

  infoY += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 100, 85);
  doc.text('WHATSAPP / PHONE:', col1X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text(`+${booking.customer_phone}`, col1X, infoY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 100, 85);
  doc.text('SERVICE CLASS:', col2X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 15, 15);
  doc.text(booking.service_type, col2X, infoY + 5);

  infoY += 13;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(110, 100, 85);
  doc.text('ISSUE DATE:', col1X, infoY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text(new Date(booking.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), col1X, infoY + 4);

  if (booking.additional_passengers && booking.additional_passengers.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 100, 85);
    doc.text('TRAVEL COMPANIONS:', col2X, infoY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(booking.additional_passengers.join(', ').slice(0, 42), col2X, infoY + 4);
  }

  // QR Code on Right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 40, currentY, 40, infoBlockHeight, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 40, currentY, 40, infoBlockHeight, 2, 2, 'S');

  doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 37, currentY + 3, 34, 34);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 100, 85);
  doc.text('SCAN TO VERIFY', pageWidth - margin - 20, currentY + 40, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 140, 125);
  doc.text(SITE_CONFIG.domain, pageWidth - margin - 20, currentY + 43.5, { align: 'center' });

  currentY += infoBlockHeight + 10;

  // 6. Multi-Segment Journey Itinerary Cards
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 13, 15);
  doc.text('SCHEDULED JOURNEY ITINERARY', margin, currentY);

  currentY += 4;

  const segments = booking.segments || [];

  segments.forEach((seg, index) => {
    const cardHeight = 32;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, cardHeight, 2, 2, 'S');

    // Left gold strip with leg number
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, currentY, 8, cardHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(String(index + 1), margin + 3, currentY + 18);

    // Pickup & Drop locations
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(212, 160, 23);
    doc.text('FROM:', margin + 12, currentY + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 15, 15);
    doc.text(seg.pickup_location.slice(0, 48), margin + 24, currentY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(212, 160, 23);
    doc.text('TO:', margin + 12, currentY + 17);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 15, 15);
    doc.text(seg.drop_location.slice(0, 52), margin + 24, currentY + 17);

    // Timing & Vehicle info on right side
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('DATE & TIME:', margin + 115, currentY + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 15, 15);
    doc.text(`${seg.pickup_date} @ ${seg.pickup_time}`, margin + 138, currentY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('VEHICLE:', margin + 115, currentY + 17);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 15, 15);
    doc.text(`${seg.vehicle_type} (${seg.number_of_vehicles || 1} Unit)`, margin + 138, currentY + 17);

    // Flight or Notes row
    if (seg.flight_number || seg.hotel_name || seg.notes) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(110, 100, 85);
      const extra = [
        seg.flight_number ? `Flight: ${seg.flight_number}` : '',
        seg.hotel_name ? `Hotel: ${seg.hotel_name}` : '',
        seg.notes ? `Note: ${seg.notes}` : '',
      ]
        .filter(Boolean)
        .join(' | ');
      doc.text(extra.slice(0, 95), margin + 12, currentY + 26);
    }

    currentY += cardHeight + 4;
  });

  // 7. Special Instructions & Driver Coordination
  currentY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 13, 15);
  doc.text('DISPATCH & AIRPORT MEETING PROTOCOL', margin, currentY);

  currentY += 4;
  doc.setFillColor(248, 246, 240);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 55, 50);
  doc.text('• Airport Pickups: Your designated chauffeur will be positioned in the arrival hall holding a paging sign with your name.', margin + 4, currentY + 6);
  doc.text('• Flight Monitoring: Our operations dispatch center tracks your flight live. Delays are automatically accommodated.', margin + 4, currentY + 12);
  doc.text(`• 24/7 Operations Hotline & WhatsApp: ${SITE_CONFIG.supportPhoneFormatted} | Official Verification: ${SITE_CONFIG.domain}`, margin + 4, currentY + 18);

  // 8. Footer Bar: Luxury Golden Stamp
  const footerY = pageHeight - margin - 12;
  doc.setFillColor(11, 13, 15);
  doc.rect(margin, footerY, contentWidth, 12, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, footerY, contentWidth, 0.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text('MUSA TRANSPORT SAUDI ARABIA', margin + 6, footerY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 200);
  doc.text('Jeddah • Makkah Al-Mukarramah • Al-Madinah Al-Munawwarah', margin + 65, footerY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL VOUCHER', pageWidth - margin - 35, footerY + 7);

  return doc;
};

export const downloadVoucherPDF = async (booking: Booking): Promise<void> => {
  const doc = await generateVoucherPDF(booking);
  doc.save(`MUSA-VOUCHER-${booking.booking_reference}.pdf`);
};

export const getVoucherPDFBlob = async (booking: Booking): Promise<Blob> => {
  const doc = await generateVoucherPDF(booking);
  return doc.output('blob');
};

export const printVoucherPDF = async (booking: Booking): Promise<void> => {
  const doc = await generateVoucherPDF(booking);
  doc.autoPrint();
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank');
};
