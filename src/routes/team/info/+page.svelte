<script lang="ts">
	import { sendSuccessToast, sendErrorToast } from '$lib/utils/toast_utils';
	import { Button } from '$lib/components/ui/MovingBorder';
	import { Hammer } from 'lucide-svelte';

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
			} else {
				sendErrorToast('Failed to Leave', '');
			}
		} catch (err) {
			sendErrorToast('Error leaving team', ' ');
			console.error(err);
		}
		loading = false;
	};
</script>

<title>Cipher Reforged - Your Team</title>

<h2
	class="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-3xl font-medium tracking-tight text-transparent"
>
	Your team
</h2>

<center>
	<p
		class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-6xl font-bold text-transparent"
	>
		{teamName}
		{#if !gsv}
			<span class="ml-3 align-middle text-sm font-semibold text-red-500">(NON-GSV)</span>
		{/if}
	</p>

	<Button
		borderRadius="0.75rem"
		className="bg-white-300 text-white border-slate-800 text-lg font-medium font-mono"
		on:click={copyCode}
	>
		{#if clicked}
			Copied!
		{:else}
			{code}
		{/if}
	</Button>

	<p class="text-primary mt-4 font-sans text-lg font-medium">Members {members.length}/3</p>
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
