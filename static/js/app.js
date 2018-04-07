'use strict';

(function() {

var board,
    game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen');

function onDragStart(source, piece, position, orientation) {
    if (game.game_over() ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    if (move === null) {
        return 'snapback';  // Illegal move.
    }
    updateStatus();
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusEl.html(status);
    fenEl.html(game.fen());
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
