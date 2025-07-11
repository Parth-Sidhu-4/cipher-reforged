// src/lib/firebase/client.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyB2Kg4YSUlQNZqsJbuX3McCuPSacJDJhZ4',
	authDomain: 'cipher-reforged.firebaseapp.com',
	projectId: 'cipher-reforged',
	storageBucket: 'cipher-reforged.firebasestorage.app',
	messagingSenderId: '215368973502',
	appId: '1:215368973502:web:ae0c5a104c873c284e32ef'
};

export const app = initializeApp(firebaseConfig);
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
