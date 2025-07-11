<script lang="ts">
	import Button from '$lib/components/ui/MovingBorder/Button.svelte';
	import { goto } from '$app/navigation';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';

	let showRules = false;

	const handleGo = async () => {
		const res = await fetch('/auth/status');
		const data = await res.json();

		console.log('User status:', data); // 👈 log it
		if (!data.user) {
			console.log('Redirecting to /auth');
			goto('/auth');
		} else {
			console.log('Redirecting to /ready');
			goto('/ready');
		}
	};
</script>

<title>Cipher Reforged - Home</title>

<div
	class="relative flex h-screen w-full flex-col items-center justify-center rounded-md antialiased"
>
	{#if !showRules}
		<div class="flex flex-col items-center justify-center px-4 md:px-32">
			<h2
				class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-4xl font-bold text-transparent md:text-6xl lg:text-7xl"
			>
				Cipher Reforged
			</h2>
			<p class="relative z-10 mx-auto my-2 max-w-lg text-center text-sm text-neutral-500">
				Practice Project based on Cipher Saga 2.0<br /> By Parth Sidhu
			</p>

			<div class="mt-6 flex justify-center gap-4">
				<Button
					borderRadius="0.75rem"
					className="cursor-pointer border-slate-800 bg-white-300 text-sm font-bold text-white"
					on:click={handleGo}
				>
					Let's Go
				</Button>
				<Button
					borderRadius="0.75rem"
					className="cursor-pointer border-slate-800 bg-white-300 text-sm font-bold text-white"
					on:click={() => (showRules = true)}
					style="pointer-events: auto;"
				>
					Read Me
				</Button>
			</div>
		</div>
	{:else}
		<div class="flex h-full flex-col items-center justify-start overflow-y-auto px-4 py-8 md:px-32">
			<div class="mt-6 flex justify-center">
				<Button
					borderRadius="0.75rem"
					className="cursor-pointer border-slate-800 bg-white-300 text-sm font-bold text-white"
					on:click={() => (showRules = false)}
					style="pointer-events: auto;"
				>
					Take Me Back
				</Button>
			</div>

			<div class="mt-6 flex justify-center pb-[3vh]">
				<div
					class="bg-white-300 w-[80vw] max-w-[80vw] min-w-[80vw] rounded-[0.75rem] border-2 border-slate-800 p-[5vh_10vw] text-sm text-white"
				>
					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-3xl font-bold text-transparent"
						>
							About Cipher Reforged
						</h2>
						<p class="relative z-10 text-justify text-sm text-neutral-400">
							<strong>Cipher Reforged</strong> is a practice project inspired by
							<strong>Cipher Saga 2.0</strong>, the cryptic hunt event conducted during EPITOME'25
							at Gati Shakti Vishwavidyalaya. It draws from the same spirit of riddles, deduction,
							and exploration — reimagined in a refined, standalone platform meant for learning,
							testing, and evolving new ideas in cryptic hunt design and implementation.
						</p>
					</div>

					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-2xl font-bold text-transparent"
						>
							What is Cipher Saga 2.0?
						</h2>
						<p class="relative z-10 text-justify text-sm text-neutral-400">
							Cipher Saga 2.0 was an online cryptic hunt event hosted during EPITOME'25, the annual
							techno-management fest of Gati Shakti Vishwavidyalaya. Participants teamed up to
							tackle a series of challenging levels, deciphering clues and solving riddles to
							progress. The event tested their wit, collaboration, and problem-solving skills, which
							left everyone thrilled and eager for more.
						</p>
					</div>
					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-2xl font-bold text-transparent"
						>
							What are cryptic hunts anyway?
						</h2>
						<p class="relative z-10 text-justify text-sm text-neutral-400">
							A cryptic hunt is like a puzzle-solving game where you solve riddles, clues, or
							challenges to move from one hint to the next. Each clue usually leads to the next
							clue, and the goal is to reach the final answer of a level by decoding all the hints
							along the way. It often involves thinking creatively, solving wordplay, interpreting
							patterns, and sometimes even searching online for hidden answers. It's a fun mix of
							brain teasers, logic, and exploration. Cipher coders, AI tools, QR codes, coding
							softwares, etc. are all allowed and encouraged to be used.
						</p>
					</div>

					<div class="flex flex-col items-center">
						<a href="https://github.com/technocratsgsv/Cipher-Saga-2.0.git">
							<img
								src="https://i.ibb.co/qM2wVX1z/Logo.png"
								alt="TechnoCrats"
								class="mx-auto mb-2 h-20 w-20 rounded-full"
							/>
							<h2
								class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
							>
								TechnoCrats Cipher Saga 2.0 repository (GitHub)
							</h2>
						</a>
					</div>
				</div>
			</div>
			<div class="pb-[4vh]">
				<h2
					class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-lg font-bold text-transparent"
				>
					Also a special thanks to Soham Wani bhaiya and Shreya Mohanty for the original Cipher Saga
					2.0 repository.
				</h2>
			</div>
		</div>
	{/if}
</div>
