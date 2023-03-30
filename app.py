#!/usr/bin/env python3

import chess
import chess.engine
from flask import Flask, jsonify, request
import os

MOVE_SECS = 0.001
DEPTH = 2

engine = chess.engine.SimpleEngine.popen_uci('stockfish')

app = Flask(__name__)

@app.route('/find_move', methods=['POST'])
def make_move():
    req = request.get_json(force=True)
    try:
        board = chess.Board(req['fen'])
    except (ValueError, KeyError):
        return '', 400
    result = engine.play(board, chess.engine.Limit(time=MOVE_SECS, depth=DEPTH))
    return jsonify({
        'best_move': result.move.uci(),
    })

@app.route('/')
def get_index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(port=port, host='0.0.0.0')
