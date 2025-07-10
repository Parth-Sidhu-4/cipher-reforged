<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-5-french-toast';
	import '../app.css';
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
	import { auth } from '$lib/utils/firebase';
	import { goto } from '$app/navigation';

	let loggedIn = false;

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			loggedIn = !!user;
		});
	});

	const logout = async () => {
		try {
			await signOut(auth); // Clears Firebase client session
			await fetch('/api/logout', { method: 'POST' }); // Clears server session cookie
			goto('/auth'); // Redirect to login page
		} catch (err) {
			console.error('Logout failed:', err);
		}
	};
</script>

<div
	class="min-h-screen bg-gradient-to-br from-[#170e27] via-[#10102c] to-[#0d0d0e] font-sans text-[#cccccc]"
>
	<header class="navbar border-b border-white/10 bg-[#1a1a1d]/80 px-4 py-2 shadow-md backdrop-blur">
		<nav class="flex items-center gap-3 text-sm">
			<a
				href="/"
				class="rounded-lg px-3 py-1 text-white transition-all duration-200 hover:bg-[#a970ff33] hover:text-[#a970ff]"
				>Home</a
			>
			<a
				href="/leaderboard"
				class="rounded-lg px-3 py-1 text-white transition-all duration-200 hover:bg-[#a970ff33] hover:text-[#a970ff]"
				>Leaderboard</a
			>
			<a
				href="/team/info"
				class="rounded-lg px-3 py-1 text-white transition-all duration-200 hover:bg-[#a970ff33] hover:text-[#a970ff]"
				>Team</a
			>
			<a
				href="/profile"
				class="rounded-lg px-3 py-1 text-white transition-all duration-200 hover:bg-[#a970ff33] hover:text-[#a970ff]"
				>Profile</a
			>
			{#if loggedIn}
				<div class="navbar-end">
					<button
						on:click={logout}
						class="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
					>
						Logout
					</button>
				</div>
			{/if}
		</nav>
		<!-- Right side logout button -->
	</header>

	<main class="px-6 py-10">
		<slot />
	</main>

	<Toaster position="top-right" />
</div>
