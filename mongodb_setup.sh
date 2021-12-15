#!/bin/bash

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# This will return the MongoDB key somewhere in the output
apt-key list

# Add MongoDB repo to packages
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# To get the latest package lists
echo "Apt Updating Packages"
sudo apt update

echo "Installing MongoDB"
sudo apt install net-tools mongodb-org -y

echo "Starting MongoDB"
sudo systemctl start mongod.service

echo "Enable MongoDB on Startup"
sudo systemctl enable mongod

# Security Steps
read -p "Create an Admin Username: " ADMIN_USER
read -p "Create an Admin Password: " ADMIN_PASS

# Create an Admin User
echo "db.createUser({ user: \"$ADMIN_USER\", pwd: \"$ADMIN_PASS\", roles: [ { role: \"userAdminAnyDatabase\", db: \"admin\" }, \"readWriteAnyDatabase\" ]})" | mongo admin

file="/etc/mongod.conf"
sudo sed -i 's/127.0.0.1/0.0.0.0/' $file
sudo sed -i '/security/s/^#//g' $file
sudo sed -i '/^security:.*/a \ \ authorization: enabled' $file
sudo systemctl restart mongod
sudo systemctl status mongod

# Create Databases
sudo bash -c 'cat >file.js <<EOL
db = db.getSiblingDB("db_production")
db.createCollection("stock_data");

db = db.getSiblingDB("user_db")
db.createCollection("userTable");
db.createCollection("userKey");
db.createCollection("userAccount");
db.createCollection("userSessions");
EOL'

mongo -u $ADMIN_USER -p --authenticationDatabase admin file.js

export IP=$(hostname -I)
echo "MongoDB URI: mongodb://$ADMIN_USER:$ADMIN_PASS@$IP:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"