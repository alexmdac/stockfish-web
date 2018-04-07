#!/usr/bin/env python3

from chess import Board
from chess.uci import popen_engine
from flask import Flask, jsonify, request
import os

MOVE_MS = 1
DEPTH = 1

engine = popen_engine('stockfish')
engine.uci()

app = Flask(__name__)

@app.route('/make_move', methods=['POST'])
def make_move():
    req = request.get_json(force=True)
    try:
        board = Board(req['fen'])
    except (ValueError, KeyError):
        return '', 400
    engine.ucinewgame()
    engine.position(board)
    best_move = engine.go(movetime=MOVE_MS, depth=DEPTH)[0]
    board.push(best_move)
    return jsonify({
        'best_move': best_move.uci(),
    })

@app.route('/')
def get_index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(port=port, host='0.0.0.0')
