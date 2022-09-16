# How to use this repo

-   Clone this repo
-   copy .env.example to .env
-   Edit `package.json` file and change name to project name.
-   Run command: `npm install`
-   Run command: `node ace generate:key`. This command will generate. Copy that key set as APP_KEY in .env file.
-   Edit `ecosystem.config.js` file and change name to domain name or something unique on server.

**This repo includes all auth routes with user registration**

## Deply script

cd /home/forge/project-folder

git pull origin $FORGE_SITE_BRANCH

npm install --no-save

npm run build

ENV_PATH=/path/to/env/.env pm2 restart ecosystem.config.js

node ace migration:run --force
