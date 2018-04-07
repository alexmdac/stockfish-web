'use strict';

(function() {

var board,
    game = new Chess(),
    statusEl = $('#status'),
    player = 'w';

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
    $.post('/make_move', json, onReceivePositionFromServer);
}

function onReceivePositionFromServer(data, status, xhr) {
    if (status === 'success') {
        game.move(data['best_move'], {sloppy: true})
        updateBoard();
        updateStatus();
    } else {
        statusEl.html('Server failure: ' + serverFailure);
    }
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
        var turn = game.turn() === 'b' ? 'Black' : 'White';
        status = turn + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'The position is drawn.';
    }
    statusEl.html(status);
}

var cfg = {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'static/img/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    showNotation: false,
};
board = ChessBoard('board', cfg);

updateStatus();

})();
