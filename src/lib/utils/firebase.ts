import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyB2Kg4YSUlQNZqsJbuX3McCuPSacJDJhZ4',
	authDomain: 'cipher-reforged.firebaseapp.com',
	projectId: 'cipher-reforged',
	storageBucket: 'cipher-reforged.firebasestorage.app',
	messagingSenderId: '215368973502',
	appId: '1:215368973502:web:ae0c5a104c873c284e32ef'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
