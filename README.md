## SERVER =>
## 1 - Install Dependencies 

Run npm install to install all dependencies from NPM.
```sh
$ cd server
```
```sh
$ npm install
```

If you want to use yarn to install dependencies, first run the yarn import command. This will ensure that yarn installs the package versions that are specified in package-lock.json.

## 2 - Running the Authentication server

Before running app, you need to run the authentication server
Add API Key and Secret in `.env` of your project.

```sh
ZUJONOW_API_KEY=''
ZUJONOW_SECRET_KEY=''
ZUJONOW_API_ENDPOINT=https://api.zujonow.com
```

Visit, [https://www.videosdk.live/](https://www.videosdk.live/) to generate API keys and secret.

## 3 - Start server

```sh
$ npm start
```

## CLIENT =>
## 1 - Install Dependencies 

Run npm install to install all dependencies from NPM.
```sh
$ cd client
```
```sh
$ npm install
```
If you want to use yarn to install dependencies, first run the yarn import command. This will ensure that yarn installs the package versions that are specified in package-lock.json.

## 3 - Run Project

```sh
$ npm start
```


## 2 - For SALES 
Redirect to :
```sh
http://localhost:3000/sales
```
## 3 - For CUSTOMER 
Redirect to :
```sh
http://localhost:3000/customer
```




