export function getTrafficSource(
  referrer: string,
  currentUrl?: string,
): string {
  // ১. প্রথমে UTM source check করো (সবচেয়ে reliable, কারণ referrer অনেক সময় খালি থাকে)
  if (currentUrl) {
    try {
      const utmSource = new URL(currentUrl).searchParams
        .get("utm_source")
        ?.toLowerCase();

      if (utmSource) {
        if (utmSource.includes("email")) return "email";
        if (utmSource.includes("facebook")) return "facebook";
        if (utmSource.includes("instagram")) return "instagram";
        if (utmSource.includes("twitter") || utmSource.includes("x"))
          return "twitter";
        if (utmSource.includes("linkedin")) return "linkedin";
        if (utmSource.includes("youtube")) return "youtube";
        if (utmSource.includes("tiktok")) return "tiktok";
        if (utmSource.includes("google")) return "google";
        return utmSource; // অন্য যেকোনো custom utm_source সরাসরি ব্যবহার করো
      }
    } catch (err) {
      // invalid URL হলে ignore করে referrer check এ চলে যাও
    }
  }

  // ২. UTM না থাকলে referrer check করো
  if (!referrer || referrer === "direct") return "direct";

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();

    if (hostname.includes("google.")) return "google";
    if (hostname.includes("bing.com")) return "bing";
    if (hostname.includes("yahoo.com")) return "yahoo";

    if (hostname.includes("facebook.com") || hostname.includes("fb.com"))
      return "facebook";
    if (hostname.includes("instagram.com")) return "instagram";
    if (hostname.includes("twitter.com") || hostname.includes("x.com"))
      return "twitter";
    if (hostname.includes("linkedin.com")) return "linkedin";
    if (hostname.includes("t.co")) return "twitter";
    if (hostname.includes("youtube.com")) return "youtube";
    if (hostname.includes("tiktok.com")) return "tiktok";

    if (
      hostname.includes("mail.google.com") ||
      hostname.includes("outlook.live.com") ||
      hostname.includes("outlook.office.com") ||
      hostname.includes("outlook.office365.com") ||
      hostname.includes("mail.yahoo.com") ||
      hostname.includes("webmail")
    )
      return "email";

    if (hostname.includes("yourdomain.com")) return "internal";

    return "referral";
  } catch (err) {
    return "direct";
  }
}
