# TODO

+ move controller function img into yt_embed by creating new renderer



sudo apt-get install postgresql


May need to run `systemctl start postgresql` or similar command to start postgresql service

Run once:

+ `sudo -i -u postgres createuser -P -s -e site_admin` and set account password: `site_nice_aint_it`
+ `sudo -i -u postgres createdb site --owner site_admin`

One way to browse and manipulate data :

+ `sudo psql -U site_admin -d site -h localhost -W` and then enter password `site_nice_aint_it`
+ Accepts all valid postgres SQL commands, example :
    + Count number of entry in users table: `SELECT COUNT(*) FROM users;`
    + Get max of 5 username from db: `SELECT uname FROM users LIMIT 5;`
    + Deletes/removes everything: `DROP OWNED BY current_user CASCADE;`
+ Additional commands example:
    + `\d <table name>` shows description of table
    + `\dt` or `\dt+` to list relations
    + `\l` lists all database
    + `\conninfo` shows connection info
    + `\?` prints available `psql` command and help text
    + `\q` to quit



+ Follow: https://github.com/creationix/nvm
+ `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
source ~/.bashrc`
+ `nvm ls-remote` to view, install the latest LTS, example:
+ `nvm install 10.15.1`
+ `nvm alias default 10.15.1`
+ `nvm use 10.15.1`



Bcrypt needs python and other build essential if binary is not available

+ `sudo apt-get install python`
+ `sudo apt-get install build-essential`

+ `git clone https://github.com/dxwc/running_CRUD-JSFree_bn`
+ `npm install`




stop the serve if up

https://www.digitalocean.com/docs/networking/dns/quickstart/

https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars

Create a A record, "@" (for digital ocean means root)
create A record subdomain www also





see https://certbot.eff.org/lets-encrypt/ubuntubionic-other

sudo certbot certonly --standalone -d masvat.com -d www.masvat.com --register-unsafely-without-email

/etc/letsencrypt has important info that should be backed up (?)

`certbot certificates` shows information about certificates and where it is at

DONT'T FOLLOW THIS GUY, but helpful: https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625

https://superuser.com/questions/1194523/lets-encrypt-certbot-where-is-the-private-key



see `less /var/log/auth.log` for all the automated hacking attempts, I saw mostly
ssh attempt. Change ssh port

`vim /etc/ssh/sshd_config`

`change/uncomment port on the file` using 9003
change iptables rule from ufw

`sudo ufw deny ssh`
`sudo ufw allow 9003`

to remove `ufw status numbered` to view number and then
`ufw delete <number>`

`ufw allow 9003/tcp` to allow ssh in 9003

`service sshd restart`

now on, to ssh, do `ssh <user name>:<ip> -p 9003`








If using express directly (TODO: nginx):

`npm install pm2 -g`

https://pm2.io/doc/en/runtime/features/commands-cheatsheet/

sudo ufw default deny incoming
sudo ufw default deny outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow http
sudo ufw allow https
sudo ufw deny 25
sudo ufw deny 143
sudo ufw deny 993
sudo ufw deny 110
sudo ufw deny 995
sudo ufw enable
sudo ufw status
sudo ufw status verbose



# Sequelize sync create log dump :

__Note:__ Need not create them manually, the web application will create the necessary
tables.

```
CREATE TABLE IF NOT EXISTS "users" ("id" UUID , "uname" TEXT NOT NULL UNIQUE, "upass" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "posts" ("id" UUID , "by" UUID REFERENCES "users" ("id"), "content" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMPWITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "comments" ("id" UUID , "commenter" UUID REFERENCES"users" ("id"), "post_id" UUID REFERENCES "posts" ("id"), "replying_to" UUID, "content" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "reports" ("id" UUID , "by" UUID REFERENCES "users"("id"), "content" TEXT NOT NULL, "response" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "follows" ("user_id" UUID  REFERENCES "users" ("id"), "following" UUID  REFERENCES "users" ("id"), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("user_id","following"));

CREATE TABLE IF NOT EXISTS "Sessions" ("sid" VARCHAR(36) , "expires" TIMESTAMPWITH TIME ZONE, "data" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("sid"));```


# INIT

`DATABASE_URL="postgres://site_admin:site_nice_aint_it@localhost:5432/site" fullchain="/etc/letsencrypt/live/masvat.com/fullchain.pem" privkey="/etc/letsencrypt/live/masvat.com/privkey.pem" PORT=80 user_name=thedude password=haiworld SESSION_SECRET="coolcoolcoolwooo!" pm2 start index.js`