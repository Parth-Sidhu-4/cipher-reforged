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

	if (data?.leaderboard?.length > 3) {
		leaders = data.leaderboard.slice(0, 3);
		rest = data.leaderboard.slice(3);
	} else {
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
				return 'bg-[#FFFFFF]';
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
				return 'text-white';
		}
	};
</script>

<title>Cipher Reforged-Leaderboard</title>

<h2
	class="to-primary mt-8 bg-gradient-to-br from-slate-300 bg-clip-text py-4 text-center text-7xl font-medium tracking-tight text-transparent"
>
	Leaderboard
</h2>

<center>
	<div class="flex flex-wrap justify-center">
		{#each leaders as team, teamPosition}
			<GlowingStarsBackgroundCard bgColorclass={getBgColorFromPosition(teamPosition)}>
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
		{/each}
	</div>
</center>

<center>
	<div class="w-full max-w-[90%] overflow-x-auto md:w-[75%]">
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
					<tr class="text-sm md:text-xl">
						<th class="font-mono">#{teamIndex + 4}</th>
						<td class="max-w-[150px] font-bold break-words whitespace-normal">
							{team.teamName}
							{#if !team.gsv}
								<div class="badge badge-error badge-outline">Non-GSV</div>
							{/if}
							{#if team.teamName === 'Organizers'}
								<div class="badge badge-success badge-outline">Boss</div>
							{/if}
						</td>
						<td>{team.members}</td>
						<td>{team.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</center>
