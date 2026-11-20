/* Enquiry form.
   To send enquiries by email without a mail app, create a free form on formspree.io (or a similar
   service) using admin@sterlingautoservices.com, then paste its endpoint URL below,
   e.g. "https://formspree.io/f/xxxxxxxx". Leave it empty to fall back to opening the visitor's email app. */
const FORM_ENDPOINT = "";
const EMAIL = "admin@sterlingautoservices.com";

const form = document.getElementById("enquiry-form");
const status = document.getElementById("status");
const thanks = document.getElementById("thanks");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  if (data.get("_gotcha")) return; // spam trap

  if (!FORM_ENDPOINT) {
    const body = ["Name: " + data.get("first-name") + " " + data.get("last-name"),
      "Email: " + data.get("email"), "Phone: " + (data.get("phone") || ""), "", data.get("message")].join("\n");
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(data.get("subject")) +
      "&body=" + encodeURIComponent(body);
    status.textContent = "Your email app should now open with your message ready to send.";
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status);
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  } catch (err) {
    status.textContent = "Sorry, that didn’t send. Please email " + EMAIL + " instead.";
    button.disabled = false;
  }
});
