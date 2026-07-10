import emailjs from "@emailjs/browser";

type BookingEmailData = {
  customer_name: string;
  customer_phone?: string;
  customer_email: string;
  service_type: string;
  pickup_location?: string;
  drop_location?: string;
  travel_date?: string;
  travel_time?: string;
  passengers?: string;
  vehicle_type?: string;
  message?: string;
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
};

const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  adminTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  customerTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || "template_2my3nn4",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

emailjs.init(emailConfig.publicKey);

const getEmailJSError = (error: unknown) => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const emailError = error as { status?: unknown; text?: unknown; message?: unknown };
    return emailError.text || emailError.message || `EmailJS error status: ${emailError.status}`;
  }

  return error;
};

const assertEmailConfig = () => {
  const missing = Object.entries(emailConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing EmailJS env values: ${missing.join(", ")}`);
  }
};

export const buildBookingTemplateParams = (formData: BookingEmailData) => {
  const customerEmail = formData.customer_email.trim();
  const pickupLocation = formData.pickup_location || formData.pickup || "";
  const dropoffLocation = formData.drop_location || formData.dropoff || "";
  const pickupDate = formData.travel_date || formData.date || "";
  const pickupTime = formData.travel_time || formData.time || "";
  const vehicle = formData.vehicle_type || "";

  return {
    ...formData,

    // Existing admin-template names.
    pickup_location: pickupLocation,
    drop_location: dropoffLocation,
    travel_date: pickupDate,
    travel_time: pickupTime,
    vehicle_type: vehicle,

    // Customer-template names requested in EmailJS.
    dropoff_location: dropoffLocation,
    pickup_date: pickupDate,
    pickup_time: pickupTime,
    vehicle,

    // Useful aliases for EmailJS "To Email" and replies.
    customer_email: customerEmail,
    to_email: customerEmail,
    to_name: formData.customer_name,
    email: customerEmail,
    user_email: customerEmail,
    recipient_email: customerEmail,
    customer_reply_to: customerEmail,
    reply_to: customerEmail,
  };
};

export const sendBookingEmail = async (formData: BookingEmailData) => {
  assertEmailConfig();

  const params = buildBookingTemplateParams(formData);
  console.groupCollapsed("[EmailJS] Admin booking email");
  console.log("Template ID:", emailConfig.adminTemplateId);
  console.log("Recipient source: admin template settings");
  console.log("Params:", params);

  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.adminTemplateId,
      params,
      emailConfig.publicKey
    );

    console.log("Admin email response:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Admin email failed:", getEmailJSError(error), error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};

export const sendConfirmationEmail = async (formData: BookingEmailData) => {
  assertEmailConfig();

  const params = buildBookingTemplateParams(formData);

  if (!params.customer_email) {
    const error = new Error("Customer email is empty. Cannot send customer confirmation.");
    console.error("[EmailJS] Customer confirmation blocked:", error.message);
    return { success: false, error };
  }

  console.groupCollapsed("[EmailJS] Customer confirmation email");
  console.log("Template ID:", emailConfig.customerTemplateId);
  console.log("Recipient fields:", {
    customer_email: params.customer_email,
    to_email: params.to_email,
    email: params.email,
    user_email: params.user_email,
    recipient_email: params.recipient_email,
  });
  console.log("Params:", params);

  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.customerTemplateId,
      params,
      emailConfig.publicKey
    );

    console.log("Customer email response:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Customer email failed:", getEmailJSError(error), error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};
