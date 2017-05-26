# Young Innovators Program Website - BARC IIT Kharagpur

## Instructions to deploy locally
- Install nodejs
- Clone the git repository
```shell
cd yip
npm install
npm install -g nodemon
NODE_ENV=development nodemon src/app.js
```
## Setting Up MYSQL 
- Modify username and password in config/sequelize.json
- Do not push any changes in config/sequelize.json to the repo.
- To set up the databases : 
```shell
npm install -g sequelize-cli
sequelize db:migrate --config config/sequelize.json
```

## Files that should not be modified 
- config/sequelize.json
- bin/update

## List
- Team saving not working
- isVerfied display or not display
- Payment portal integration
- Crontab for automatic restart
- Stream logs
- Correct angular code