/**
 * Converts a direct Tixte URL to the proper display URL
 * From: https://ultigifs.tixte.co/webcam-gif-1762976042863.gif
 * To: https://ultigifs.tixte.co/r/webcam-gif-1762976042863.gif
 */
export function getTixteDisplayUrl(directUrl: string): string {
  if (!directUrl.includes('tixte.co')) {
    return directUrl; // Return as-is if not a Tixte URL
  }

  // Extract the domain and filename
  const url = new URL(directUrl);
  const domain = url.origin; // e.g., https://ultigifs.tixte.co
  const filename = url.pathname.substring(1); // Remove leading slash

  // Construct the display URL
  return `${domain}/r/${filename}`;
}

/**
 * Gets the direct download URL from a Tixte display URL
 * From: https://ultigifs.tixte.co/r/webcam-gif-1762976042863.gif
 * To: https://ultigifs.tixte.co/webcam-gif-1762976042863.gif
 */
export function getTixteDirectUrl(displayUrl: string): string {
  if (!displayUrl.includes('tixte.co/r/')) {
    return displayUrl; // Return as-is if not a Tixte display URL
  }

  return displayUrl.replace('/r/', '/');
}