<script>
	import { onMount, onDestroy } from 'svelte';

	let playerId = '';
	/**
	 * @type {WebSocket}
	 */
	let socket;
	/**
	 * @type {any[]}
	 */
	let messages = [];
	let newMessage = '';

	async function joinQueue() {
		// Check if playerId is provided
		if (!playerId) {
			console.error('Player ID is required');
			return;
		}

		// Create WebSocket connection with the playerId
		socket = new WebSocket(`ws://localhost:8080/ws?player_id=${playerId}`);
		console.log('Joining queue with Player ID:', playerId);

		// Handle WebSocket connection events
		socket.onopen = () => {
			console.log('Connected to server');
		};
		socket.onmessage = (event) => {
			console.log('Message from server:', event.data);
			messages = [...messages, event.data]; // Use spread operator to update reactive array
		};
		socket.onclose = () => {
			console.log('Disconnected from server');
		};
	}

	function leaveQueue() {
		console.log('Leaving queue');
		socket.close();
	}

	function sendMessage() {
		console.log('Sending message:', newMessage);
		socket.send(newMessage);
	}

	// Optionally, clean up the WebSocket when the component is destroyed
	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
</script>

<!-- UI with input for Player ID and button to join the queue -->
<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
	<h1>Queue</h1>
	<input type="text" bind:value={playerId} placeholder="Player ID" />
	<button class="rounded bg-yellow-100 p-5 border border-black" on:click={joinQueue}>
		Join Queue
	</button>

	<button class="rounded bg-yellow-100 p-5 border border-black" on:click={leaveQueue}>
		Leave Queue
	</button>

	<input type="text" bind:value={newMessage} placeholder="New Message" />
	<button class="rounded bg-yellow-100 p-5 border border-black" on:click={sendMessage}>
		Send Message
	</button>

	<!-- Display incoming messages -->
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
