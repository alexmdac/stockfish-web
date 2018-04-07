'use strict';

(function() {

var board,
    game,
    statusEl = $('#status'),
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

    updateStatus();
    if (player === 'b') {
        sendPositionToServer();
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
    updateStatus();
    // HACK: Add a short pause to prevent board animations interfering with one another.
    window.setTimeout(sendPositionToServer, 50);
}

function sendPositionToServer() {
    var json = JSON.stringify({
        fen: game.fen()
    });
    $.post('/make_move', json, function(data, status, xhr) {
        onReceivePositionFromServer(game, data, status, xhr);
    });
}

function onReceivePositionFromServer(gameForReq, data, status, xhr) {
    if (gameForReq != game) {
        return;  // new game was started.
    }
    if (status === 'success') {
        game.move(data['best_move'], {sloppy: true})
        updateBoard();
    } else {
        statusEl.html('Server failure: ' + serverFailure);
    }
}

function onMoveEnd() {
    updateStatus();
}

function onSnapEnd() {
    updateBoard();
}

function updateBoard() {
    board.position(game.fen());
}

function updateStatus() {
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
}

$('#new_game_white').click(function(){
    player = 'w';
    init();
});
$('#new_game_black').click(function(){
    player = 'b';
    init();
});
init();
})();
