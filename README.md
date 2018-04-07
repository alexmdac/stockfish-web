# Web UI for Stockfish

To run in dev mode (with hot-swapping):
```sh
FLASK_APP=app.py FLASK_DEBUG=1 flask run
```

To run in docker:
```sh
docker build -t chess .
docker run -d -p 5000:5000 chess
```

## TODO (in no particular order)

* Play as black.
* Button to start a new game.
* Get a hint from Stockfish.
* Set up positions.
