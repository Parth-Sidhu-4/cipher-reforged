import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	// 🔐 Clear the session cookie
	cookies.delete('__session', { path: '/' });

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
