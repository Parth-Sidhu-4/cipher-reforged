<script lang="ts">
	import {
		GlowingStarsBackgroundCard,
		GlowingStarsDescription,
		GlowingStarsTitle
	} from '$lib/components/ui/GlowingStars';

	type Team = {
		teamName: string;
		members: number;
		score: number;
		gsv?: boolean;
	};

	export let data: {
		leaderboard: Team[];
	};

	let leaders: Team[] = [];
	let rest: Team[] = [];

	// Ensure data.leaderboard exists before slicing
	if (data?.leaderboard && data.leaderboard.length > 3) {
		leaders = data.leaderboard.slice(0, 3);
		rest = data.leaderboard.slice(3);
	} else if (data?.leaderboard) {
		leaders = data.leaderboard;
		rest = [];
	}

	const getBgColorFromPosition = (pos: number): string => {
		switch (pos) {
			case 0:
				return 'bg-[#FEE101]';
			case 1:
				return 'bg-[#D7D7D7]';
			case 2:
				return 'bg-[#A77044]';
			default:
				return 'bg-[#FFFFFF]'; // Fallback, though should only be for leaders 0-2
		}
	};

	const getTextColorFromPosition = (pos: number): string => {
		switch (pos) {
			case 0:
				return 'text-[#FEE101]';
			case 1:
				return 'text-[#D7D7D7]';
			case 2:
				return 'text-[#A77044]';
			default:
				return 'text-white'; // Fallback
		}
	};
</script>

<title>Cipher Reforged-Leaderboard</title>

<h2
	class="to-primary mt-8 bg-gradient-to-br from-slate-300 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
>
	Leaderboard
</h2>

<div class="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-4 p-4">
	{#each leaders as team, teamPosition}
		<div class="flex w-full min-w-[280px] justify-center sm:w-1/2 md:w-1/3 lg:w-1/4">
			<GlowingStarsBackgroundCard
				bgColorclass={getBgColorFromPosition(teamPosition)}
				className="w-full max-w-sm"
			>
				<GlowingStarsTitle className={getTextColorFromPosition(teamPosition)}>
					{team.teamName}
					{#if !team.gsv}
						<div class="badge badge-error badge-outline">Non-GSV</div>
					{/if}
					{#if team.teamName === 'Organizers'}
						<div class="badge badge-success badge-outline">Boss</div>
					{/if}
				</GlowingStarsTitle>

				<GlowingStarsDescription className={`font-bold ${getTextColorFromPosition(teamPosition)}`}>
					{team.members} member{#if team.members !== 1}s{/if} • {team.score} points
				</GlowingStarsDescription>
			</GlowingStarsBackgroundCard>
		</div>
	{/each}
</div>

<div class="mx-auto mt-8 w-full px-4 md:w-[75%] lg:w-[60%]">
	<div class="hidden overflow-x-auto md:block">
		<table class="table w-full table-auto">
			<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Members</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{#each rest as team, teamIndex}
					<tr class="text-sm md:text-base lg:text-xl">
						<th class="font-mono">#{teamIndex + 4}</th>
						<td class="max-w-[200px] font-bold break-words whitespace-normal">
							{team.teamName}
							{#if !team.gsv}
								<div class="badge badge-error badge-outline text-xs">Non-GSV</div>
							{/if}
							{#if team.teamName === 'Organizers'}
								<div class="badge badge-success badge-outline text-xs">Boss</div>
							{/if}
						</td>
						<td>{team.members}</td>
						<td>{team.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="block md:hidden">
		<h3 class="mb-4 text-center text-xl font-semibold text-white">Other Teams</h3>
		<div class="space-y-4">
			{#each rest as team, teamIndex}
				<div class="rounded-lg bg-gray-800 p-4 text-white shadow-lg">
					<div class="mb-2 flex items-center justify-between">
						<h4 class="text-lg font-bold">#{teamIndex + 4} {team.teamName}</h4>
						{#if !team.gsv}
							<div class="badge badge-error badge-outline text-xs">Non-GSV</div>
						{/if}
						{#if team.teamName === 'Organizers'}
							<div class="badge badge-success badge-outline text-xs">Boss</div>
						{/if}
					</div>
					<div class="flex justify-between text-sm text-gray-400">
						<span>Members: {team.members}</span>
						<span>Score: {team.score}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
