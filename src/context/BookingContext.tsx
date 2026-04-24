import { createContext, useContext, useState, ReactNode } from 'react'

interface BookingDefaults {
  service_type: string
  drop_location: string
  vehicle_type: string
  tripTitle: string
}

interface BookingContextType {
  bookingDefaults: BookingDefaults | null
  setBookingDefaults: (defaults: BookingDefaults | null) => void
}

const BookingContext = createContext<BookingContextType>({
  bookingDefaults: null,
  setBookingDefaults: () => {}
})

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingDefaults, setBookingDefaults] = useState<BookingDefaults | null>(null)

  return (
    <BookingContext.Provider value={{
      bookingDefaults,
      setBookingDefaults
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
