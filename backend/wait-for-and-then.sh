#!/bin/bash
set -e

TIMEOUT=60
START_TIME=$(date +%s)

until mysqladmin ping -h"db" -u"root" -proot --silent; do
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  if [ "$ELAPSED_TIME" -ge "$TIMEOUT" ]; then
    >&2 echo "ERROR: MySQL is not available after $TIMEOUT seconds. Aborting."
    exit 1
  fi
  >&2 echo "MySQL is unavailable - sleeping for 1 second (waited $ELAPSED_TIME seconds)"
  sleep 1
done

>&2 echo "SUCCESS: MySQL is up - starting application"
# Run the Spring Boot application
java -jar /app/app.jar