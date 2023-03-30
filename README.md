# Web UI for Stockfish

To set up your environment:
```sh
python3 -m venv .stockfish-web-venv
source .stockfish-web-venv/bin/activate
pip install -r requirements.txt
```

To install stockfish:
```sh
brew install stockfish
```

To run in dev mode (with hot-swapping):
```sh
FLASK_APP=app.py FLASK_DEBUG=1 flask run
```

To run in a container:
```sh
podman build -t chess .
podman run -d -p 8080:8080 chess
```

To deploy on Cloud Run:
```sh
gcloud run deploy --source .
```

## TODO (in no particular order)

* Set up positions.
* Promote to pieces other than Queen.
* Defeat caching when pushing a new version.
* Use a bundler rather than managing css/js/img manually.
