<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth, type User, onAuthStateChanged, signOut } from 'firebase/auth';
	import { app, auth } from '$lib/utils/firebase';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Disc, ArrowUpRight, CheckCircle, Menu, X } from 'lucide-svelte';

	let user: User | null = null;
	let displayName = '';
	let message = '';
	let loading = false;
	let hasTeam = false;
	let loggedIn = false;
	let success = false;
	let showMobileMenu = false;

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
			goto('/');
		} catch (err) {
			console.error('Logout failed:', err);
		}
	};

	const updateName = async () => {
		if (!user) {
			message = '❌ You must be signed in to update your name.';
			success = false;
			return;
		}

		if (!displayName.trim()) {
			message = 'Name cannot be empty.';
			success = false;
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
			if (res.ok) {
				message = '✅ Name updated!';
				success = true;
			} else {
				message = result.error || 'Failed to update.';
				success = false;
			}
		} catch (err) {
			console.error(err);
			message = 'Something went wrong.';
			success = false;
		} finally {
			loading = false;

			// auto dismiss message after 3s
			setTimeout(() => {
				message = '';
			}, 3000);
		}
	};
	const closeMobileMenu = () => {
		showMobileMenu = false;
	};
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<title>Cipher Reforged - Profile</title>
<!-- Navbar -->
<div
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-transparent px-4 py-2 shadow-md backdrop-blur md:justify-start"
>
	<a
		class="btn btn-ghost text-md"
		class:text-primary={$page.url.pathname === '/'}
		href="/"
		on:click={closeMobileMenu}
	>
		<ArrowUpRight class="mr-1" /> Home
	</a>

	<div class="md:hidden">
		<button class="btn btn-ghost" on:click={() => (showMobileMenu = !showMobileMenu)}>
			{#if showMobileMenu}
				<X />
			{:else}
				<Menu />
			{/if}
		</button>
	</div>

	<div
		class="absolute top-full left-0 flex w-full flex-col items-center gap-2 border-b border-white/10 bg-transparent py-2 backdrop-blur md:static md:flex md:flex-row md:items-center md:justify-start md:border-none md:p-0 {showMobileMenu
			? 'flex'
			: 'hidden'}"
	>
		<a
			class="btn btn-ghost text-md"
			class:text-primary={$page.url.pathname === '/leaderboard'}
			href="/leaderboard"
			on:click={closeMobileMenu}
		>
			<ArrowUpRight class="mr-1" /> Leaderboard
		</a>

		{#if loggedIn}
			<a
				class="btn btn-ghost text-md"
				class:text-primary={$page.url.pathname === '/team/info'}
				href="/team/info"
				on:click={closeMobileMenu}
			>
				<ArrowUpRight class="mr-1" /> Team
			</a>
			<a
				class="btn btn-ghost text-md"
				class:text-primary={$page.url.pathname === '/profile'}
				href="/profile"
				on:click={closeMobileMenu}
			>
				<ArrowUpRight class="mr-1" /> Profile
			</a>

			{#if hasTeam}
				<a class="btn btn-ghost text-md" href="/play" on:click={closeMobileMenu}>
					<Disc class="mr-1" /> Play
				</a>
			{/if}

			<button
				on:click={() => {
					logout();
					closeMobileMenu(); // Close menu after logout
				}}
				class="btn btn-sm bg-red-500 text-white hover:bg-red-600 md:ml-auto"
			>
				Logout
			</button>
		{/if}
	</div>
</div>

<!-- Page Content -->
<div class="px-6 pt-24">
	<h1 class="mb-4 text-2xl font-bold">Set Your Display Name</h1>

	{#if user}
		<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<input
				class="input input-bordered w-full max-w-md"
				bind:value={displayName}
				placeholder="Enter your name"
			/>

			<button class="btn btn-primary whitespace-nowrap" on:click={updateName} disabled={loading}>
				{loading ? 'Saving...' : 'Save'}
			</button>
		</div>
	{:else}
		<p class="mb-4 font-medium text-red-500">⚠️ You must be signed in to set a display name.</p>
	{/if}
</div>

<!-- Floating Fancy Message -->
{#if message}
	<div
		class={`fixed top-6 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 transform rounded-xl px-6 py-4 text-sm shadow-lg transition-all duration-300
		${
			success
				? 'border border-indigo-300 bg-gradient-to-br from-indigo-700 to-violet-600 text-white'
				: 'border border-rose-300 bg-gradient-to-br from-rose-800 to-red-600 text-white'
		}`}
	>
		<div class="flex items-center gap-3 font-semibold">
			{#if success}
				<CheckCircle class="h-5 w-5 text-yellow-300" />
			{:else}
				<span>⚠️</span>
			{/if}
			<span>{message}</span>
		</div>
	</div>
{/if}
