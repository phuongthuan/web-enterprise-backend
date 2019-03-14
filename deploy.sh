#! /usr/bin/env bash

set -e

ssh -o StrictHostKeyChecking=no -i ~/Desktop/SSHKEY/npt.pem ec2-user@13.250.108.49 <<'ENDSSH'
#commands to run on remote host
cd /home/ec2-user/web-enterprise-backend
sudo docker build -t wep .
sudo docker-compose up -d --force-recreate
ENDSSH