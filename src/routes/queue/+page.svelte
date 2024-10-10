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
	let gameStarted = false;
	async function joinQueue() {
		if (!playerId) {
			console.error('Player ID is required');
			return;
		}

		socket = new WebSocket(`ws://localhost:8080/ws?player_id=${playerId}`);
		console.log('Joining queue with Player ID:', playerId);

		socket.onopen = () => {
			console.log('Connected to server');
		};
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === 'startGame') {
				gameStarted = true;
				console.log('Game started:', message.content);
			}
			if (message.type === 'move') {
				console.log('Move:', message.content);
			}
			console.log('Message from server:', event.data);
			messages = [...messages, event.data];
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

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});
</script>

<!-- UI with input for Player ID and button to join the queue -->
{#if gameStarted}
	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<h1>Game Started</h1>
	</div>

	<!-- Display incoming messages -->
	{#each messages as message}
		<p>{message}</p>
	{/each}

	<!-- Chess Board -->
	<div class="chess-board"></div>

	<input type="text" bind:value={newMessage} placeholder="New Message" />
	<button class="rounded bg-yellow-100 p-5 border border-black" on:click={sendMessage}>
		Send Message
	</button>
{:else}
	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<h1>Queue</h1>
		<input type="text" bind:value={playerId} placeholder="Player ID" />
		<button class="rounded bg-yellow-100 p-5 border border-black" on:click={joinQueue}>
			Join Queue
		</button>

		<button class="rounded bg-yellow-100 p-5 border border-black" on:click={leaveQueue}>
			Leave Queue
		</button>
	</div>
{/if}
