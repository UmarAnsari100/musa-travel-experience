import "@/i18n";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookingForm from "@/components/BookingForm";
import FleetPreviewSection from "@/components/FleetPreviewSection";
import { BookingProvider } from "@/context/BookingContext";

const scrollIntoViewMock = vi.fn();
Element.prototype.scrollIntoView = scrollIntoViewMock;

describe("FleetPreviewSection", () => {
  beforeEach(() => {
    scrollIntoViewMock.mockClear();
  });

  it("links fleet actions and preselects the booking form", async () => {
    render(
      <MemoryRouter>
        <BookingProvider>
          <FleetPreviewSection />
          <BookingForm />
        </BookingProvider>
      </MemoryRouter>
    );

    const section = document.getElementById("fleet-preview")!;
    expect(within(section).getByRole("heading", { name: "Our Fleet" })).toBeInTheDocument();
    const detailLinks = within(section).getAllByRole("link", { name: "View Details" });
    expect(detailLinks).toHaveLength(6);
    expect(within(section).getByRole("link", { name: "View Full Fleet" })).toHaveAttribute("href", "/fleet");
    expect(detailLinks[0]).toHaveAttribute("href", "/fleet#toyota-camry");

    fireEvent.click(within(section).getAllByRole("button", { name: "Book Now" })[0]);

    await waitFor(() => {
      expect(screen.getByText("Toyota Camry - Business Sedan")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    });
    expect(screen.getByDisplayValue("Camry")).toBeInTheDocument();
  });
});
