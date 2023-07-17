FROM ubuntu:22.04
RUN apt-get update; apt-get install python3-pip nginx node
RUN pip install sqlite3 jsonschema flask flask-cors flask-jwt-extended flask-socketio 

ENV JWT_TOKEN="120iqjwtkeyorsomething_"

CMD ["sh", "/start.sh"]



