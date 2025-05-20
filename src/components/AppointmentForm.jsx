const BASE_URL = 'https://6821d7a9b342dce8004c075c.mockapi.io'; // Replace with your actual MockAPI base URL

// Load all users (patients + doctors + admin)
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Get doctors by filtering users with role 'doctor'
export async function getDoctors() {
  const users = await getUsers();
  return users.filter(user => user.role === 'doctor');
}

// Authenticate user by username and password
export async function authenticate(username, password) {
  const users = await getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
}

// Get all appointments
export async function getAppointments() {
  const res = await fetch(`${BASE_URL}/appointments`);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

// Add a new appointment
export async function addAppointment(appointment) {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!res.ok) throw new Error('Failed to add appointment');
  return res.json();
}

// Cancel appointment by id (update status to 'cancelled')
export async function cancelAppointment(appointmentId) {
  // First, get the appointment
  const appointmentRes = await fetch(`${BASE_URL}/appointments/${appointmentId}`);
  if (!appointmentRes.ok) return false;
  const appointment = await appointmentRes.json();

  // Update status to cancelled
  const res = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...appointment, status: 'cancelled' }),
  });
  return res.ok;
}

// Add a new user (patient registration)
export async function addUser(user) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export default AppointmentForm;
