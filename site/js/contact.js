

const bookingForm = document.getElementById("contact-form");
const successBox = document.getElementById("form-success");
const estimateBox = document.getElementById("price-estimate");
const MAX_MESSAGE_LENGTH = 500;


const validators = {
  name: function (value) {
    if (value.trim() === "") return "Please enter your name.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    if (!/^[\p{L}][\p{L}\s'-]*$/u.test(value.trim())) return "Name can contain only letters, spaces, hyphens and apostrophes.";
    return "";
  },
  email: function (value) {
    if (value.trim() === "") return "Please enter your email.";
    if (!isValidEmail(value.trim())) return "Enter a valid email, for example name@example.com.";
    return "";
  },
  phone: function (value) {
    // Optional field: only checked when something is typed
    if (value.trim() !== "" && !/^\+?[0-9\s()-]{10,15}$/.test(value.trim())) {
      return "Enter a valid phone number, e.g. +7 701 123 4567.";
    }
    return "";
  },
  tour: function (value) {
    return value === "" ? "Please choose a tour." : "";
  },
  travellers: function (value) {
    if (value === "") return "Please enter the number of travellers.";
    const count = Number(value);
    if (!Number.isInteger(count)) return "Travellers must be a whole number.";
    if (count < 1 || count > 8) return "We take 1 to 8 travellers per group.";
    return "";
  },
  date: function (value) {
    if (value === "") return "Please choose a start date.";
    const parts = value.split("-");
    const chosen = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen < today) return "The date cannot be in the past.";
    const month = chosen.getMonth(); // 0 = January
    if (month < 3 || month > 9) return "Trips run from April to October. Please pick a date in that period.";
    return "";
  },
  msg: function (value) {
    if (value.trim().length < 10) return "Message must be at least 10 characters.";
    if (value.length > MAX_MESSAGE_LENGTH) return "Message is too long (max " + MAX_MESSAGE_LENGTH + " characters).";
    return "";
  },
  agree: function (value, field) {
    return field.checked ? "" : "You must agree to be contacted about your request.";
  }
};


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function getDiscountRate(travellers) {
  return travellers >= 4 ? 0.1 : 0;
}

function calculateTripPrice(pricePerPerson, travellers) {
  const subtotal = pricePerPerson * travellers;
  return Math.round(subtotal * (1 - getDiscountRate(travellers)));
}

function showFieldError(field, message) {
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  document.getElementById(field.id + "-error").textContent = message;
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  document.getElementById(field.id + "-error").textContent = "";
}

function validateField(field) {
  const message = validators[field.id](field.value, field);
  if (message === "") {
    clearFieldError(field);
    return true;
  }
  showFieldError(field, message);
  return false;
}

function validateForm() {
  const invalidFields = [];
  bookingForm.querySelectorAll("[data-validate]").forEach(function (field) {
    if (!validateField(field)) {
      invalidFields.push(field);
    }
  });
  return invalidFields;
}

function updatePriceEstimate() {
  const tour = findDestination(document.getElementById("tour").value);
  const travellers = Number(document.getElementById("travellers").value);
  if (!tour || !Number.isInteger(travellers) || travellers < 1 || travellers > 8) {
    estimateBox.textContent = "Choose a tour and number of travellers to see the estimated price.";
    return;
  }
  const total = calculateTripPrice(tour.price, travellers);
  const discountText = getDiscountRate(travellers) > 0 ? " (10% group discount applied)" : "";
  estimateBox.textContent = "Estimated price: " + formatPrice(total) + " for " + travellers +
    (travellers === 1 ? " traveller" : " travellers") + discountText;
}

function updateMessageCounter() {
  const length = document.getElementById("msg").value.length;
  const counter = document.getElementById("msg-count");
  counter.textContent = length + " / " + MAX_MESSAGE_LENGTH;
  counter.classList.toggle("text-danger", length > MAX_MESSAGE_LENGTH);
}

function fillTourSelect() {
  const select = document.getElementById("tour");
  for (const tour of destinations) {
    const option = document.createElement("option");
    option.value = tour.id;
    option.textContent = tour.name + " - " + tour.days + (tour.days === 1 ? " day" : " days") + ", " + formatPrice(tour.price);
    select.appendChild(option);
  }
  const requestedTour = new URLSearchParams(window.location.search).get("tour");
  if (requestedTour && findDestination(requestedTour)) {
    select.value = requestedTour;
  }
}

function showSuccess(data) {
  const tour = findDestination(data.tour);
  successBox.innerHTML =
    "<strong>Thank you, " + data.name.trim().replace(/</g, "&lt;") + "!</strong> Your request for " + tour.name +
    " (" + data.travellers + (data.travellers === 1 ? " traveller" : " travellers") + ", starting " + data.date +
    ") has been received. We will reply to " + data.email.trim().replace(/</g, "&lt;") + " within 24 hours.";
  successBox.classList.remove("d-none");
  successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  showToast("Booking request sent");
}


document.addEventListener("DOMContentLoaded", function () {
  fillTourSelect();
  updatePriceEstimate();
  updateMessageCounter();

  // The earliest selectable date in the picker is today
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  document.getElementById("date").min = today.getFullYear() + "-" + month + "-" + day;

  const fields = bookingForm.querySelectorAll("[data-validate]");
  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
    const recheck = function () {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    };
    field.addEventListener("input", recheck);
    field.addEventListener("change", recheck);
  });

  document.getElementById("tour").addEventListener("change", updatePriceEstimate);
  document.getElementById("travellers").addEventListener("input", updatePriceEstimate);
  document.getElementById("msg").addEventListener("input", updateMessageCounter);

  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    successBox.classList.add("d-none");

    const invalidFields = validateForm();
    if (invalidFields.length > 0) {
      invalidFields[0].focus(); // jump to the first problem
      return;
    }

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      tour: document.getElementById("tour").value,
      travellers: Number(document.getElementById("travellers").value),
      date: document.getElementById("date").value
    };
    showSuccess(data);
    bookingForm.reset();
    updatePriceEstimate();
    updateMessageCounter();
  });
});
