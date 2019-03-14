#! /usr/bin/env bash

set -e
echo "ssh running"
ssh -o StrictHostKeyChecking=no -i ~/Desktop/SSHKEY/npt.pem ec2-user@13.250.108.49 <<'ENDSSH'
#commands to run on remote host
cd /home/ec2-user/web-enterprise-backend

echo "Pulling version control"
git pull origin master

echo "Building docker image"
sudo docker build -t wep .

echo "Recreate docker container"
sudo docker-compose up -d --force-recreate
ENDSSH