export const formatPhoneNumber = (phone: string) => {
  // Remove any non-numeric characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // Check if the cleaned phone number has the correct length
  if (cleanedPhone.length === 13) {
    return `+${cleanedPhone.slice(0, 3)} ${cleanedPhone.slice(
      3,
      6
    )} xxxx ${cleanedPhone.slice(10)}`;
  }

  return phone; // Return the original phone number if it doesn't match the expected length
};

export function formatCurrency(
  amount: number,
  currency?: "Naira" | "Yuan"
): string {
  const currencySymbol = currency === "Yuan" ? "¥" : "₦";
  const nairaAmount = amount / 100; // Convert from kobo to naira
  return `${currencySymbol}${nairaAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
