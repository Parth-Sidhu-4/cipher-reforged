<script lang="ts">
	export let data;
	const leaderboard = data.leaderboard;
</script>

<h1 class="mb-6 text-2xl font-bold">Leaderboard</h1>

{#if leaderboard.length === 0}
	<p class="text-gray-500">No teams found yet.</p>
{:else}
	<table class="border-base-300 table w-full border">
		<thead>
			<tr>
				<th class="text-left">#</th>
				<th class="text-left">Team</th>
				<th class="text-left">Score</th>
				<th class="text-left">Members</th>
				<th class="text-left">Last Updated</th>
			</tr>
		</thead>
		<tbody>
			{#each leaderboard as team, i}
				<tr class="border-base-300 border-t">
					<td>{i + 1}</td>
					<td>{team.teamName}</td>
					<td>{team.score}</td>
					<td>{team.members}</td>
					<td>
						{#if team.lastChange}
							{new Date(team.lastChange).toLocaleString()}
						{:else}
							—
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
