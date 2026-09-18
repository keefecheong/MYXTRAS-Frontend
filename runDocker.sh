#!/bin/bash
docker build -t myxtras-frontend .
docker run --rm -p 3123:80 myxtras-frontend
