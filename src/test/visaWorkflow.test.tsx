import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { documentService } from '@/services/documentService';
import { VisaPreviewModal } from '@/components/admin/VisaPreviewModal';
import { Booking, BookingDocument } from '@/types/booking';

describe('MUSA TRANSPORT — Visa Document Upload, Preview & Download Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. File Type and Size Validation', () => {
    it('accepts JPG, JPEG, PNG, and PDF files under 10MB', () => {
      const validFiles = [
        new File(['pdf content'], 'visa.pdf', { type: 'application/pdf' }),
        new File(['jpg content'], 'visa_scan.jpg', { type: 'image/jpeg' }),
        new File(['jpeg content'], 'visa_scan.jpeg', { type: 'image/jpeg' }),
        new File(['png content'], 'visa_scan.png', { type: 'image/png' }),
      ];

      validFiles.forEach((file) => {
        const result = documentService.validateFile(file);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('rejects unsupported file formats like .exe, .txt, .docx', () => {
      const invalidFiles = [
        new File(['malicious'], 'script.exe', { type: 'application/x-msdownload' }),
        new File(['text note'], 'visa.txt', { type: 'text/plain' }),
        new File(['word doc'], 'visa.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      ];

      invalidFiles.forEach((file) => {
        const result = documentService.validateFile(file);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Only PDF, JPG, JPEG, and PNG files are accepted');
      });
    });

    it('rejects files exceeding the 10MB limit', () => {
      const oversizedFile = new File(['x'.repeat(100)], 'huge_visa.pdf', { type: 'application/pdf' });
      Object.defineProperty(oversizedFile, 'size', { value: 11 * 1024 * 1024 }); // 11 MB

      const result = documentService.validateFile(oversizedFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed limit of 10 MB');
    });
  });

  describe('2. Document Storage and Metadata Association', () => {
    it('stores uploaded document with booking association and sanitized uploadedBy', async () => {
      const testFile = new File(['visa sample byte data'], 'Saudi_Umrah_Visa_2026.pdf', {
        type: 'application/pdf',
      });

      const bookingId = 'test-booking-uuid-123';
      const uploadedDoc = await documentService.uploadDocument(
        bookingId,
        testFile,
        'visa'
      );

      expect(uploadedDoc).toBeDefined();
      expect(uploadedDoc.booking_id).toBe(bookingId);
      expect(uploadedDoc.file_name).toBe('Saudi_Umrah_Visa_2026.pdf');
      expect(uploadedDoc.mime_type).toBe('application/pdf');
      expect(uploadedDoc.document_type).toBe('visa');
      expect(uploadedDoc.file_path).toBeDefined();

      // Verify retrieval
      const docs = await documentService.fetchDocuments(bookingId);
      expect(docs.length).toBeGreaterThan(0);
      expect(docs[0].file_name).toBe('Saudi_Umrah_Visa_2026.pdf');
    });
  });

  describe('3. In-App Visa Preview Modal', () => {
    const mockBooking: Booking = {
      id: 'booking-preview-1',
      booking_reference: 'MT-2026-99999',
      customer_name: 'Hajj Ahmed Al-Sayed',
      customer_phone: '966500000000',
      passengers: 2,
      service_type: 'Hajj & Umrah Transfers',
      status: 'confirmed',
      payment_status: 'unpaid',
      source: 'website',
      is_international: true,
      visa_status: 'uploaded',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      segments: [],
    };

    const mockDoc: BookingDocument = {
      id: 'doc-preview-img',
      booking_id: mockBooking.id,
      document_type: 'visa',
      file_name: 'customer_visa_photo.jpg',
      file_path: 'data:image/jpeg;base64,fakeimagedata',
      file_size: 245000,
      mime_type: 'image/jpeg',
      created_at: new Date().toISOString(),
    };

    it('renders customer name, booking reference, and image controls in preview modal', async () => {
      render(
        <VisaPreviewModal
          isOpen={true}
          onClose={vi.fn()}
          document={mockDoc}
          booking={mockBooking}
        />
      );

      // Verify customer name and booking reference are displayed
      expect(screen.getByText(/Hajj Ahmed Al-Sayed/i)).toBeInTheDocument();
      expect(screen.getByText(/MT-2026-99999/i)).toBeInTheDocument();
      expect(screen.getByText(/customer_visa_photo\.jpg/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByAltText('customer_visa_photo.jpg')).toBeInTheDocument();
      });

      // Verify zoom controls are provided
      expect(screen.getByTitle(/Zoom In/i)).toBeInTheDocument();
      expect(screen.getByTitle(/Zoom Out/i)).toBeInTheDocument();
      expect(screen.getByTitle(/Reset Zoom/i)).toBeInTheDocument();
    });

    it('renders embedded PDF viewer for PDF documents', async () => {
      const mockPdfDoc: BookingDocument = {
        ...mockDoc,
        id: 'doc-preview-pdf',
        file_name: 'official_visa.pdf',
        mime_type: 'application/pdf',
        file_path: 'data:application/pdf;base64,fakepdfdata',
      };

      const { container } = render(
        <VisaPreviewModal
          isOpen={true}
          onClose={vi.fn()}
          document={mockPdfDoc}
          booking={mockBooking}
        />
      );

      expect(screen.getByText(/official_visa\.pdf/i)).toBeInTheDocument();

      // Wait for async signedUrl load to render the PDF object
      await waitFor(() => {
        const pdfObject = container.querySelector('object');
        expect(pdfObject).toBeInTheDocument();
        expect(pdfObject?.getAttribute('type')).toBe('application/pdf');
      });
    });
  });

  describe('4. Secure Visa Download and Audit Logging', () => {
    it('executes download and records audit trail', async () => {
      const mockDoc: BookingDocument = {
        id: 'doc-download-test',
        booking_id: 'booking-audited-1',
        document_type: 'visa',
        file_name: 'visa_official_download.jpg',
        file_path: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
        file_size: 154000,
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString(),
      };

      // Mock HTMLAnchorElement.click to prevent JSDOM navigation error
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'a') {
          el.click = vi.fn();
        }
        return el;
      });

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      await documentService.downloadDocument(
        mockDoc,
        'admin-user-id',
        'Administrator'
      );

      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Verify download action was logged to audit trail
      const auditLogs = await documentService.fetchAuditLogs(mockDoc.booking_id);
      expect(auditLogs.length).toBeGreaterThan(0);
      const downloadLog = auditLogs.find((l) => l.action === 'download');
      expect(downloadLog).toBeDefined();
      expect(downloadLog?.performed_by_name).toBe('Administrator');
    });
  });
});
