// src/app.d.ts
/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		user: {
			uid: string;
			email: decodedToken.email!;

			name: string;
			isAdmin: boolean;
		} | null;
		getSession: () => Promise<{
			user: {
				uid: string;
				email: string;
				name: string;
			};
		} | null>;
	}
}
