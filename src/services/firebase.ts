import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCK4MR2Du7QwbpWU65jL-4Clv3-4FBEb7E",
  authDomain: "spora-juara.firebaseapp.com",
  projectId: "spora-juara",
  storageBucket: "spora-juara.firebasestorage.app",
  messagingSenderId: "800413939971",
  appId: "1:800413939971:web:5706913a538b2531261136"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
