import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyDiUABxobiKSm2WjzYfnJM-z5VcFQiUZs8',
	authDomain: 'netflix-dong47.firebaseapp.com',
	projectId: 'netflix-dong47',
	storageBucket: 'netflix-dong47.appspot.com',
	messagingSenderId: '855574600237',
	appId: '1:855574600237:web:0eb2b7c5f6d63d0c9436a4',
	measurementId: 'G-J3P4TRTYQP',
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
