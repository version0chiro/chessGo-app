<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	let username = '';
	let password = '';
	export let data;
	let isLoggedIn = false;

	if (data.token) {
		isLoggedIn = true;
	}
</script>

{#if isLoggedIn}
	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<h1>Welcome</h1>
		<a href="/queue">
			<button class="rounded bg-yellow-100 p-5 border border-black">Queue</button>
		</a>
	</div>
{:else}
	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<form method="POST" action="?/login" class="flex flex-col gap-4">
			<input type="text" bind:value={username} placeholder="Username" name="username" />
			<input type="password" bind:value={password} placeholder="Password" name="password" />
			<button class="rounded bg-yellow-100 p-5 border border-black">Login</button>
		</form>
	</div>
{/if}
