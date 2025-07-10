import { auth } from '$lib/utils/firebase'; // adjust path if needed
import { signOut } from 'firebase/auth';

export async function logout() {
	try {
		await signOut(auth);
		console.log('User signed out');
		window.location.href = '/'; // optional: redirect to homepage or login
	} catch (err) {
		console.error('Logout error:', err);
	}
}
