<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { Toaster } from 'svelte-5-french-toast';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ArrowUpRight, Disc } from 'lucide-svelte';

	import { firebaseApp } from '$lib/firebase/client';
	import { auth } from '$lib/utils/firebase';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	let loggedIn = false;
	let hasTeam = false;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			loggedIn = !!user;

			if (user) {
				const res = await fetch('/auth/status');
				const status = await res.json();
				hasTeam = status.user?.hasTeam ?? false;
			}
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
</script>

<!-- 🧠 Navbar (always rendered) -->
{#if ['/', '/leaderboard', '/team'].includes($page.url.pathname)}
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
		{/if}
		{#if loggedIn}
			<a
				class="btn btn-ghost text-md"
				class:text-primary={$page.url.pathname === '/profile'}
				href="/profile"
			>
				<ArrowUpRight class="mr-1" /> Profile
			</a>
		{/if}
		{#if loggedIn && hasTeam}
			<a class="btn btn-ghost text-md" href="/play">
				<Disc class="mr-1" /> Play
			</a>
		{/if}

		{#if loggedIn}
			<button on:click={logout} class="btn btn-sm ml-auto bg-red-500 text-white hover:bg-red-600">
				Logout
			</button>
		{/if}
	</div>
{:else if $page.url.pathname === '/ready'}
	<div
		class="navbar z-50 border-b border-white/10 bg-[#1a1a1d]/80 px-4 py-2 shadow-md backdrop-blur"
	>
		<a class="btn btn-ghost text-md" href="/">
			<ArrowUpRight class="mr-1" /> Home
		</a>
	</div>
{/if}

{#if ['/', '/auth', '/ready', '/team/info', '/profile'].includes($page.url.pathname)}
	<GradientAnimation>
		<main class="px-6 py-10">
			<slot />
		</main>
	</GradientAnimation>
{:else}
	<!-- 🔵 Default background for other pages -->
	<div
		class="min-h-screen bg-gradient-to-br from-[#1E192B] via-[#100D17] to-[#1E192B] font-sans text-[#cccccc]"
	>
		<main class="px-6 py-10">
			<slot />
		</main>
	</div>
{/if}

<!-- 🔔 Toasts (always shown) -->
<Toaster position="top-right" />
