require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const SafePlace = require("./models/SafePlace");
const SafetyTip = require("./models/SafetyTip");

const run = async () => {
  await connectDB();

  const adminEmail = "admin@safetyportal.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Portal Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
    });
    console.log(`Admin created -> email: ${adminEmail} | password: Admin@123`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const safePlaceCount = await SafePlace.countDocuments();
  if (safePlaceCount === 0) {
    await SafePlace.insertMany([
      {
        name: "City Central Police Station",
        type: "police_station",
        address: "MG Road, City Center",
        phone: "100",
        location: { lat: 19.076, lng: 72.8777 },
        is24x7: true,
      },
      {
        name: "St. Mary's General Hospital",
        type: "hospital",
        address: "Hospital Road, City Center",
        phone: "108",
        location: { lat: 19.08, lng: 72.88 },
        is24x7: true,
      },
      {
        name: "Women's Helpline Center",
        type: "help_center",
        address: "Civic Complex, Sector 5",
        phone: "1091",
        location: { lat: 19.07, lng: 72.87 },
        is24x7: true,
      },
      {
        name: "Sahara NGO for Women",
        type: "ngo",
        address: "Community Hall, Sector 9",
        phone: "1800-123-456",
        location: { lat: 19.085, lng: 72.865 },
        is24x7: false,
      },
    ]);
    console.log("Sample safe places seeded.");
  } else {
    console.log("Safe places already exist, skipping.");
  }

  const tipCount = await SafetyTip.countDocuments();
  if (tipCount === 0) {
    await SafetyTip.insertMany([
      {
        title: "Stay Aware of Your Surroundings",
        content:
          "Avoid distractions like your phone when walking alone, especially at night. Stay alert to people and vehicles around you.",
        category: "general",
      },
      {
        title: "Share Your Live Location",
        content:
          "When traveling alone, share your live location with a trusted contact so they know your route and estimated arrival time.",
        category: "travel",
      },
      {
        title: "Basic Self-Defense Moves",
        content:
          "Learn simple techniques like a palm strike, elbow strike, and how to break free from a wrist grab. Practice them regularly.",
        category: "self_defense",
      },
      {
        title: "Protect Your Digital Privacy",
        content:
          "Avoid sharing your live location publicly on social media and review app permissions regularly to limit access to your data.",
        category: "digital_safety",
      },
      {
        title: "Know Your Workplace Rights",
        content:
          "Familiarize yourself with your organization's Internal Complaints Committee (ICC) process for reporting workplace harassment.",
        category: "workplace",
      },
    ]);
    console.log("Sample safety tips seeded.");
  } else {
    console.log("Safety tips already exist, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
