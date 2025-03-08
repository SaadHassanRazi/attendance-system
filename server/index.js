// Import required modules
import express from "express";
import cors from "cors";

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

// Sample Users
const users = [
  { id: 0, email: "student@example.com", name: "John", password: "12345678", role: "student", department: "Computer Science" },
  { id: 1, email: "admin@example.com", name: "Adam", password: "12345678", role: "admin", department: "Computer Science" },
  { id: 2, email: "admin2@example.com", name: "Kurt", password: "12345678", role: "admin", department: "Physics" },
  { id: 3, email: "student@example2.com", name: "Drew", password: "12345678", role: "student", department: "Physics" },
  { id: 4, email: "owner@example.com", name: "Vince", password: "owner123", role: "owner" },
  { id: 5, email: "student@example3.com", name: "Seth", password: "12345678", role: "student", department: "Physics" },
];

// Sample Departments
const departments = [
  { id: 0, name: "Computer Science" },
  { id: 1, name: "Physics" },
];

// Attendance Records
const attendanceRecords = [];

// Desired location (e.g., campus coordinates)
const DESIRED_LOCATION = {
  latitude: 29.38533095403263, // Example: San Francisco coordinates
  longitude:  71.6950555847979,
};
const ACCEPTABLE_RADIUS = 700; // meters

// Haversine formula to calculate distance between two points (in meters)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Endpoint to get users
app.get("/api/users", (req, res) => {
  res.send(users);
});

// Endpoint to get departments
app.get("/api/departments", (req, res) => {
  res.send(departments);
});

// Endpoint to check in with location validation
app.post("/api/attendance/checkin", (req, res) => {
  const { studentId, date, latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send({ error: "Location data is required for check-in." });
  }

  const distance = calculateDistance(
    latitude,
    longitude,
    DESIRED_LOCATION.latitude,
    DESIRED_LOCATION.longitude
  );

  if (distance > ACCEPTABLE_RADIUS) {
    return res.status(403).send({
      error: `You are ${Math.round(distance)} meters away from the desired location. Check-in is only allowed within ${ACCEPTABLE_RADIUS} meters.`,
    });
  }

  const existingRecord = attendanceRecords.find(
    (record) => record.studentId === parseInt(studentId) && record.date === date
  );

  if (existingRecord && existingRecord.checkInTime && !existingRecord.checkOutTime) {
    return res.status(400).send({ error: "Student already checked in today. Please check out first." });
  }

  if (existingRecord && existingRecord.checkOutTime) {
    return res.status(400).send({ error: "Student already completed attendance for today." });
  }

  const newRecord = {
    studentId: parseInt(studentId),
    email: users.find((u) => u.id === parseInt(studentId))?.email,
    department: users.find((u) => u.id === parseInt(studentId))?.department,
    date,
    checkInTime: new Date().toISOString(),
    checkOutTime: null,
    duration: 0,
    checkInLocation: { latitude, longitude }, // Store location for reference
  };

  attendanceRecords.push(newRecord);
  res.status(201).send({ message: "Check-in recorded successfully", newRecord });
});

// Endpoint to check out
app.post("/api/attendance/checkout", (req, res) => {
  const { studentId, date } = req.body;

  const record = attendanceRecords.find(
    (record) => record.studentId === parseInt(studentId) && record.date === date && !record.checkOutTime
  );

  if (!record) {
    return res.status(400).send({ error: "No active check-in found for today." });
  }

  const checkOutTime = new Date();
  const checkInTime = new Date(record.checkInTime);
  const duration = Math.round((checkOutTime - checkInTime) / (1000 * 60));

  record.checkOutTime = checkOutTime.toISOString();
  record.duration = duration;

  res.status(200).send({ message: "Check-out recorded successfully", record });
});

// GET endpoint to fetch attendance records
app.get("/api/attendance", (req, res) => {
  const { studentId } = req.query;

  if (studentId) {
    const filteredRecords = attendanceRecords.filter(
      (record) => record.studentId === parseInt(studentId)
    );
    res.send(filteredRecords);
  } else {
    res.send(attendanceRecords);
  }
});

// Endpoint to create a new department with an admin
app.post("/api/departments", (req, res) => {
  const { name, admin, email, password } = req.body;

  const existingDepartment = departments.find((dept) => dept.name === name);
  if (existingDepartment) {
    return res.status(400).send({ error: "Department already exists." });
  }

  const departmentId = departments.length;
  const newDepartment = { id: departmentId, name };
  departments.push(newDepartment);

  const newAdmin = {
    id: users.length,
    name: admin,
    email,
    password,
    role: "admin",
    department: name,
  };
  users.push(newAdmin);

  res.status(201).send({
    message: "Department and Admin created successfully",
    department: newDepartment,
    admin: newAdmin,
  });
});

// Endpoint to create a new student
app.post("/api/users", (req, res) => {
  const { name, email, password, department } = req.body;

  if (!name || !email || !password || !department) {
    return res.status(400).send({ error: "All fields are required." });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send({ error: "User with this email already exists." });
  }

  const departmentExists = departments.some((dept) => dept.name === department);
  if (!departmentExists) {
    return res.status(400).send({ error: "Invalid department." });
  }

  const newStudent = {
    id: users.length,
    name,
    email,
    password,
    role: "student",
    department,
  };

  users.push(newStudent);
  res.status(201).send({ message: "Student created successfully", student: newStudent });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});