FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
        python3 \
        python3-pip \
        stockfish \
    && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt --disable-pip-version-check

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

ENV PATH="/usr/games:${PATH}"
ENV PORT 8080

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# For environments with multiple CPU cores, increase the number of workers to
# be equal to the cores available.  Timeout is set to 0 to disable the timeouts
# of the workers to allow Cloud Run to handle instance scaling.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
