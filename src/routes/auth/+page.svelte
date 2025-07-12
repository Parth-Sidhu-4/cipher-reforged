<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ArrowUpRight, Disc } from 'lucide-svelte';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	let progVal = 0;
	let isAuthLoading = false;
	let isLoggedIn = false;
	let hasTeam = false;

	onMount(() => {
		auth.onAuthStateChanged(async (user) => {
			isLoggedIn = !!user;
			if (user) {
				const res = await fetch('/auth/status');
				const status = await res.json();
				hasTeam = status.user?.hasTeam ?? false;
			}
		});
	});

	const loginWithGoogle = async () => {
		try {
			isAuthLoading = true;
			progVal = 10;

			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			progVal = 40;

			const idToken = await result.user.getIdToken();
			progVal = 60;

			const res = await fetch('/api/session', {
				method: 'POST',
				body: JSON.stringify({ idToken }),
				headers: { 'Content-Type': 'application/json' }
			});
			progVal = 80;

			if (res.ok) {
				// Ensure backend has completed assigning session + team
				const statusRes = await fetch('/auth/status');
				const status = await statusRes.json();
				hasTeam = status.user?.hasTeam ?? false;

				progVal = 100;
				isLoggedIn = true;

				// ✅ Now safe to redirect
				goto('/ready');
			} else {
				console.error('Session creation failed');
				progVal = 0;
			}
		} catch (err) {
			console.error('Login failed:', err);
			progVal = 0;
		} finally {
			isAuthLoading = false;
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			await fetch('/api/logout', { method: 'POST' });
			window.location.href = '/';
		} catch (err) {
			console.error('Logout failed:', err);
		}
	};
</script>

<title>Cipher Reforged - Login</title>
<!-- ✅ Navbar -->
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
	{#if isLoggedIn}
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
		{#if hasTeam}
			<a class="btn btn-ghost text-md" href="/play">
				<Disc class="mr-1" /> Play
			</a>
		{/if}
		<button on:click={logout} class="btn btn-sm ml-auto bg-red-500 text-white hover:bg-red-600">
			Logout
		</button>
	{/if}
</div>
<GradientAnimation />
<!-- ✅ Main UI -->
<h2
	class="mt-24 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-7xl font-medium tracking-tight text-transparent"
>
	Gear up hunters!
</h2>

<center>
	<div
		class="radial-progress font-mono"
		class:text-sky-500={progVal !== 100}
		class:text-success={progVal === 100}
		style={`--value:${progVal};`}
		role="progressbar"
	>
		{progVal}%
	</div>
</center>

<center>
	<h2 class="mt-4 mb-2 font-sans text-4xl">Create your account</h2>
	<p class="mb-4 font-medium">
		Use your <b>GSV Email ID</b>.<br />
		If you don't have one, you can still play but you won't be considered for the prizes.
	</p>

	{#if !isLoggedIn}
		<!-- Login Button -->
		<button
			class="group/btn relative flex h-10 w-[50%] items-center justify-center space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-white shadow-[0px_0px_1px_1px_var(--neutral-800)]"
			style="z-index: 1;"
			disabled={isAuthLoading}
			on:click={loginWithGoogle}
		>
			<!-- White Google Icon -->
			<svg
				class="h-5 w-5 text-white"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 48 48"
				fill="currentColor"
			>
				<path
					d="M43.6 20.5H42V20H24v8h11.3C33.9 32.2 29.4 35 24 35c-6.1 0-11.3-4.9-11.3-11S17.9 13 24 13c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.1 6.6 28.8 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21 21-9.4 21-21c0-1.9-.2-3.3-.4-5.5z"
				/>
			</svg>

			<span class="cursor-pointer text-sm text-neutral-300">Sign in with Google</span>

			<!-- Glow Lines -->
			<span
				class="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-[#4E49C9] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
			></span>
			<span
				class="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
			></span>
		</button>
	{/if}
</center>
