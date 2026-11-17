/**
 * ============================================================
 * DIGIRA FEST S1 — SHARED TOURNAMENT CONFIGURATION
 * ============================================================
 * Single source of truth for the event dates, division list, entry
 * fees and Google Form registration URLs.
 *
 * Loaded by:
 *   - /events/digira-fest-s1.html   (event landing page, fees + dates)
 *   - /register/index.html         (registration portal, forms + fees)
 *
 * ------------------------------------------------------------
 * 1. GOOGLE FORM URLS  -> FEST_CONFIG.registrationForms
 * ------------------------------------------------------------
 * Each division has its own Google Form URL (never share one form
 * across divisions).
 *
 * Accepted URLs:
 *   https://docs.google.com/forms/d/e/<ID>/viewform
 *   https://forms.gle/<ID>
 *
 * Until a value is a valid HTTPS Google Forms URL, that division's
 * button is rendered disabled with "Registration link coming soon".
 * Nothing is ever linked to a placeholder.
 *
 * ------------------------------------------------------------
 * 2. ENTRY FEES  -> FEST_CONFIG.fees
 * ------------------------------------------------------------
 * Organizer-provided information:
 *   - Free Fire Clash Squad : Rs. 500
 *   - Free Fire Battle Royale : Rs. 500
 *   - MLBB : Rs. 500
 *   - eFootball : Rs. 250
 *
 * The fee UNIT (per player or per team) was not specified either, so it
 * is deliberately not displayed anywhere.
 *
 * To publish a fee once confirmed, change the division entry to:
 *   { status: "confirmed", amount: 500 }
 * ...and the event page + portal update automatically.
 *
 * ------------------------------------------------------------
 * 3. VENUE -> FEST_CONFIG.venue
 * ------------------------------------------------------------
 * Digira Fest S1 is a fully online event, confirmed by the organizer.
 * There is no physical venue, so the event schema uses
 * OnlineEventAttendanceMode + VirtualLocation and Google's Event rich
 * results (which require a physical location) do not apply.
 *
 * ------------------------------------------------------------
 * 4. DIVISIONS -> FEST_CONFIG.divisions
 * ------------------------------------------------------------
 * Order, numbering, names and descriptions shown on both pages.
 * ============================================================
 */
const FEST_CONFIG = {
  eventName: "Digira Fest S1",
  eventBrand: "Mythical Battlegrounds 2.0",
  organizedBy: "Digira Esports",

  /* ISO dates. No start/end TIMES exist yet, so none are published. */
  eventStartDate: "2026-12-03",
  eventEndDate: "2026-12-06",
  timezone: "Asia/Kathmandu",
  timezoneOffset: "+05:45",

  datesDisplay: "DECEMBER 3–6, 2026",
  datesNepali: "MANGSIR 17–20, 2083",
  eligibility: "+2 students across Nepal",
  maxAge: 19,

  /* Confirmed by the organizer: Digira Fest S1 has no physical venue. */
  venue: "Fully Online",
  venueNote: "No physical venue — every division runs online.",
  attendanceMode: "online",

  eventPageUrl: "https://digira.xyz/events/digira-fest-s1.html",
  portalUrl: "https://register.digira.xyz/",
  homeUrl: "https://digira.xyz/",

  registrationForms: {
    freeFireCS: "https://forms.gle/T68kRWBsW87p7Eoa8",
    freeFireBR: "https://forms.gle/DzdTq4RgbfgQmGKV9",
    mlbb: "https://forms.gle/BWNYdGedXG4HeRng9",
    eFootball: "https://forms.gle/FPuifEddWUYvkdFy9",
  },

  fees: {
    freeFireCS: { status: "confirmed", amount: 500 },
    freeFireBR: { status: "confirmed", amount: 500 },
    mlbb: { status: "confirmed", amount: 500 },
    eFootball: { status: "confirmed", amount: 250 },
  },

  divisions: [
    {
      id: "freeFireCS",
      index: "01",
      game: "FREE FIRE",
      format: "CLASH SQUAD",
      mark: "FF",
      accent: "blue",
      blurb:
        "Compete in the tactical, close-range Clash Squad format.",
      registerLabel: "REGISTER FOR CLASH SQUAD",
    },
    {
      id: "freeFireBR",
      index: "02",
      game: "FREE FIRE",
      format: "BATTLE ROYALE",
      mark: "FF",
      accent: "purple",
      blurb: "Compete for survival and victory in the Battle Royale format.",
      registerLabel: "REGISTER FOR BATTLE ROYALE",
    },
    {
      id: "mlbb",
      index: "03",
      game: "MOBILE LEGENDS: BANG BANG",
      format: "MLBB",
      mark: "ML",
      accent: "violet",
      blurb: "Enter the battlefield and compete in the MLBB division.",
      registerLabel: "REGISTER FOR MLBB",
    },
    {
      id: "eFootball",
      index: "04",
      game: "eFOOTBALL",
      format: "FOOTBALL SIM",
      mark: "eF",
      accent: "electric",
      blurb: "Showcase your football gaming skills in the eFootball division.",
      registerLabel: "REGISTER FOR eFOOTBALL",
    },
  ],
};

/**
 * True only for a real, HTTPS Google Forms destination.
 * Placeholder strings such as REPLACE_WITH_GOOGLE_FORM_URL are rejected.
 */
function festIsValidFormUrl(url) {
  if (typeof url !== "string") return false;
  const value = url.trim();
  if (!value) return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch (err) {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  const host = parsed.hostname.toLowerCase();
  if (host === "docs.google.com") return parsed.pathname.indexOf("/forms/") === 0;
  if (host === "forms.gle") return parsed.pathname.length > 1;
  return false;
}

/** Configured form URL for a division, or null when not usable. */
function festFormUrl(divisionId) {
  const url = FEST_CONFIG.registrationForms[divisionId];
  return festIsValidFormUrl(url) ? url.trim() : null;
}

/**
 * Display label for a division fee.
 * Returns "Fee to be confirmed" unless the fee is confirmed with a number.
 */
function festFeeLabel(divisionId) {
  const fee = FEST_CONFIG.fees[divisionId];
  if (!fee || fee.status !== "confirmed" || typeof fee.amount !== "number") {
    return "Fee to be confirmed";
  }
  return "Rs. " + fee.amount;
}

/** True when at least one division fee is still awaiting confirmation. */
function festHasPendingFees() {
  return FEST_CONFIG.divisions.some(function (division) {
    const fee = FEST_CONFIG.fees[division.id];
    return !fee || fee.status !== "confirmed";
  });
}
