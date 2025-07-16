const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./camo-inv-firebase-adminsdk-fbsvc-5b5eec8f64.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://camo-inv-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

async function checkFirebaseData() {
  console.log('🔍 Checking Firebase Authentication Users...');
  
  try {
    // List authentication users
    const listUsers = await admin.auth().listUsers();
    console.log(`📊 Found ${listUsers.users.length} users:`);
    
    listUsers.users.forEach((user, index) => {
      console.log(`  User ${index + 1}:`);
      console.log(`    UID: ${user.uid}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Email Verified: ${user.emailVerified}`);
      console.log(`    Created: ${user.metadata.creationTime}`);
      console.log(`    Last Sign In: ${user.metadata.lastSignInTime}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error checking authentication:', error.message);
  }
  
  console.log('🔍 Checking Firestore Collections...');
  
  try {
    // Check inventory collection
    const inventorySnapshot = await db.collection('inventory').limit(3).get();
    console.log(`📁 Inventory collection - ${inventorySnapshot.docs.length} documents (showing first 3):`);
    
    inventorySnapshot.docs.forEach((doc, index) => {
      console.log(`  Document ${index + 1} ID: ${doc.id}`);
      console.log(`    Data:`, JSON.stringify(doc.data(), null, 2));
      console.log('');
    });
    
    // Check skus collection  
    const skusSnapshot = await db.collection('skus').limit(3).get();
    console.log(`📁 SKUs collection - ${skusSnapshot.docs.length} documents (showing first 3):`);
    
    skusSnapshot.docs.forEach((doc, index) => {
      console.log(`  Document ${index + 1} ID: ${doc.id}`);
      console.log(`    Data:`, JSON.stringify(doc.data(), null, 2));
      console.log('');
    });
    
    // Check users collection (if it exists)
    const usersSnapshot = await db.collection('users').limit(3).get();
    console.log(`📁 Users collection - ${usersSnapshot.docs.length} documents (showing first 3):`);
    
    usersSnapshot.docs.forEach((doc, index) => {
      console.log(`  Document ${index + 1} ID: ${doc.id}`);
      console.log(`    Data:`, JSON.stringify(doc.data(), null, 2));
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking Firestore:', error.message);
  }
}

checkFirebaseData().then(() => {
  console.log('✅ Firebase data check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});