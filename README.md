# TheXem.de proxy

Some services like Sonarr use this service (thexem.de) to create "Alternate Titles" for Animes, Series and Movies, and don't allow you to add a new entry manually.  

This project will act as a proxy that will intercept requests to thexem.de and inject new entries to the response of the url: http://thexem.de/map/allNames?origin=tvdb&seasonNumbers=true

You will need a Reverse Proxy like NGINX to map this to the url "thexem.de" on port 80 and change your hosts file to redirect thexem.de to localhost, or if your router allow it, change the dnsmasq settings to redirect it.

## Directories
This directory has been created in the image to be used for configuration and persistent storage (xem-mapping.json: custom mapping).
```
/thexem/config
```

### xem-mapping.json
This file contains the custom mapping that will be merged with the original response  
```json
{
    "exclude": [
        "Tvdb-ID", "72241"
    ],
    "include": {
        "Tvdb-ID": [{
            "Example All Seasons Title 1": -1
        }, {
            "Example All Seasons Title 2": -1
        }, {
            "Example Season 1 Title": 1
        }, {
            "Example Season 2 Title": 2
        }, {
            "Example Season 3 Title": 3
        }],
        "326732": [{
            "Ze Tian Ji": -1
        }]
  }
}
```


Example DNSMASQ config:
```
address=/thexem.de/10.0.0.115
```


Example NGINX .conf file:
```
server {
  listen        80;
  server_name   thexem.de;

  location / {
	proxy_pass http://10.0.0.115:3004/;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
	proxy_set_header X-Forwarded-Host $http_host;
	proxy_redirect off;
  }
}
```

Running on Docker:
```
docker run -p 3000:3000 -it --rm -v "$(pwd)/config/xem-mapping.json:/thexem/config/xem-mapping.json" ghcr.io/darksupremo/thexem-proxy:latest
```
