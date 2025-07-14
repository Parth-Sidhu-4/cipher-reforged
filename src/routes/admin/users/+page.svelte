<script lang="ts">
	import { onMount } from 'svelte';
	type User = {
		uid: string;
		name: string;
		email: string;
		banned: boolean;
	};

	let users: User[] = [];

	async function fetchUsers() {
		const res = await fetch('/api/admin/users');
		const data = await res.json();
		users = data.users ?? [];
	}

	async function toggleBan(uid: string, banned: boolean) {
		await fetch('/api/admin/users/update-ban', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uid, banned: !banned })
		});
		await fetchUsers();
	}

	onMount(fetchUsers);
</script>

<h1 class="mb-6 text-2xl font-bold">👥 User Management</h1>

{#if users.length === 0}
	<p class="text-gray-400">No users found.</p>
{:else}
	<table class="w-full text-left text-white">
		<thead>
			<tr class="border-b border-white/20">
				<th class="py-2">Name</th>
				<th>Email</th>
				<th>Status</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr class="border-b border-white/10">
					<td class="py-2">{user.name}</td>
					<td>{user.email}</td>
					<td class={user.banned ? 'text-red-500' : 'text-green-500'}>
						{user.banned ? 'Banned' : 'Active'}
					</td>
					<td>
						<button
							on:click={() => toggleBan(user.uid, user.banned)}
							class={user.banned
								? 'text-green-500 hover:underline'
								: 'text-red-500 hover:underline'}
						>
							{user.banned ? 'Unban' : 'Ban'}
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
