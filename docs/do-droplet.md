# How to setup a Digital Ocean Droplet

1. Create a new droplet on Digital Ocean

2. Fix needrestart

Edit the needrestart configuration file:
`vi  /etc/needrestart/needrestart.conf`

Change the following line:
`#$nrconf{restart} = 'i';`
to:
`$nrconf{restart} = 'a';`

3. Update the package lists and upgrade the system:

```sh
  apt-get update
  apt-get upgrade
```

4. Install Node js
```sh
  cd ~
  curl -sL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
  sudo bash /tmp/nodesource_setup.sh
  sudo apt install nodejs
  node -v
```

4. Install pm2 process manager for app
`npm install -g pm2`

6. Install postgresql on the server & Create password and db.
```sh
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql.service

  sudo -i -u your_db_user
  psql
  // Set password for your_db_user user & set password as same in the code.
  \password your_db_user
  // Use below line to exit postgres session and go back to user
  \q
  // Below command from user creates db
  createdb your_db_name
  psql
  // Connect to database
  \c your_db_name
  // To confirm your datbase and connection
  \conninfo
```

### For development

Steps after creating droplet on the digital ocean to follow

1. Get IPv4 and save it to appropriate deploy key
  `https://github.com/the-ranivi/spiderman/settings/secrets/actions`
2. Meanwhile enable IPv6 on the droplet
3. Install Node js
  ```sh
  cd ~
  curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
  sudo bash /tmp/nodesource_setup.sh
  sudo apt install nodejs
  node -v
  ```
4. Install pm2 process manager for app
  `npm install -g pm2`
5. Go to your namecheap and point api-dev.ranivi.com to ipv4 and ipv6 using A type DNS
6. Install postgresql on the server.
```sh
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql.service
```
7. Create password and db.
```sh
  sudo -i -u postgres
  psql
  // Set password for postgres user & set password as same in the code.
  \password postgres
  // Use below line to exit postgres session and go back to user
  \q
  // Below command from user creates db
  createdb hulk
  psql
  // Connect to database
  \c hulk
  // To confirm your datbase and connection
  \conninfo
```
