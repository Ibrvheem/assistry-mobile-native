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

export function formatCurrency1(
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

export function formatCurrency(
  amount: number,
  currency?: "Naira" | "Yuan"
): string {
  const currencySymbol = currency === "Yuan" ? "¥" : "₦";
  const nairaAmount = amount / 100; // kobo -> naira
  const rounded = Math.round(nairaAmount);
  return `${currencySymbol}${rounded.toLocaleString("en-US")}`;
}


 // 🖼️ Helper for Cloudinary URLs
export function cloudinaryUrl (path?: string): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `https://res.cloudinary.com/<your-cloud-name>/image/upload/${path}`;
  };



import * as ImageManipulator from "expo-image-manipulator";

/**
 * Compress and resize image to be under ~100KB before upload.
 * @param uri - original image URI (local)
 * @returns optimized image URI (string)
 */
export async function optimizeImageBeforeUpload(uri: string): Promise<string> {
  try {
    const response2 = await fetch(uri);
    const blob2 = await response2.blob();
    const sizeInKB2 = blob2.size / 1024;
    // console.log(`image size: ${sizeInKB2.toFixed(2)} KB`);
    // Step 1: Start with moderate resize to reduce resolution
    const resized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }], // maintain aspect ratio
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Step 2: Check file size
    const response = await fetch(resized.uri);
    const blob = await response.blob();
    const sizeInKB = blob.size / 1024;
    // console.log(`Optimized image size: ${sizeInKB.toFixed(2)} KB`);

    // Step 3: If still too big, compress more aggressively
    if (sizeInKB > 100) {
      const extraCompressed = await ImageManipulator.manipulateAsync(
        resized.uri,
        [{ resize: { width: 720 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
      );
      return extraCompressed.uri;
    }

    return resized.uri;
  } catch (err) {
    console.error("Error optimizing image:", err);
    return uri; // fallback to original if manipulation fails
  }
}
