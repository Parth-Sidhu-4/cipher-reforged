<script lang="ts">
	import Button from '$lib/components/ui/MovingBorder/Button.svelte';
	import { goto } from '$app/navigation';
	import GradientAnimation from '$lib/components/ui/GradientAnimation/GradientAnimation.svelte';
	import Countdown from '$lib/components/Countdown/Countdown.svelte';

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
	<GradientAnimation />
	{#if !showRules}
		<Countdown />
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
							About Cipher Saga 2.0
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
					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-2xl font-bold text-transparent"
						>
							How were the winners decided?
						</h2>
						<p class="relative z-10 text-justify text-sm text-neutral-400">
							Winners were decided based on the leaderboard standings at the end of the competition.
							The leaderboard ranks teams based on how quickly they solve the puzzles, with teams
							that solve earlier being placed higher. Accuracy was not a criteria.
						</p>
					</div>

					<div class="pb-[4vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-2xl font-bold text-transparent"
						>
							Learning resources
						</h2>
						<p class="relative z-10 pb-[0.5vh] text-justify text-sm text-neutral-400">
							Cryptic hunts generally revolve around tech, trivia, and mostly anything you can find
							on the internet. Googling was allowed and heavily encouraged, but it didn't directly
							get the answer in most cases. Players had to think logically,and make connections
							between different parts of levels. Cryptic hunts are all about connecting the dots and
							finding the solutions.
						</p>
						<p class="relative z-10 pb-[0.5vh] text-justify text-sm text-neutral-400">
							Players got their leads confirmed from the organisers. If they thought they've gotten
							stuck somewhere, they seeked for hints on Discord. The levels basically consisted of a
							set of clues, all which linked to ONE ANSWER. The difficulty was random. When players
							got two or more clues, they had to try to connect them and find an interrelated clue
							from it. In case they couldn't figure out the hint, they were recommended to try
							breaking it down and solving it in parts.
						</p>
						<p class="relative z-10 pb-[0.5vh] text-justify text-sm text-neutral-400">
							<i
								>Note: Not all tools and approaches are listed below. They got the players through
								some of the levels. But tougher levels required much more brain power and tools not
								listed here were also be used. Sky truly was the limit.</i
							>
						</p>
						<ul
							class="relative z-10 list-disc pb-[0.5vh] pl-5 text-justify text-sm text-neutral-400"
						>
							<li>
								<strong>Hunt's Site:</strong> Clues are sometimes hidden in the hunt's rules and maybe
								even in the event descriptions. The page title. The URL. Focus on every word carefully
								as almost every hunt uses a lot of wordplay.
							</li>
							<li>
								<strong>Source Code:</strong> Look at the code comments. There could be other links inside
								the code (This especially helps in cases in which there aren't any on-screen clues).
								You can even try using Inspect Element (Ctrl+Shift+I) or Viewing Page Source (Ctrl+Shift+U).
							</li>
							<li>
								<strong>Audio Files:</strong> Inspect the name, duration, and content. Use spectrograms
								and tools like Audacity or Sonic Visualizer for hidden text. Look for morse code, binary,
								or locked files. Adjust the tempo or format for clues.
							</li>
							<li>
								<strong>Videos/GIFs:</strong> Focus on specific frames, extract relevant audio, or slow
								down/speed up videos to uncover clues. Visual or audio elements like morse/binary code
								may be hidden.
							</li>
							<li>
								<strong>Images:</strong> Check the image file name, dimensions, and metadata for hidden
								strings or steganography. Use tools like Aperisolve to detect and extract hidden info
								by adjusting contrast or brightness.
							</li>
							<li>
								<strong>Backlinks:</strong> If it looks like a completely random string, try appending
								it to the end of common URL patterns, like bit.ly/string, youtube.com/watch?v=string
								etc. This is known as a backlink. Backlinks are key! Use sites like imgur, pastebin,
								bit.ly, and tinyurl. For encrypted pastebins, find the password clues. Use a4x.me to
								identify backlinks when unsure.
							</li>
							<li>
								<strong>Ciphers:</strong> Pay attention to ciphers, such as Morse code, binary, or simple
								text substitutions (like Caesar or Vigenère ciphers). The creators are known to use a
								lot of ciphers, so expect clues to be encoded in these forms, often hidden within clues
								or images.
							</li>
							<li>
								<strong>Geocodes:</strong> Sometimes, when there are random numbers on the screen, try
								using geocoding sites that can make you arrive at the next clue. Try puting those coordinates
								in Google maps or geocoding sites like geocode.xyz. Another site called geoapify.com
								can prove useful as well. Try lingering with the words and get to sites like what3words
								or any other popular and unique geocoding software.
							</li>
						</ul>
					</div>
					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-3xl font-bold text-transparent"
						>
							Redeveloped from Scratch By
						</h2>
					</div>
					<div class="pb-[4vh]">
						<div class="flex flex-col items-center">
							<a href="https://www.linkedin.com/in/parth-sidhu/">
								<img
									src="https://i.ibb.co/CKzzttDT/Parth-Sidhu.jpg"
									alt="Parth Sidhu"
									width="80"
									height="80"
									loading="lazy"
									class="mx-auto mb-2 h-20 w-20 rounded-full object-cover"
								/>
								<h2
									class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
								>
									Parth Sidhu
								</h2>
								<p class="relative z-10 pb-[1vh] text-center text-sm text-neutral-400">
									(Hobbyist Developer)
								</p>
							</a>
						</div>
					</div>

					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-3xl font-bold text-transparent"
						>
							The OG Cipher Saga 2.0 Team
						</h2>
					</div>

					<div class="pb-[4vh]">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3">
							<div class="flex flex-col items-center">
								<a href="https://www.linkedin.com/in/soham-wani-b0726a262/">
									<img
										src="https://i.ibb.co/whYZ0Ws3/Whats-App-Image-2025-03-13-at-9-40-35-PM.jpg"
										alt="Soham Wani"
										width="80"
										height="80"
										loading="lazy"
										class="mx-auto mb-2 h-20 w-20 rounded-full object-cover"
									/>

									<h2
										class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
									>
										Soham Wani
									</h2>
									<p class="relative z-10 pb-[1vh] text-center text-sm text-neutral-400">
										(Event Head)
									</p></a
								>
							</div>
							<div class="flex flex-col items-center">
								<a href="https://www.linkedin.com/in/shreya-mohanty-755529296/">
									<img
										src="https://i.ibb.co/d4v8xBmj/IMG-20250314-WA0093.jpg"
										alt="Shreya Mohanty"
										width="80"
										height="80"
										loading="lazy"
										class="mx-auto mb-2 h-20 w-20 rounded-full object-cover"
									/>

									<h2
										class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
									>
										Shreya Mohanty
									</h2>
									<p class="relative z-10 pb-[1vh] text-center text-sm text-neutral-400">
										(Event Head)
									</p></a
								>
							</div>
							<div class="flex flex-col items-center">
								<a href="https://www.linkedin.com/in/rishav-kumar-2399241ab/">
									<img
										src="https://i.ibb.co/tpyz2pZL/58198da2-d4f5-4e08-bbe8-085c751453ff.jpg"
										alt="Rishav Kumar"
										width="80"
										height="80"
										loading="lazy"
										class="mx-auto mb-2 h-20 w-20 rounded-full object-cover"
									/>

									<h2
										class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
									>
										Rishav Kumar
									</h2>
									<p class="relative z-10 pb-[1vh] text-center text-sm text-neutral-400">
										(Volunteer)
									</p></a
								>
							</div>
						</div>
					</div>
					<div class="pb-[3vh]">
						<h2
							class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans text-3xl font-bold text-transparent"
						>
							Check this out!
						</h2>
					</div>
					<div class="flex flex-col items-center">
						<a href="https://github.com/technocratsgsv/Cipher-Saga-2.0.git">
							<img
								src="https://i.ibb.co/qM2wVX1z/Logo.png"
								alt="TechnoCrats"
								width="80"
								height="80"
								loading="lazy"
								class="mx-auto mb-2 h-20 w-20 rounded-full"
							/>

							<h2
								class="to-primary relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text text-center font-sans text-xl font-bold text-transparent"
							>
								TechnoCrats Cipher Saga 2.0 repository (GitHub)
							</h2>
						</a>
					</div>
					<br />
					<div class="pb-[4vh]">
						<h2
							class="to-primary text-l relative z-10 bg-gradient-to-b from-neutral-200 bg-clip-text pb-[1vh] text-center font-sans font-bold text-transparent"
						>
							Also a special thanks to ChatGPT. This project could not have been possible without
							it.
						</h2>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
