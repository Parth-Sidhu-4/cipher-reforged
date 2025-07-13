<script lang="ts">
	import { sendSuccessToast, sendErrorToast } from '$lib/utils/toast_utils';
	import { Button } from '$lib/components/ui/MovingBorder';
	import {
		Hammer,
		ArrowLeft,
		ArrowRight,
		ArrowUpRight,
		CheckCircle,
		History,
		Disc
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/utils/firebase';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	type Member = {
		uid: string;
		email: string;
		displayName: string;
		isLeader: boolean;
	};

	export let data: {
		teamName: string;
		code: string;
		members: Member[];
		gsv: boolean;
		banned?: boolean;
	};

	const { teamName, code, members, gsv, banned } = data;

	let clicked = false;
	let loading = false;
	let loggedIn = false;
	let hasTeam = true;
	let showMobileMenu = false;

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			loggedIn = !!user;
			hasTeam = true; // You can set this dynamically if needed
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

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(code);
			clicked = true;
			setTimeout(() => (clicked = false), 2000);
			sendSuccessToast('Team code copied!', '');
		} catch (err) {
			sendErrorToast('Failed to copy team code.', '');
			console.error(err);
		}
	};

	const leaveTeam = async () => {
		loading = true;
		try {
			const r = await fetch('/api/team/leave', {
				method: 'POST'
			});
			if (r.ok) {
				sendSuccessToast('Successfully Left', '');
				setTimeout(() => {
					window.location.href = '/';
				}, 1000); // Give user a moment to see the toast
			} else {
				sendErrorToast('Failed to Leave', '');
			}
		} catch (err) {
			sendErrorToast('Error leaving team', ' ');
			console.error(err);
		}
		loading = false;
	};
	const closeMobileMenu = () => {
		showMobileMenu = false;
	};
</script>

<title>Cipher Reforged - Team Info</title>
<GradientAnimation />
<!-- Navbar -->
<div
	class="absolute top-full left-0 flex w-full flex-col items-center gap-2 border-b border-white/10 py-2 shadow-lg md:static md:flex md:flex-row md:items-center md:justify-start md:border-none md:p-0 md:shadow-none
        
        {showMobileMenu ? 'bg-opacity-70 flex bg-black backdrop-blur-sm' : 'hidden'}
        "
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
				closeMobileMenu();
			}}
			class="btn btn-sm bg-red-500 text-white hover:bg-red-600 md:ml-auto"
		>
			Logout
		</button>
	{/if}
</div>
<!-- Main Page Content -->
<div class="pt-20">
	<title>Cipher Reforged - Your Team</title>

	<h2
		class="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-3xl font-medium tracking-tight text-transparent"
	>
		Your team
	</h2>

	<center>
		<div
			class="to-primary relative z-10 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-6xl font-bold text-transparent"
		>
			<span>{teamName}</span>
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				{#if !gsv}
					<div class="badge badge-error badge-outline">Non-GSV</div>
				{/if}
				{#if teamName === 'Organizers'}
					<div class="badge badge-success badge-outline">Boss</div>
				{/if}
			</div>
		</div>

		<Button
			borderRadius="0.75rem"
			className="cursor-pointer bg-white-300 text-white border-slate-800 text-lg font-medium font-mono"
			on:click={copyCode}
		>
			{#if clicked}
				Copied!
			{:else}
				{code}
			{/if}
		</Button>

		<p class="text-primary mt-4 font-sans text-lg font-medium">
			Members {members.length}/3
		</p>
	</center>

	<center>
		<div class="w-[50%]">
			<div class="overflow-x-auto">
				{#each members as member}
					<p class="mt-2 text-xl font-medium">
						{#if member?.isLeader}
							👑 <span class="font-bold">{member.displayName}</span>
						{:else}
							{member.displayName}
						{/if}
					</p>
				{/each}
			</div>
		</div>

		{#if !banned}
			<button
				class="btn btn-wide btn-outline btn-primary mt-10"
				disabled={loading}
				on:click={leaveTeam}
			>
				Leave team
			</button>
		{:else}
			<button class="btn btn-ghost text-primary mt-4 text-xl font-bold">
				<Hammer class="mr-2 inline-block" /> Your team was banned by an admin
			</button>
		{/if}
	</center>
</div>
