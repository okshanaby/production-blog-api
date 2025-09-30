export const generateUsername = () => {
  const prefix = "user-";
  const randomCharacters = Math.random().toString(36).substring(2, 15);
  return `${prefix}${randomCharacters}`;
};

// Simple parser
export const parseUserAgent = (ua: string | undefined): string => {
  if (!ua) return "Unknown Device";

  let browser = "Unknown Browser";
  let os = "Unknown OS";

  // Detect browser
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  // Detect OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("iPhone")) os = "iPhone";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
};

// Or use a library
// import UAParser from 'ua-parser-js';

// function parseUserAgent(ua: string): string {
//   const parser = new UAParser(ua);
//   const result = parser.getResult();

//   return `${result.browser.name} on ${result.os.name}`;
// }
