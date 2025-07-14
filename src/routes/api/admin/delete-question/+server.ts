import { json } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase/admin'; // your Firestore admin instance

export const POST = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id || typeof id !== 'string') {
			return json({ error: 'Invalid or missing ID' }, { status: 400 });
		}

		await adminDB.collection('questions').doc(id).delete();
		return json({ success: true });
	} catch (err) {
		console.error('Failed to delete question:', err);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
