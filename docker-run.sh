#!/bin/sh
userSecretsId="BlogApi-a1c1eb3a-9550-4e07-a3e5-0e03186b3acd"
envFilePath=${HOME}/.microsoft/usersecrets/${userSecretsId}/app.env

# keep '--env-file' as first parameter
docker run \
  --env-file ${envFilePath} \
  --rm \
  -it luzi/authenticator