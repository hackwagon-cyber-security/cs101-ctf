# Setup for CTF Box

``` bash
# Installation Guide: https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04
# apache
sudo apt update
sudo apt install apache2 -y

# mysql
sudo apt install mysql-server
sudo mysql_secure_installation
# root:toor
# without "VALIDATE PASSWORD PLUGIN"

# php
sudo apt install php libapache2-mod-php php-mysql -y

# install node
sudo apt install nodejs -y
sudo apt install npm -y

# To run node_app
screen -S node_app
node app.js

# Install modsecurity
sudo apt-get install libapache2-mod-security2 -y
```

## Database bootstrap

``` mysql
# Create database;
drop database if exists cs101_ctf;
create database cs101_ctf;
use cs101_ctf;

# Setup for Challenge 1
CREATE TABLE ctf_xss_challenge_1 (
    id int NOT NULL AUTO_INCREMENT,
    display_value varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

# Setup for Challenge 3
create table basic_ctf_sqli_challenge (
    id int not null auto_increment,
    email varchar(64) not null,
    password varchar(64) not null,
    role varchar(32) not null,
    primary key (id)
);

INSERT INTO basic_ctf_sqli_challenge (email, password, role) VALUES ('admin@supersecurity.cf','cs101-ctf{DF44D9F53BE2CEDF6B62425B0DA5690D}', 'admin');

# Setup for Challenge 4
create table advanced_ctf_sqli_challenge (
    id int not null auto_increment,
    email varchar(64) not null,
    password varchar(64) not null,
    role varchar(32) not null,
    primary key (id)
);

INSERT INTO advanced_ctf_sqli_challenge (email, password, role) VALUES ('admin@supersecurity.cf','cs101-ctf{7069DC153268D60C702EC495346843E2}', 'admin');

DROP USER IF EXISTS 'app_service'@'localhost';
CREATE USER 'app_service'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app_service';
GRANT SELECT, INSERT ON cs101_ctf.* TO 'app_service'@'localhost';
FLUSH PRIVILEGES;
```

## Apache Nodejs Proxy

```
sudo a2enmod proxy
sudo a2enmod proxy_http
```

```
	# /etc/apache2/sites-available/000-default.conf
	<VirtualHost *:80>
		# The ServerName directive sets the request scheme, hostname and port that
		# the server uses to identify itself. This is used when creating
		# redirection URLs. In the context of virtual hosts, the ServerName
		# specifies what hostname must appear in the request's Host: header to
		# match this virtual host. For the default virtual host (this file) this
		# value is not decisive as it is used as a last resort host regardless.
		# However, you must set it for any further virtual host explicitly.
		#ServerName www.example.com

		ServerAdmin webmaster@localhost
		DocumentRoot /var/www/html

		# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
		# error, crit, alert, emerg.
		# It is also possible to configure the loglevel for particular
		# modules, e.g.
		#LogLevel info ssl:warn

		ErrorLog ${APACHE_LOG_DIR}/error.log
		CustomLog ${APACHE_LOG_DIR}/access.log combined

		# For most configuration files from conf-available/, which are
		# enabled or disabled at a global level, it is possible to
		# include a line for only one particular virtual host. For example the
		# following line enables the CGI configuration for this host only
		# after it has been globally disabled with "a2disconf".
		#Include conf-available/serve-cgi-bin.conf

		ServerName challenges.ultrasecurity.cf

		ErrorDocument 400 /error/400.html

		<Directory "/var/www/html">
			AllowOverride All
		</Directory>

		ProxyRequests on
		ProxyPass /node http://localhost:8081/
	</VirtualHost>
```

### Custom Error Page for ModSecurity

``` html
<!-- 400.html -->
<html>
	<head>
		<title>
			Ops - Bad Payloads?
		</title>
	</head>
	<body>
		<h1>ModSecurity - Your trusted Open Source Web Application Firewall</h1>
		<hr>
		<p>Error 400 - Bad Request!</p>
		<p>Your payload is very malicious! Why??</p>
	</body>
</html>
```

## ModSecurity Configuration

Installing and Configuring ModSecurity [Guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-modsecurity-with-apache-on-ubuntu-14-04-and-debian-8)

1. Ensure that Basic Directives are enabled
2. Modify to load only our custom rules

``` bash 
# /etc/apache2/mods-enabled/security2.conf
# ...
# Modify after
# /usr/share/modsecurity-crs/owasp-crs.load 
Include /etc/modsecurity/crs/crs-setup.conf
IncludeOptional /etc/modsecurity/crs/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
Include /usr/share/modsecurity-crs/rules/*.conf
IncludeOptional /etc/modsecurity/crs/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf
```

``` bash
# CS101-CTF-XSS.conf
# XSS vectors making use of event handlers like onerror, onload etc, e.g., <body onload="alert(1)">
SecRule REQUEST_COOKIES|!REQUEST_COOKIES:/__utm/|REQUEST_COOKIES_NAMES|REQUEST_HEADERS:User-Agent|REQUEST_HEADERS:Referer|ARGS_NAMES|ARGS|XML:/* "(?i)([\s\"'`;\/0-9\=\x0B\x09\x0C\x3B\x2C\x28\x3B]+onl[a-zA-Z]+[\s\x0B\x09\x0C\x3B\x2C\x28\x3B]*?=)" \
	"msg:'CS101 CTF - XSS',\
	id:941100,\
	phase:request,\
	severity:'CRITICAL',\
	rev:'2',\
	ver:'cs101-ctf/0.0.1',\
	maturity:'4',\
	accuracy:'8',\
	t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,t:removeNulls,\
	deny,\
	status:400,\
	log,msg:'XSS Detected!'

# XSS vectors making use of event handlers like onerror, onload etc, e.g., <body onmouseover="alert(1)">
SecRule REQUEST_COOKIES|!REQUEST_COOKIES:/__utm/|REQUEST_COOKIES_NAMES|REQUEST_HEADERS:User-Agent|REQUEST_HEADERS:Referer|ARGS_NAMES|ARGS|XML:/* "(?i)([\s\"'`;\/0-9\=\x0B\x09\x0C\x3B\x2C\x28\x3B]+onm[a-zA-Z]+[\s\x0B\x09\x0C\x3B\x2C\x28\x3B]*?=)" \
	"msg:'CS101 CTF - XSS',\
	id:941110,\
	phase:request,\
	severity:'CRITICAL',\
	rev:'2',\
	ver:'cs101-ctf/0.0.1',\
	maturity:'4',\
	accuracy:'8',\
	t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,t:removeNulls,\
	deny,\
	status:400,\
	log,msg:'XSS Detected!'

# script tag based XSS vectors, e.g., <script> alert(1)</script>
SecRule REQUEST_COOKIES|!REQUEST_COOKIES:/__utm/|REQUEST_COOKIES_NAMES|REQUEST_HEADERS:User-Agent|REQUEST_HEADERS:Referer|ARGS_NAMES|ARGS|XML:/* "(?i)([<＜]script[^>＞]*[>＞][\s\S]*?)" \
	"msg:'CS101 CTF - XSS',\
	id:941120,\
	phase:request,\
	severity:'CRITICAL',\
	rev:'2',\
	ver:'cs101-ctf/0.0.1',\
	maturity:'4',\
	accuracy:'9',\
	t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,t:removeNulls,\
	deny,\
	status:400,\
	log,msg:'XSS Detected!'
```

## Others

### PHP Helper Codes

``` php
if (isset($_REQUEST['source'])) {
    header('Content-Type: text/plain');
    print(file_get_contents(__file__));
    exit(0);
}
```