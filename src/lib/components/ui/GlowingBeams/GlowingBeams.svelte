<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import { Motion } from '@motionone/svelte';
	import { onMount } from 'svelte';

	export let className: string | undefined = undefined;

	let paths: string[] = [];
	let animations: any[] = [];
	let mounted = false;

	onMount(() => {
		mounted = true;

		paths = [
			'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
			'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
			'M-367 -205C-367 -205 -299 200 165 327C629 454 697 859 697 859',
			'M-360 -213C-360 -213 -292 192 172 319C636 446 704 851 704 851',
			'M-353 -221C-353 -221 -285 184 179 311C643 438 711 843 711 843',
			'M-347 -229C-347 -229 -279 176 185 303C649 430 717 835 717 835',
			'M-340 -237C-340 -237 -272 168 192 295C656 422 724 827 724 827',
			'M-333 -245C-333 -245 -265 160 199 287C663 414 731 819 731 819',
			'M-327 -253C-327 -253 -259 152 205 279C669 406 737 811 737 811',
			'M-320 -261C-320 -261 -252 144 212 271C676 398 744 803 744 803',
			'M-313 -269C-313 -269 -245 136 219 263C683 390 751 795 751 795',
			'M-307 -277C-307 -277 -239 128 225 255C689 382 757 787 757 787'
		];

		animations = paths.map(() => ({
			animate: {
				x1: ['0%', '100%'],
				x2: ['0%', '95%'],
				y1: ['0%', '100%'],
				y2: ['0%', `${93 + Math.random() * 8}%`]
			},
			transition: {
				duration: Math.random() * 10 + 10,
				ease: 'ease-in-out',
				repeat: Infinity,
				delay: Math.random() * 10
			}
		}));
	});
</script>

{#if mounted}
	<svg
		class={cn('absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[128rem] -translate-x-1/2', className)}
		viewBox="0 0 1280 1024"
		fill="none"
		aria-hidden="true"
	>
		{#each paths as path, index}
			<Motion
				tag="path"
				d={path}
				stroke={`url(#linearGradient-${index})`}
				stroke-opacity="0.4"
				stroke-width="0.5"
			/>
		{/each}

		<defs>
			{#each paths as _, index}
				<Motion
					tag="linearGradient"
					id={`linearGradient-${index}`}
					x1="100%"
					x2="100%"
					y1="100%"
					y2="100%"
					{...animations[index]}
				>
					<stop stop-color="#FFFFFF" stop-opacity="0" />
					<stop stop-color="#FFFFFF" />
					<stop offset="32.5%" stop-color="#FFFFFF" />
					<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
				</Motion>
			{/each}
		</defs>
	</svg>
{/if}
