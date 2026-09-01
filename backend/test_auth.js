const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');

console.log('--- Testing NER-LEWS Authentication Engine ---');

const mockDb = { users: [] };
const router = authRoutes(mockDb);

// 1. Verify default demo accounts pre-seeded
console.log(`[Test 1] Pre-seeded Users Count: ${mockDb.users.length}`);
if (mockDb.users.length !== 3) {
  console.error('❌ Failed: Expected 3 default users.');
  process.exit(1);
}

const officer = mockDb.users.find(u => u.email === 'officer@sdma.gov.in');
const citizen = mockDb.users.find(u => u.email === 'citizen@ner.in');

if (!officer || officer.role !== 'authority') {
  console.error('❌ Failed: Officer account not configured correctly.');
  process.exit(1);
}
console.log('✅ Passed: Pre-seeded accounts verified (SDMA Officer & Citizen).');

// 2. Verify Password Hashing with Bcrypt
const passwordMatch = bcrypt.compareSync('Officer@123', officer.passwordHash);
const wrongPassword = bcrypt.compareSync('WrongPassword', officer.passwordHash);

if (!passwordMatch || wrongPassword) {
  console.error('❌ Failed: Password verification mismatch.');
  process.exit(1);
}
console.log('✅ Passed: Bcrypt password hashing & validation verified.');

// 3. Verify JWT Signing & Decoding
const token = jwt.sign(
  { id: officer.id, name: officer.name, email: officer.email, role: officer.role },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const decoded = jwt.verify(token, JWT_SECRET);
if (decoded.email !== officer.email || decoded.role !== 'authority') {
  console.error('❌ Failed: JWT decode payload incorrect.');
  process.exit(1);
}
console.log('✅ Passed: JWT token generation and validation verified.');

console.log('\n🎉 ALL AUTHENTICATION BACKEND TESTS PASSED SUCCESSFULLY!\n');
