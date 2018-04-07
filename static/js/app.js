'use strict';

(function() {

var board,
    game,
    statusEl = $('#status'),
    hintEl = $('#hint'),
    player = 'w';

function init() {
    game = new Chess();
    var cfg = {
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMoveEnd: onMoveEnd,
        onSnapEnd: onSnapEnd,
        orientation: player === 'w' ? 'white' : 'black',
        pieceTheme: 'static/img/chesspieces/wikipedia/{piece}.png',
        position: 'start',
        showNotation: false,
    };
    board = ChessBoard('board', cfg);

    updateUi();
    if (player === 'b') {
        sendPositionToServer(handleMoveFromServer);
    }
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over() ||
        game.turn() !== player ||
        piece[0] !== player) {
        return false;  // Prevent move.
    }
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for simplicity.
    });
    if (move === null) {
        return 'snapback';  // Illegal move.
    }
    updateUi();
    // HACK: Add a short pause to prevent board animations interfering with one another.
    window.setTimeout(function(){ sendPositionToServer(handleMoveFromServer) }, 50);
}

function sendPositionToServer(handleMove) {
    var json = JSON.stringify({
        fen: game.fen()
    });
    var currentGame = game;
    $.post('/make_move', json, function(data, status, xhr) {
        // Check that a new game has not started.
        if (currentGame !== game) {
            return;
        }
        if (status === 'success') {
            handleMove(data['best_move']);
        } else {
            statusEl.html('Server failure: ' + serverFailure);
        }
    });
}

function requestHintFromServer() {
    if (!game.game_over()) {
        sendPositionToServer(handleHintFromServer);
    }
}

function handleMoveFromServer(move) {
    game.move(move, {sloppy: true})
    updateBoard();
}

function handleHintFromServer(move) {
    statusEl.html('Hint: ' + move);
}

function onMoveEnd() {
    updateUi();
}

function onSnapEnd() {
    updateBoard();
}

function updateBoard() {
    board.position(game.fen());
}

function updateUi() {
    var status = '';
    if (game.in_checkmate()) {
        if (game.turn() === player) {
            status = 'You lose!';
        } else {
            status = 'You win!';
        }
    } else if (game.in_draw()) {
        status = 'It\'s a draw!';
    }
    statusEl.html(status);

    if (game.game_over()) {
        hintEl.hide();
    } else {
        hintEl.show();
    }
}

$('#new_white').click(function(){
    player = 'w';
    init();
});
$('#new_black').click(function(){
    player = 'b';
    init();
});
hintEl.click(requestHintFromServer);

init();
})();
