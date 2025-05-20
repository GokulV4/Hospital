const BASE_URL = "https://6821d7a9b342dce8004c075c.mockapi.io/"; // Your mockapi.io base URL

// Fetch all users
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Fetch a user by email
export async function fetchUserByEmail(email) {
  const users = await fetchUsers();
  return users.find((u) => u.email === email);
}

// Create a new user
export async function createUser(user) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Update user by ID
export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// Delete user by ID
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

// Fetch all appointments
export async function fetchAppointments() {
  const res = await fetch(`${BASE_URL}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

// Fetch appointment by ID
export async function fetchAppointmentById(id) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch appointment");
  return res.json();
}

// Create a new appointment
export async function createAppointment(appt) {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appt),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

// Update appointment by ID
export async function updateAppointment(id, data) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update appointment");
  return res.json();
}

// Delete appointment by ID
export async function deleteAppointment(id) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete appointment");
  return res.json();
}

// **New: fetchDoctors filters users with role 'doctor'**
export async function fetchDoctors() {
  const users = await fetchUsers();
  return users.filter((u) => u.role === "doctor");
}

export async function fetchPatients() {
  const users = await fetchUsers(); // fetch all users
  return users.filter(u => u.role === "patient"); // filter by role patient
}