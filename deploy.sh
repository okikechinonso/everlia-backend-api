#!/bin/bash

# Port to be freed up
port_to_free=5055

chmod +x "deploy.sh"

git pull

npm install

npm run build

# Find and kill the process using the specified port
existing_process_pid=$(lsof -t -i:$port_to_free)

if [ -n "$existing_process_pid" ]; then
    echo "Killing existing process on port $port_to_free (PID: $existing_process_pid)"
    kill -9 $existing_process_pid
else
    echo "No process found on port $port_to_free"
fi

nohup npm start > output.log 2>&1 &

disown
