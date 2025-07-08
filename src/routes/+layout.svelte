<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<header class="navbar bg-base-100 px-4 shadow-md">
	<div class="flex-1">
		<a href="/" class="text-xl font-bold">Cipher Reforged</a>
	</div>
	<nav class="flex items-center gap-4">
		<a href="/" class="btn btn-ghost btn-sm">Home</a>
		<a href="/leaderboard" class="btn btn-ghost btn-sm">Leaderboard</a>
		<a href="/team/info" class="btn btn-ghost btn-sm">Team</a>
		<a href="/profile" class="btn btn-ghost btn-sm">Profile</a>
		<!-- ✅ New Team link -->
	</nav>
</header>

<main class="p-6">
	<slot />
</main>
