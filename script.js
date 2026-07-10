// ===============================
// Smart Parking Management System
// Vanilla JavaScript
// ===============================

// Parking slots array
const parkingSlots = [];

// Total slots
const TOTAL_SLOTS = 20;

// Parking charge
const CHARGE_PER_10_SECONDS = 0.25;

// Current selected slot
let selectedSlot = null;

// DOM Elements
const parkingLot = document.getElementById("parkingLot");
const popup = document.getElementById("popup");

const ownerInput = document.getElementById("owner");
const vehicleInput = document.getElementById("vehicle");
const modelInput = document.getElementById("model");

const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const availableCount = document.getElementById("available");
const occupiedCount = document.getElementById("occupied");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const resetBtn = document.getElementById("resetBtn");

// Create parking slots
function createParkingSlots() {

    parkingSlots.length = 0;

    for (let i = 1; i <= TOTAL_SLOTS; i++) {

        parkingSlots.push({

            id: "P" + i,

            occupied: false,

            owner: "",

            vehicle: "",

            model: "",

            checkInTime: null

        });

    }

}

// Render all slots
function renderSlots() {

    parkingLot.innerHTML = "";

    parkingSlots.forEach((slot, index) => {

        const card = document.createElement("div");

        card.classList.add("slot");

        if (slot.occupied) {

            card.classList.add("occupied");

            const seconds =
                Math.floor((Date.now() - slot.checkInTime) / 1000);

            const timer = formatTime(seconds);

            const charge =
                ((seconds / 10) * CHARGE_PER_10_SECONDS).toFixed(2);

            card.innerHTML = `

                <div>

                    <h3>${slot.id}</h3>

                    <p><strong>Owner:</strong> ${slot.owner}</p>

                    <p><strong>Vehicle:</strong> ${slot.vehicle}</p>

                    <p><strong>Model:</strong> ${slot.model}</p>

                    <p><strong>Time:</strong> ${timer}</p>

                    <p><strong>Charge:</strong> ₹${charge}</p>

                </div>

                <button onclick="checkOut(${index})">

                    Check Out

                </button>

            `;

        } else {

            card.classList.add("available");

            card.innerHTML = `

                <div>

                    <h3>${slot.id}</h3>

                    <p>Available</p>

                </div>

                <button onclick="openCheckIn(${index})">

                    Check In

                </button>

            `;

        }

        parkingLot.appendChild(card);

    });

    updateCounters();

}

// Update Available and Occupied count
function updateCounters() {

    let occupied = 0;

    parkingSlots.forEach(slot => {

        if (slot.occupied) {

            occupied++;

        }

    });

    occupiedCount.textContent = occupied;

    availableCount.textContent =
        TOTAL_SLOTS - occupied;

}

// Format seconds
function formatTime(totalSeconds) {

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}

// Open popup
function openCheckIn(index) {

    selectedSlot = index;

    ownerInput.value = "";
    vehicleInput.value = "";
    modelInput.value = "";

    popup.style.display = "flex";

}

// Confirm Check In
confirmBtn.addEventListener("click", () => {

    const owner = ownerInput.value.trim();

    const vehicle = vehicleInput.value.trim();

    const model = modelInput.value.trim();

    if (
        owner === "" ||
        vehicle === "" ||
        model === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    parkingSlots[selectedSlot].occupied = true;

    parkingSlots[selectedSlot].owner = owner;

    parkingSlots[selectedSlot].vehicle = vehicle;

    parkingSlots[selectedSlot].model = model;

    parkingSlots[selectedSlot].checkInTime = Date.now();

    popup.style.display = "none";

    renderSlots();

});

// Cancel popup
cancelBtn.addEventListener("click", () => {

    popup.style.display = "none";

});

// Checkout
function checkOut(index) {

    const slot = parkingSlots[index];

    const seconds =
        Math.floor(
            (Date.now() - slot.checkInTime) / 1000
        );

    const charge =
        ((seconds / 10) * CHARGE_PER_10_SECONDS).toFixed(2);

    alert(

        "Parking Summary\n\n" +

        "Slot : " + slot.id + "\n" +

        "Owner : " + slot.owner + "\n" +

        "Vehicle : " + slot.vehicle + "\n" +

        "Model : " + slot.model + "\n\n" +

        "Parking Time : " +
        formatTime(seconds) +
        "\n\n" +

        "Total Charge : ₹" + charge

    );

    slot.occupied = false;

    slot.owner = "";

    slot.vehicle = "";

    slot.model = "";

    slot.checkInTime = null;

    renderSlots();

}

// Search Vehicle
searchBtn.addEventListener("click", () => {

    const value =
        searchInput.value
        .trim()
        .toLowerCase();

    const cards =
        document.querySelectorAll(".slot");

    cards.forEach(card => {

        card.classList.remove("highlight");

    });

    if (value === "") {

        return;

    }

    let found = false;

    parkingSlots.forEach((slot, index) => {

        if (

            slot.vehicle
                .toLowerCase()
                .includes(value)

        ) {

            cards[index].classList.add("highlight");

            cards[index].scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

            found = true;

        }

    });

    if (!found) {

        alert("Vehicle not found.");

    }

});

// Reset Parking
resetBtn.addEventListener("click", () => {

    const yes =
        confirm(
            "Reset all parking slots?"
        );

    if (!yes) {

        return;

    }

    createParkingSlots();

    renderSlots();

});

// Live timer update
setInterval(() => {

    renderSlots();

}, 1000);

// Initialize project
createParkingSlots();

renderSlots();