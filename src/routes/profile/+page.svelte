<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth, type User, onAuthStateChanged, signOut } from 'firebase/auth';
	import { app, auth } from '$lib/utils/firebase';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Disc, ArrowUpRight } from 'lucide-svelte';

	let user: User | null = null;
	let displayName = '';
	let message = '';
	let loading = false;
	let loggedIn = false;

	onMount(() => {
		if (!browser) return;

		const authInstance = getAuth(app);
		user = authInstance.currentUser;

		if (user?.displayName) {
			displayName = user.displayName;
			loggedIn = true;
		}

		onAuthStateChanged(authInstance, (u) => {
			user = u;
			loggedIn = !!u;
			if (u?.displayName) displayName = u.displayName;
		});
	});

	const logout = async () => {
		try {
			await signOut(auth);
			await fetch('/api/logout', { method: 'POST' });
			goto('/auth');
		} catch (err) {
			console.error('Logout failed:', err);
		}
	};

	const updateName = async () => {
		if (!user) {
			message = '❌ You must be signed in to update your name.';
			return;
		}

		if (!displayName.trim()) {
			message = 'Name cannot be empty.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/profile/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ displayName })
			});

			const result = await res.json();
			message = res.ok ? '✅ Name updated!' : result.error || 'Failed to update.';
		} catch (err) {
			console.error(err);
			message = 'Something went wrong.';
		} finally {
			loading = false;
		}
	};
</script>

<!-- Navbar -->
<div
	class="fixed top-0 left-0 z-50 flex w-full items-center border-b border-white/10 bg-transparent px-4 py-2 shadow-md backdrop-blur"
>
	<a class="btn btn-ghost text-md" class:text-primary={$page.url.pathname === '/'} href="/">
		<ArrowUpRight class="mr-1" /> Home
	</a>
	<a
		class="btn btn-ghost text-md"
		class:text-primary={$page.url.pathname === '/leaderboard'}
		href="/leaderboard"
	>
		<ArrowUpRight class="mr-1" /> Leaderboard
	</a>

	{#if loggedIn}
		<a
			class="btn btn-ghost text-md"
			class:text-primary={$page.url.pathname === '/team/info'}
			href="/team/info"
		>
			<ArrowUpRight class="mr-1" /> Team
		</a>
		<a
			class="btn btn-ghost text-md"
			class:text-primary={$page.url.pathname === '/profile'}
			href="/profile"
		>
			<ArrowUpRight class="mr-1" /> Profile
		</a>

		<a class="btn btn-ghost text-md" href="/play">
			<Disc class="mr-1" /> Play
		</a>
		<button on:click={logout} class="btn btn-sm ml-auto bg-red-500 text-white hover:bg-red-600">
			Logout
		</button>
	{/if}
</div>

<!-- Page Content -->
<div class="px-6 pt-20">
	<h1 class="mb-4 text-2xl font-bold">Set Your Display Name</h1>

	{#if user}
		<input
			class="input input-bordered mb-2 w-full max-w-md"
			bind:value={displayName}
			placeholder="Enter your name"
		/>

		<button class="btn btn-primary" on:click={updateName} disabled={loading}>
			{loading ? 'Saving...' : 'Save'}
		</button>
	{:else}
		<p class="mb-4 font-medium text-red-500">⚠️ You must be signed in to set a display name.</p>
	{/if}

	{#if message}
		<p class="mt-4 text-sm">{message}</p>
	{/if}
</div>
