// Run once to populate DB: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const students = [
  { name: "Aarav Sharma",  email: "aarav.sharma@gmail.com"  },
  { name: "Priya Patel",   email: "priya.patel@gmail.com"   },
  { name: "Rohan Mehta",   email: "rohan.mehta@gmail.com"   },
  { name: "Sneha Iyer",    email: "sneha.iyer@gmail.com"    },
  { name: "Karan Verma",   email: "karan.verma@gmail.com"   },
  { name: "Ananya Reddy",  email: "ananya.reddy@gmail.com"  },
  { name: "Vikram Singh",  email: "vikram.singh@gmail.com"  },
  { name: "Divya Nair",    email: "divya.nair@gmail.com"    },
  { name: "Arjun Gupta",   email: "arjun.gupta@gmail.com"   },
  { name: "Pooja Joshi",   email: "pooja.joshi@gmail.com"   }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB Atlas");

  // Drop collection entirely to clear any stale indexes
  await mongoose.connection.db.collection("students").drop().catch(() => {});

  await Student.insertMany(students);
  console.log("Seeded 10 students successfully");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
