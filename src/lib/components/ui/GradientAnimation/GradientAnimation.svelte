<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils/cn';

	export let gradientBackgroundStart = 'rgb(23, 14, 39)';
	export let gradientBackgroundEnd = 'rgb(13, 13, 14)';

	export let firstColor = '40, 20, 70';
	export let secondColor = '60, 30, 100';
	export let thirdColor = '35, 40, 80';
	export let fourthColor = '50, 20, 80';
	export let fifthColor = '45, 35, 100';
	export let pointerColor = '70, 50, 130';

	export let size = '6%';
	export let blendingValue = 'hard-light';
	export let className: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;
	export let interactive: boolean = true;

	let interactiveRef: HTMLDivElement;
	let curX = 0;
	let curY = 0;
	let tgX = 0;
	let tgY = 0;
	let animationFrame: number;

	onMount(() => {
		const setVars = (vars: Record<string, string>) => {
			for (const key in vars) {
				document.body.style.setProperty(`--${key}`, vars[key]);
			}
		};

		setVars({
			'gradient-background-start': gradientBackgroundStart,
			'gradient-background-end': gradientBackgroundEnd,
			'first-color': firstColor,
			'second-color': secondColor,
			'third-color': thirdColor,
			'fourth-color': fourthColor,
			'fifth-color': fifthColor,
			'pointer-color': pointerColor,
			size,
			'blending-value': blendingValue
		});

		if (interactive) {
			document.addEventListener('mousemove', handleMouseMove);
			animationFrame = requestAnimationFrame(updateLoop);
		}

		return () => {
			if (interactive) {
				document.removeEventListener('mousemove', handleMouseMove);
				cancelAnimationFrame(animationFrame);
			}
		};
	});

	function handleMouseMove(event: MouseEvent) {
		if (!interactiveRef) return;
		const rect = interactiveRef.getBoundingClientRect();
		tgX = event.clientX - rect.left;
		tgY = event.clientY - rect.top;
	}

	function updateLoop() {
		if (interactiveRef) {
			curX += (tgX - curX) / 14;
			curY += (tgY - curY) / 14;
			interactiveRef.style.transform = `translate3d(${Math.round(curX)}px, ${Math.round(curY)}px, 0)`;
		}
		animationFrame = requestAnimationFrame(updateLoop);
	}
</script>

<div
	class={cn(
		'fixed top-0 left-0 z-[-1] h-full w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
		containerClassName
	)}
>
	<svg class="hidden">
		<defs>
			<filter id="blurMe">
				<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
				<feColorMatrix
					in="blur"
					mode="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
					result="goo"
				/>
				<feBlend in="SourceGraphic" in2="goo" />
			</filter>
		</defs>
	</svg>

	<div class={cn('', className)}><slot /></div>

	<div
		class="gradients-container h-full w-full [filter:url(#blurMe)_blur(20px)]"
		style="contain: layout paint;"
	>
		<!-- Static glowing blobs -->
		{#each [firstColor, secondColor, thirdColor, fourthColor, fifthColor] as color, i}
			<div
				class={cn(
					'absolute rounded-full [mix-blend-mode:var(--blending-value)]',
					`opacity-${i === 3 ? '70' : '100'}`
				)}
				style="
					top: calc(50% - var(--size) / 2);
					left: calc(50% - var(--size) / 2);
					height: var(--size);
					width: var(--size);
					background: radial-gradient(circle at center, rgba(${color}, 0.8) 0%, rgba(${color}, 0) 50%);
					transform-origin: center center;
					animation: spin ${30 + i * 10}s linear infinite;
				"
			></div>
		{/each}

		<!-- Pointer-following blob -->
		{#if interactive}
			<div
				bind:this={interactiveRef}
				class="absolute h-full w-full opacity-70 [mix-blend-mode:var(--blending-value)]"
				style="
					background: radial-gradient(circle at center, rgba(var(--pointer-color), 0.8) 0%, rgba(var(--pointer-color), 0) 30%);
					will-change: transform;
				"
			></div>
		{/if}
	</div>
</div>

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg) translateX(0px) scale(1);
		}
		100% {
			transform: rotate(360deg) translateX(0px) scale(1);
		}
	}
</style>
