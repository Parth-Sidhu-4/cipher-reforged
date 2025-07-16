<script lang="ts">
	import { Toaster } from 'svelte-5-french-toast';
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ArrowUpRight, Disc, Menu, X, Settings } from 'lucide-svelte';

	import { auth } from '$lib/utils/firebase';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	let loggedIn = false;
	let hasTeam = false;
	let showMobileMenu = false;
	let isAdmin = false;

	const adminUIDs = ['ZYVuKTPMO4Ydahd3UZqhZeBbZ3z2', 'jpjCQNrc4qevc7mtuiKnxtmGaJg1'];

	onMount(() => {
		// Force dark mode always
		document.documentElement.classList.add('dark');

		onAuthStateChanged(auth, async (user) => {
			loggedIn = !!user;

			if (user) {
				isAdmin = adminUIDs.includes(user.uid);

				try {
					const res = await fetch('/auth/status');
					if (res.ok) {
						const status = await res.json();
						hasTeam = status.user?.hasTeam ?? false;
					} else {
						console.error('Failed to fetch user status:', res.status, res.statusText);
						hasTeam = false;
					}
				} catch (error) {
					console.error('Error fetching user status:', error);
					hasTeam = false;
				}
			} else {
				hasTeam = false;
				isAdmin = false;
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

	const closeMobileMenu = () => {
		showMobileMenu = false;
	};
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{#if ['/', '/leaderboard', '/team', '/profile'].includes($page.url.pathname)}
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
			class="absolute top-full left-0 flex w-full flex-col items-center gap-2 border-b border-white/10 py-2 shadow-lg md:static md:flex md:flex-row md:items-center md:justify-start md:border-none md:p-0 md:shadow-none
            {showMobileMenu ? 'bg-opacity-70 flex bg-black backdrop-blur-sm' : 'hidden'}"
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

				{#if isAdmin}
					<a
						class="btn btn-sm bg-purple-600 text-white hover:bg-purple-700"
						href="/admin"
						on:click={closeMobileMenu}
					>
						<Settings class="mr-1" /> Admin
					</a>
				{/if}

				<button
					on:click={() => {
						logout();
						closeMobileMenu();
					}}
					class="btn btn-sm bg-red-500 text-white hover:bg-red-600 md:ml-auto"
				>
					Logout
				</button>
			{/if}
		</div>
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
	<div
		class="min-h-screen bg-gradient-to-br from-[#1E192B] via-[#100D17] to-[#1E192B] font-sans text-[#cccccc]"
	>
		<main class="px-6 py-10">
			<slot />
		</main>
	</div>
{/if}

<Toaster position="top-right" />
