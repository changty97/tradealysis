#!/bin/bash

# To get the latest package lists
echo "Apt Updating Packages"
sudo apt update

# Install nessecary packages for Tradealysis
echo "Installing npm and nginx"
sudo apt-get install nodejs npm nginx certbot python3-certbot-nginx -y

echo "Checking npm version"
npm -v

# Verify the node version
echo "Checking node version"
node -v

echo "Enable nginx to boot up at startup"
sudo systemctl enable nginx

sudo rm /etc/nginx/sites-enabled/default
sudo touch /etc/nginx/sites-available/Tradealysis

# Create the .env file for the Frontend
read -p "Is this the fronend? (Y/N)" choice
if [[ "$choice" == y || "$choice" == Y ]]; then 
    # Git Clone code from Gitlab 
    echo "Cloning Build from GitLab"
    # git clone https://gitlab.com/changty97/tradealysis_prod_build.git
    git clone https://gitlab.com/yang_SacState/spring2021_codevid.git

    touch spring2021_codevid/frontend/.env
    FILE=spring2021_codevid/frontend/.env
    if [[ -f "$FILE" ]]; then
        read -p "What is your API Domain Name: " api_domain
        read -p "What is your Frontend Key: " FE_KEY
        echo -e "REACT_APP_SERVICE_URL=\"$api_domain\"\nREACT_APP_FE_KEY=\"$FE_KEY\"" > "$FILE"
    fi

    # Go into Project Frontend and install packages
    cd spring2021_codevid/frontend/
    npm i

    # build a minified project to be deployed to nginx
    npm test

    # Create directory for nginx to serve and change permissions
    sudo mkdir -p /var/www/Tradealysis/html
    sudo chown -R $USER:$USER /var/www/Tradealysis/html
    sudo chmod -R 755 /var/www/Tradealysis

    # Move the minified project to a different directory
    # sudo mv /home/$USER/tradealysis_prod_build/build /var/www/Tradealysis/html
    sudo mv /home/$USER/spring2021_codevid/frontend/build /var/www/Tradealysis/html

    # Take the search string
    read -p "Enter your domain name (If blank it will use localhost): " domain

    if [[ $domain != "" ]]; then
sudo DOMAIN=$domain bash -c 'cat >/etc/nginx/sites-available/Tradealysis <<EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/Tradealysis/html/build/;
    index index.html index.htm index.nginx-debian.html;

    server_name $DOMAIN www.$DOMAIN;

    location / {
            try_files $uri $uri/ =404;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    include snippets/ssl-params.conf;

    root /var/www/Tradealysis/html/build/;
    index index.html index.htm index.nginx-debian.html;

    server_name $DOMAIN www.$DOMAIN;

    location / {
            try_files $uri $uri/ =404;
    }
}
EOL'
    # Create SSL for HTTPS
    sudo certbot --nginx -d $domain -d www.$domain

    else
sudo DOMAIN=$domain bash -c 'cat >/etc/nginx/sites-available/Tradealysis <<EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    location / {
        if (!-e $request_filename){
            rewrite ^(.*)$ /index.html break;
        }
        root /var/www/Tradealysis/html/build/;
        index index.html index.htm index.nginx-debian.html;
    }
}
EOL'
    fi

elif [[ "$choice" == n || "$choice" == N ]]; then
    # Git Clone code from Gitlab 
    echo "Cloning Code from GitLab"
    git clone https://gitlab.com/yang_SacState/spring2021_codevid.git

    touch spring2021_codevid/backend/.envs/.env
    FILE=spring2021_codevid/backend/.envs/.env
    if [[ -f "$FILE" ]]; then
        read -p "What is your MongoDB URI: " DB_URI
        read -p "What is your Backend Key: " BK_KEY
        echo -e \
        "PORT = \"3001\"\n
        DB_URI_ONLINE = \"$DB_URI\"\n
        DB_URI_LOCAL = \"mongodb://localhost:27017/\"\n
        DB_URI = \"$DB_URI\"\n
        DB_DB = \"db_production\"\n
        DB_COLLECTION = \"stock_data\"\n
        USER_DB = \"user_db\"\n
        USERTABLE_COLLECTION = \"userTable\"\n
        USERKEY_COLLECTION = \"userKey\"\n
        USERACCOUNT_COLLECTION = \"userAccount\"\n
        USERSESSIONS_COLLECTION = \"userSessions\"\n
        FINNHUB_API_KEY = \"c5n04giad3iam7tut000\"\n
        AlphaVantage_API_KEY = \"VFFEVTCFZB8A0P3T\"\n
        REACT_APP_BE_KEY=\"$BK_KEY\"" \
        > "$FILE"
    fi

    # Go into Project Backend and install packages
    cd spring2021_codevid/backend/
    npm i

    # Start npm run for backend
    (npm run start&)
    # Press CTRL-C once you see "Server is running on PORT 3001"

    # Take the search string
    read -p "Enter your domain name: " domain

    if [[ $domain != "" ]]; then
sudo DOMAIN=$domain bash -c 'cat >/etc/nginx/sites-available/Tradealysis <<EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name $DOMAIN www.$DOMAIN;

    location / {
            proxy_pass http://localhost:3001;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    include snippets/ssl-params.conf;

    server_name $DOMAIN www.$DOMAIN;

    location / {
            proxy_pass http://localhost:3001;
    }
}
EOL'
    # Create SSL for HTTPS
    sudo certbot --nginx -d $domain -d www.$domain

    else
sudo DOMAIN=$domain bash -c 'cat >/etc/nginx/sites-available/Tradealysis <<EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    location / {
        root /var/www/Tradealysis/html/build/;
        index index.html index.htm index.nginx-debian.html;
    }
}
EOL'
    fi
else echo "invalid"
fi

sudo ln -s /etc/nginx/sites-available/Tradealysis /etc/nginx/sites-enabled/Tradealysis
file="/etc/nginx/nginx.conf"
sudo sed -i 's|# \(server_names_hash_bucket_size\)|\1|' $file
sudo nginx -t
sudo systemctl restart nginx

