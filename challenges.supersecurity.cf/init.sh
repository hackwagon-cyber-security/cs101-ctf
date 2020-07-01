#!/bin/bash

for team_dir in `ls -d team*`; do
    docker-compose -f $team_dir/docker-compose.yml up -d
done