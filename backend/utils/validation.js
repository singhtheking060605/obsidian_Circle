export function validatePhoneNumber(phone) {
  // Assuming the phone number regex is correct for your requirements
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}
