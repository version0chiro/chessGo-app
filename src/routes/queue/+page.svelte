<script>
	// @ts-nocheck

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
	let turn = false;

	let board = [
		['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Black back rank
		['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Black pawns
		['', '', '', '', '', '', '', ''], // Empty rank
		['', '', '', '', '', '', '', ''], // Empty rank
		['', '', '', '', '', '', '', ''], // Empty rank
		['', '', '', '', '', '', '', ''], // Empty rank
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // White pawns
		['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] // White back rank
	];

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
			console.log('Message from server:', message);
			if (message.type === 'startGame') {
				gameStarted = true;
				console.log('Game started:', message.content);
				turn = message.turn === playerId;
			}
			if (message.type === 'move') {
				console.log('Move:', message.content);
				board = message.board;
			}
			if (message.type === 'invalidMove') {
				console.log('Invalid move:', message.content);
			} else {
				console.log('Message from server:', event.data);
				messages = [...messages, event.data];
			}
		};
		socket.onclose = () => {
			console.log('Disconnected from server');
		};
	}

	function leaveQueue() {
		console.log('Leaving queue');
		socket.close();
	}

	function sendMessage(move) {
		console.log('Sending message:', move);
		socket.send(JSON.stringify(move));
	}

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});

	const rows = 8;
	const cols = 8;

	const pieces = {
		r: '♜', // Black Rook
		n: '♞', // Black Knight
		b: '♝', // Black Bishop
		q: '♛', // Black Queen
		k: '♚', // Black King
		p: '♟', // Black Pawn
		R: '♖', // White Rook
		N: '♘', // White Knight
		B: '♗', // White Bishop
		Q: '♕', // White Queen
		K: '♔', // White King
		P: '♙', // White Pawn
		'': '' // Empty square
	};
	const getSquareColor = (/** @type {number} */ index) => {
		const row = Math.floor(index / cols);
		const col = index % cols;
		return (row + col) % 2 === 0 ? 'light' : 'dark';
	};

	let selectedPiece = null;
	let selectedPosition = { row: null, col: null };

	const handleSquareClick = (/** @type {number} */ index) => {
		const row = Math.floor(index / cols);
		const col = index % cols;
		console.log('Selected square:', row, col);
		if (selectedPiece) {
			const move = {
				from: { row: selectedPosition.row, col: selectedPosition.col },
				to: { row, col },
				board: board
			};
			console.log('Move:', move);
			sendMessage(move);
			selectedPiece = null;
			selectedPosition = { row: null, col: null };
		} else {
			selectedPiece = board[row][col];
			selectedPosition = { row, col };
		}
	};
</script>

<!-- UI with input for Player ID and button to join the queue -->
{#if gameStarted}
	{#if turn}
		<h1>It's your turn</h1>
	{:else}
		<h1>It's not your turn</h1>
	{/if}

	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<h1>Game Started</h1>
		<div class="chessboard">
			{#each board as row, rowIndex}
				{#each row as piece, colIndex}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="square {getSquareColor(rowIndex * cols + colIndex)}"
						on:click={() => handleSquareClick(rowIndex * cols + colIndex)}
					>
						{pieces[piece]}
					</div>
				{/each}
			{/each}
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

		<button class="rounded bg-yellow-100 p-5 border border-black" on:click={leaveQueue}>
			Leave Queue
		</button>
	</div>
{:else}
	<div class="h-screen w-screen flex flex-col gap-4 justify-center items-center">
		<h1>Queue</h1>
		<input type="text" bind:value={playerId} placeholder="Player ID" />
		<button class="rounded bg-yellow-100 p-5 border border-black" on:click={joinQueue}>
			Join Queue
		</button>
	</div>
{/if}

<style>
	.chessboard {
		display: grid;
		grid-template-columns: repeat(8, 50px);
		grid-template-rows: repeat(8, 50px);
		gap: 1px;
	}

	.square {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		font-size: 20px;
	}

	.light {
		background-color: #f0d9b5; /* light square */
	}

	.dark {
		background-color: #b58863; /* dark square */
	}
</style>
