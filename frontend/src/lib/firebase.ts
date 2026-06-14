// frontend/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const user = result.user;
    
//     // Send to backend to create/get user and generate JWT
//     const response = await fetch('http://localhost:5000/api/auth/google', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name: user.displayName,
//         email: user.email,
//         avatar: user.photoURL,
//         googleId: user.uid
//       })
//     });
    
//     const data = await response.json();
//     return { success: true, token: data.token, user: data.user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };