<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { ArrowUpRight, Disc } from 'lucide-svelte';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	let progVal = 100;
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

<title>Cipher Reforged - Ready</title>
{#if isLoggedIn}
	<!-- ✅ Main UI -->
	<GradientAnimation />
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

		<h2 class="mt-4 mb-2 font-sans text-4xl">You're all set!</h2>

		<div class="mt-6 flex flex-col items-center justify-center gap-2 md:flex-row">
			<a
				href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cipher+Reforged&details=Join+us+for+the+ultimate+hunt!&dates=20250720T180000Z/20250720T200000Z"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3 text-base font-bold text-black shadow transition-all hover:brightness-110"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V8h14v11H5z"
					></path>
				</svg>
				Add to Calendar
			</a>

			<a
				href="https://discord.gg/YOUR_INVITE_CODE"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 rounded-xl bg-pink-400 px-8 py-3 text-base font-bold text-black shadow transition-all hover:brightness-110"
			>
				<svg class="h-6 w-6" viewBox="0 0 71 55" fill="currentColor">
					<path
						d="M60.104 4.552A58.004 58.004 0 0 0 46.852.8a.22.22 0 0 0-.231.111c-2.013 3.484-4.27 8.012-5.842 11.84a54.622 54.622 0 0 0-16.556 0A50.158 50.158 0 0 0 18.38.911a.223.223 0 0 0-.232-.111 58.037 58.037 0 0 0-13.26 3.75.206.206 0 0 0-.096.082C.425 20.064-.721 35.218.293 50.255a.224.224 0 0 0 .084.154 58.68 58.68 0 0 0 17.644 4.538.223.223 0 0 0 .235-.154c1.353-4.658 2.56-9.461 3.518-14.242a.223.223 0 0 0-.122-.248c-1.933-.874-3.766-1.939-5.564-3.125a.223.223 0 0 1-.022-.355c.375-.284.75-.569 1.112-.86a.22.22 0 0 1 .237-.023c11.62 5.288 24.258 5.288 35.792 0a.22.22 0 0 1 .238.022c.362.29.736.575 1.112.86a.223.223 0 0 1-.021.355 41.272 41.272 0 0 1-5.566 3.126a.223.223 0 0 0-.12.247c.96 4.801 2.166 9.604 3.519 14.242a.223.223 0 0 0 .235.154 58.678 58.678 0 0 0 17.643-4.538.222.222 0 0 0 .084-.153c1.247-17.1-.859-32.178-6.303-45.621a.208.208 0 0 0-.095-.083zM23.725 37.708c-3.54 0-6.455-3.254-6.455-7.245 0-3.99 2.874-7.244 6.455-7.244 3.596 0 6.497 3.276 6.455 7.244 0 3.991-2.874 7.245-6.455 7.245zm23.55 0c-3.54 0-6.455-3.254-6.455-7.245 0-3.99 2.874-7.244 6.455-7.244 3.596 0 6.497 3.276 6.455 7.244 0 3.991-2.859 7.245-6.455 7.245z"
					/>
				</svg>
				Join Discord
			</a>

			{#if hasTeam}
				<button
					class="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-400 px-8 py-3 text-base font-bold text-black shadow transition-all hover:brightness-110"
					on:click={() => goto('/play')}
				>
					<svg class="-ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
					Play
				</button>
			{:else}
				<button
					class="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-400 px-8 py-3 text-base font-bold text-black shadow transition-all hover:brightness-110"
					on:click={() => goto('/team')}
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
						/>
					</svg>
					Join or Create Team
				</button>
			{/if}
		</div>

		<div class="mt-4 flex justify-center">
			<button on:click={logout} class="btn btn-sm bg-red-500 text-white hover:bg-red-600">
				Logout
			</button>
		</div>
	</center>
{/if}
