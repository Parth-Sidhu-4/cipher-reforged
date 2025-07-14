import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

// ✅ Replace this with real admin emails
const ADMIN_EMAILS = ['your-email@example.com'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');
	event.locals.user = null;

	if (sessionCookie) {
		try {
			const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
			const email = decodedToken.email ?? 'unknown@example.com';

			event.locals.user = {
				uid: decodedToken.uid,
				email,
				name: decodedToken.name ?? email,
				isAdmin: ADMIN_EMAILS.includes(email) // ✅ Important part
			};
		} catch (err) {
			console.warn('Invalid or expired session cookie:', err);
			event.cookies.delete('__session', { path: '/' });
		}

		// ✅ Add getSession method to match type definition
		event.locals.getSession = async () => {
			return event.locals.user ? { user: event.locals.user } : null;
		};
	}

	return resolve(event);
};
