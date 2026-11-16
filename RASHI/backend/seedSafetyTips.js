require("dotenv").config();

const mongoose = require("mongoose");
const SafetyTip = require("./models/SafetyTip");

const safetyTips = [
  {
    category: "self_defense",
    title: "Stay Alert",
    content: "Always be aware of your surroundings and avoid distractions when walking alone."
  },
  {
    category: "self_defense",
    title: "Trust Your Instincts",
    content: "If a person or situation makes you uncomfortable, move to a safe and populated place."
  },
  {
    category: "self_defense",
    title: "Learn Basic Self-Defense",
    content: "Learn basic self-defense techniques that can help you protect yourself and escape dangerous situations."
  },
  {
    category: "self_defense",
    title: "Use Your Voice",
    content: "If you feel threatened, shout for help and attract the attention of people nearby."
  },
  {
    category: "self_defense",
    title: "Keep Emergency Contacts Ready",
    content: "Save trusted contacts and emergency numbers so you can contact them quickly during an emergency."
  },

  {
    category: "travel",
    title: "Share Your Travel Plans",
    content: "Tell a trusted person where you are going and share your expected arrival time."
  },
  {
    category: "travel",
    title: "Avoid Isolated Areas",
    content: "Prefer well-lit and populated roads, especially when travelling alone."
  },
  {
    category: "travel",
    title: "Use Trusted Transportation",
    content: "Use verified taxis, public transportation, or trusted transportation services whenever possible."
  },
  {
    category: "travel",
    title: "Keep Your Phone Charged",
    content: "Keep your phone sufficiently charged and carry a power bank during longer journeys."
  },
  {
    category: "travel",
    title: "Stay Aware of Your Surroundings",
    content: "Pay attention to your surroundings when travelling, especially in unfamiliar places."
  },

  {
    category: "digital_safety",
    title: "Use Strong Passwords",
    content: "Use unique and difficult-to-guess passwords for your important online accounts."
  },
  {
    category: "digital_safety",
    title: "Enable Two-Factor Authentication",
    content: "Enable two-factor authentication whenever available to provide additional protection for your accounts."
  },
  {
    category: "digital_safety",
    title: "Avoid Suspicious Links",
    content: "Do not click suspicious links or download unexpected files from unknown sources."
  },
  {
    category: "digital_safety",
    title: "Never Share OTPs",
    content: "Never share your OTP, password, PIN, or other sensitive information with anyone."
  },
  {
    category: "digital_safety",
    title: "Protect Personal Information",
    content: "Avoid publicly sharing sensitive information such as your address, passwords, or financial details."
  },

  {
    category: "workplace",
    title: "Know Emergency Exits",
    content: "Learn the location of emergency exits, security desks, alarms, and emergency equipment."
  },
  {
    category: "workplace",
    title: "Report Harassment",
    content: "Report threatening, inappropriate, or harassing behavior through the appropriate workplace channels."
  },
  {
    category: "workplace",
    title: "Keep Emergency Contacts Accessible",
    content: "Keep your workplace security, HR, and emergency contact information easily accessible."
  },
  {
    category: "workplace",
    title: "Inform Someone When Working Late",
    content: "If you need to work late, inform someone you trust and use approved transportation or security arrangements."
  },
  {
    category: "workplace",
    title: "Document Serious Incidents",
    content: "When appropriate, keep a record of serious incidents including dates, locations, and relevant details."
  },

  {
    category: "general",
    title: "Keep Emergency Numbers Handy",
    content: "Save important emergency numbers and trusted contacts on your phone."
  },
  {
    category: "general",
    title: "Stay Connected",
    content: "Inform someone you trust about your destination when travelling or going somewhere alone."
  },
  {
    category: "general",
    title: "Stay Aware",
    content: "Pay attention to your surroundings, particularly in unfamiliar or crowded places."
  },
  {
    category: "general",
    title: "Keep Your Phone Ready",
    content: "Maintain sufficient battery on your phone and make sure emergency contacts can be reached quickly."
  },
  {
    category: "general",
    title: "Move to a Safe Place",
    content: "If you feel threatened, move toward a populated and well-lit location and contact someone you trust."
  }
];

async function seedSafetyTips() {
  try {
    await mongoose.connect(process.env.MONGO);

    await SafetyTip.deleteMany({});

    await SafetyTip.insertMany(safetyTips);

    console.log("Safety tips added successfully!");
    console.log(`Total tips: ${safetyTips.length}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

seedSafetyTips();