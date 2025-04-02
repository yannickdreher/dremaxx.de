# Basis-Image mit einem einfachen Webserver
FROM nginx:alpine

# Entferne Standard-Inhalte und kopiere deine Website
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

# Exponiere Port 80
EXPOSE 80

# NGINX starten
CMD ["nginx", "-g", "daemon off;"]
