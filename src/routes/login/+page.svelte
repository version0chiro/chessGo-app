<script>
	let username = '';
	let password = '';

	async function login() {
		const response = await fetch('http://localhost:8080/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),

			headers: { 'Content-Type': 'application/json' }
		});
		const x = await response.text();
	}
</script>

<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button class="rounded bg-yellow-100 p-5 border border-black" on:click={login}>Login</button>
	<button class="rounded bg-gray-600 p-5 border text-white border-black">Register</button>
</div>
