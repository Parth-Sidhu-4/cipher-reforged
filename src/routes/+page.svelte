<script lang="ts">
	import { goto } from '$app/navigation';

	const handleGo = async () => {
		const res = await fetch('/auth/status');
		const data = await res.json();

		if (!data.user) {
			goto('/auth'); // not signed in
		} else if (!data.user.hasTeam) {
			goto('/team'); // no team yet
		} else {
			goto('/play'); // already has a team
		}
	};
</script>

<h1 class="mb-6 text-center text-4xl font-bold">Cipher Reforged</h1>
<div class="flex justify-center gap-4">
	<button on:click={handleGo} class="btn btn-primary">Let’s Go</button>
	<a href="/readme" class="btn btn-outline">Readme</a>
</div>
