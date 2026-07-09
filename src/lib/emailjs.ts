import emailjs from '@emailjs/browser'

type BookingEmailData = {
  customer_name: string
  customer_phone: string
  customer_email: string
  service_type: string
  pickup_location: string
  drop_location: string
  travel_date: string
  travel_time: string
  passengers: string
  vehicle_type: string
  message: string
}

emailjs.init(
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)

export const sendBookingEmail = async (
  formData: BookingEmailData
) => {
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formData
    )
    return { success: true, response }
  } catch (error) {
    return { success: false, error }
  }
}

export const sendConfirmationEmail = async (formData: BookingEmailData) => {
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER,
      formData
    )
    return { success: true, response }
  } catch (error) {
    return { success: false, error }
  }
}
