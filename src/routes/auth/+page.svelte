<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	let progVal = 0;
	let isAuthLoading = false;
	let isLoggedIn = false;
	let hasTeam = false;

	// Check for user session on load
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
				// Fetch status after login
				const statusRes = await fetch('/auth/status');
				const status = await statusRes.json();
				hasTeam = status.user?.hasTeam ?? false;
				progVal = 100;
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

<!-- UI -->
<h2
	class="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-7xl font-medium tracking-tight text-transparent"
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

	<!-- Show Login or Post-Login Actions -->
	{#if !isLoggedIn}
		<button
			class="group/btn relative flex h-10 w-[50%] items-center justify-center space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-white shadow-[0px_0px_1px_1px_var(--neutral-800)]"
			style="z-index: 1;"
			disabled={isAuthLoading}
			on:click={loginWithGoogle}
		>
			<span class="text-sm text-neutral-300">Sign in with Google</span>
			<span
				class="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
			></span>
			<span
				class="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
			></span>
		</button>
	{:else}
		<!-- Post-Login Buttons -->
		<div class="mt-6 flex w-[50%] flex-col items-center gap-4">
			<a
				href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cipher+Reforged&details=Join+us+for+the+ultimate+hunt!&dates=20250720T180000Z/20250720T200000Z"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-accent w-full"
			>
				Add to Google Calendar
			</a>

			<a
				href="https://discord.gg/YOUR_INVITE_CODE"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-secondary w-full"
			>
				Join Discord
			</a>

			{#if hasTeam}
				<a href="/play" class="btn btn-primary w-full"> Play</a>
			{:else}
				<a href="/team" class="btn btn-info w-full">Join or Create a Team</a>
			{/if}
		</div>
	{/if}
</center>
