import "@/i18n";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import BookingForm from "@/components/BookingForm";
import { BookingProvider } from "@/context/BookingContext";
import { bookingService } from "@/services/bookingService";

// Mock email service
vi.mock("@/lib/emailjs", () => ({
  sendBookingEmail: vi.fn().mockResolvedValue({ success: true }),
  sendConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("MUSA TRANSPORT — Simplified Single-Page Booking with Vehicle Selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders single-page form with essential fields and Choose Your Ride vehicle cards", () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    // Verify Essential fields exist on single page
    expect(screen.getByPlaceholderText(/pickup location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/drop-off location/i)).toBeInTheDocument();
    expect(document.querySelector('input[name="travel_date"]')).toBeInTheDocument();
    expect(document.querySelector('select[name="passengers"]')).toBeInTheDocument();

    // Verify "Choose Your Ride" section exists with real fleet vehicles
    expect(screen.getByText("Choose Your Ride")).toBeInTheDocument();
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.getByText("GMC Yukon")).toBeInTheDocument();
    expect(screen.getByText("Toyota Hiace")).toBeInTheDocument();

    // Verify Contact fields on same page
    expect(screen.getByPlaceholderText("e.g. Ahmed Tariq Khan")).toBeInTheDocument();
    expect(document.querySelector('input[name="customer_phone_local"]')).toBeInTheDocument();

    // Verify prominent Request Booking button
    expect(screen.getByRole("button", { name: /request booking/i })).toBeInTheDocument();
  });

  it("allows selecting a vehicle and updates vehicle selection state", () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    // Click GMC Yukon
    const gmcCard = screen.getByText("GMC Yukon");
    fireEvent.click(gmcCard);

    // Verify hidden vehicle_type input is updated to GMC
    const vehicleInput = document.querySelector('input[name="vehicle_type"]') as HTMLInputElement;
    expect(vehicleInput.value).toBe("GMC");
  });

  it("dynamically shows warnings and adjusts recommendations based on passenger count", async () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    const passengerSelect = document.querySelector('select[name="passengers"]') as HTMLSelectElement;

    // Change to 10 passengers
    fireEvent.change(passengerSelect, { target: { value: "10" } });

    // Toyota Camry only holds 4 pax, so it should display max capacity warning
    await waitFor(() => {
      expect(screen.getAllByText(/Max 4 Pax/i).length).toBeGreaterThan(0);
    });

    // Hidden input automatically switched to a vehicle that can fit 10 pax (Hiace / Coaster)
    const vehicleInput = document.querySelector('input[name="vehicle_type"]') as HTMLInputElement;
    expect(["Hiace", "Coaster", "Bus"]).toContain(vehicleInput.value);
  });

  it("displays visa verification options when international traveler checkbox is checked", async () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    // Check international traveler checkbox
    const intlCheckbox = screen.getByRole("checkbox");
    fireEvent.click(intlCheckbox);

    // Verify Visa information section is revealed
    await waitFor(() => {
      expect(screen.getByText(/For your safety and travel verification/i)).toBeInTheDocument();
      expect(screen.getByText("Secure Visa Upload")).toBeInTheDocument();
      expect(screen.getByText("Send via WhatsApp")).toBeInTheDocument();
    });
  });

  it("submits booking request and shows 'Booking Request Received' screen with reference and vehicle", async () => {
    const spyCreate = vi.spyOn(bookingService, "createBooking").mockResolvedValueOnce({
      id: "test-booking-id",
      booking_reference: "MT-2026-88888",
      customer_name: "Tariq Mansoor",
      customer_phone: "966501234567",
      passengers: 4,
      service_type: "Hajj & Umrah Transfers",
      status: "pending",
      payment_status: "unpaid",
      source: "website",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      segments: [
        {
          segment_order: 1,
          pickup_location: "Jeddah Airport Terminal 1",
          drop_location: "Fairmont Makkah",
          pickup_date: "2026-11-10",
          pickup_time: "10:00",
          vehicle_type: "Camry",
        },
      ],
    });

    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    // Fill Pickup & Destination
    const pickupInput = screen.getByPlaceholderText(/pickup location/i);
    fireEvent.change(pickupInput, { target: { value: "Jeddah Airport Terminal 1" } });

    const dropInput = screen.getByPlaceholderText(/drop-off location/i);
    fireEvent.change(dropInput, { target: { value: "Fairmont Makkah" } });

    // Fill Date
    const dateInput = document.querySelector('input[name="travel_date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-11-10" } });

    // Fill Name & Phone
    const nameInput = screen.getByPlaceholderText("e.g. Ahmed Tariq Khan");
    fireEvent.change(nameInput, { target: { value: "Tariq Mansoor" } });

    const phoneInput = document.querySelector('input[name="customer_phone_local"]') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: "501234567" } });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /request booking/i });
    fireEvent.click(submitBtn);

    // Verify Success Screen
    await waitFor(() => {
      expect(screen.getByText("Booking Request Received")).toBeInTheDocument();
      expect(screen.getByText("MT-2026-88888")).toBeInTheDocument();
      expect(screen.getByText("Tariq Mansoor")).toBeInTheDocument();
      expect(screen.getByText(/Chat with Dispatch on WhatsApp/i)).toBeInTheDocument();
    });

    expect(spyCreate).toHaveBeenCalled();
  });

  it("shows Send Visa on WhatsApp button with manual attachment instructions and formatted message link when international traveler chooses WhatsApp visa method", async () => {
    vi.spyOn(bookingService, "createBooking").mockResolvedValueOnce({
      id: "intl-booking-id",
      booking_reference: "MT-2026-INTL-1",
      customer_name: "Farhan Siddiqui",
      customer_phone: "966509998888",
      passengers: 2,
      service_type: "Hajj & Umrah Transfers",
      status: "pending",
      payment_status: "unpaid",
      source: "website",
      is_international: true,
      visa_status: "whatsapp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      segments: [
        {
          segment_order: 1,
          pickup_location: "Jeddah Airport",
          drop_location: "Hilton Makkah",
          pickup_date: "2026-12-01",
          pickup_time: "10:00",
          vehicle_type: "Camry",
        },
      ],
    });

    render(
      <MemoryRouter>
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/pickup location/i), { target: { value: "Jeddah Airport" } });
    fireEvent.change(screen.getByPlaceholderText(/drop-off location/i), { target: { value: "Hilton Makkah" } });
    const dateInput = document.querySelector('input[name="travel_date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-12-01" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. Ahmed Tariq Khan"), { target: { value: "Farhan Siddiqui" } });
    const phoneInput = document.querySelector('input[name="customer_phone_local"]') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: "509998888" } });

    // Enable international traveler
    const intlCheckbox = screen.getByRole("checkbox");
    fireEvent.click(intlCheckbox);

    // Select WhatsApp visa option
    await waitFor(() => screen.getByText("Send via WhatsApp"));
    const sendViaWhatsAppCard = screen.getByText("Send via WhatsApp");
    fireEvent.click(sendViaWhatsAppCard);

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /request booking/i }));

    // Verify Success Screen contains Visa WhatsApp action and clear instructions
    await waitFor(() => {
      expect(screen.getByText("Booking Request Received")).toBeInTheDocument();
      expect(
        screen.getByText("Please attach your visa image or PDF manually in WhatsApp before sending.")
      ).toBeInTheDocument();
    });

    const visaLinks = screen.getAllByRole("link", { name: /send visa on whatsapp/i });
    expect(visaLinks.length).toBeGreaterThan(0);
    const visaHref = visaLinks[0].getAttribute("href");
    expect(visaHref).toContain("https://wa.me/");
    expect(visaHref).toContain(encodeURIComponent("MT-2026-INTL-1"));
    expect(visaHref).toContain(encodeURIComponent("Farhan Siddiqui"));
    expect(visaHref).toContain(encodeURIComponent("*MUSA TRANSPORT | Visa Document Submission*"));
    expect(visaHref).toContain(encodeURIComponent("I will attach my visa document to this message for verification"));
  });
});
