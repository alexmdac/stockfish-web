FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
        python3 \
        python3-pip \
        stockfish \
    && rm -rf /var/lib/apt/lists/*

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt --disable-pip-version-check

ENV PATH="/usr/games:${PATH}"
ENV FLASK_APP app.py
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

ENTRYPOINT ["flask", "run", "-h", "0.0.0.0"]
