/**
 * DIGIRA FEST S1 — REGISTRATION PORTAL BEHAVIOUR
 * Reads register/js/fest-config.js and wires each division button to its
 * own Google Form.
 *
 * Safety rules enforced here:
 *   - A button only receives an href when the configured URL is a real
 *     HTTPS Google Forms destination (see festIsValidFormUrl).
 *   - Unconfigured divisions stay non-interactive and display
 *     "Registration link coming soon".
 *   - Forms always open in a new tab with rel="noopener noreferrer".
 */
(function () {
  "use strict";

  if (typeof FEST_CONFIG === "undefined") return;

  var buttons = document.querySelectorAll("[data-form-key]");

  Array.prototype.forEach.call(buttons, function (button) {
    var key = button.getAttribute("data-form-key");
    var url = typeof festFormUrl === "function" ? festFormUrl(key) : null;
    var note = document.querySelector('[data-form-note="' + key + '"]');

    if (url) {
      button.setAttribute("href", url);
      button.setAttribute("target", "_blank");
      button.setAttribute("rel", "noopener noreferrer");
      button.removeAttribute("aria-disabled");
      button.classList.remove("is-disabled");
      button.classList.add("is-ready");
      if (note) {
        note.textContent =
          "Opens the official Google Form for this division in a new tab.";
        note.classList.add("is-info");
      }
    } else {
      /* No usable URL: keep the control inert and explain why. */
      button.removeAttribute("href");
      button.setAttribute("aria-disabled", "true");
      button.classList.add("is-disabled");
      button.classList.remove("is-ready");
      if (note) {
        note.textContent = "Registration link coming soon";
        note.classList.remove("is-info");
      }
      button.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }
  });

  /* Fee labels (single source of truth: fest-config.js). */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-fee-for]"),
    function (el) {
      var key = el.getAttribute("data-fee-for");
      if (typeof festFeeLabel !== "function") return;
      el.textContent = festFeeLabel(key);
      var fee = FEST_CONFIG.fees[key];
      el.classList.toggle("is-tbc", !fee || fee.status !== "confirmed");
    },
  );

  /* Event dates / eligibility, kept in sync with the shared config. */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-fest-date]"),
    function (el) {
      el.textContent = FEST_CONFIG.datesDisplay;
    },
  );
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-fest-date-np]"),
    function (el) {
      el.textContent = FEST_CONFIG.datesNepali;
    },
  );
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-fest-venue]"),
    function (el) {
      el.textContent = FEST_CONFIG.venue;
    },
  );
})();
