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

* Set up positions.
* Promote to pieces other than Queen.
* Defeat caching when pushing a new version.
* Use a bundler rather than managing css/js/img manually.
