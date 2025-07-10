<script lang="ts">
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
	};

	const { teamName, code, members } = data;

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(code);
			alert('Team code copied!');
		} catch (err) {
			alert('Failed to copy code.');
			console.error(err);
		}
	};
</script>

<h1 class="mb-4 text-2xl font-bold">Team: {teamName}</h1>
<h1 class="mb-4 text-2xl font-bold">
	Team: {teamName}
	{#if !data.gsv}
		<span class="ml-2 text-sm font-semibold text-red-500">(NON-GSV)</span>
	{/if}
</h1>

<p class="mb-2">
	<b>Team Code:</b>
	<span class="bg-base-200 rounded px-2 py-1 font-mono">{code}</span>
	<button class="btn btn-sm btn-outline ml-2" on:click={copyCode}>Copy</button>
</p>

<h2 class="mt-4 text-lg font-semibold">Members:</h2>
<ul class="mt-2 list-inside list-disc">
	{#each members as member}
		<li>
			{#if member?.isLeader}
				<span class="font-bold">👑 {member.displayName}</span>
			{:else}
				{member.displayName}
			{/if}
		</li>
	{/each}
</ul>
