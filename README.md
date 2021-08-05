# Video SDK RTC Call Trigger Code Sample

This code sample represents call trigger feature using video sdk. Below are the steps to run the project. 
## SERVER


### Step 1 - Install Dependencies of server

Run npm install to install all dependencies from NPM.

```sh
$ cd server
$ npm install
```

If you want to use yarn to install dependencies, first run the yarn import command. This will ensure that yarn installs the package versions that are specified in package-lock.json.

### Step 2 - Running the Authentication server

Before running app, you need to run the authentication server
Add API Key and Secret in `.env` of your project.

```sh
VIDEOSDK_API_KEY=''
VIDEOSDK_SECRET_KEY=''
VIDEOSDK_API_ENDPOINT=https://api.zujonow.com
```

Visit, [https://www.videosdk.live/](https://www.videosdk.live/) to generate API keys and secret.

### Step 3 - Start server

```sh
$ npm start
```

## CLIENT

### Step 1 - Install Dependencies of client

Run npm install to install all dependencies from NPM.

```sh
$ cd client
$ npm install
```

If you want to use yarn to install dependencies, first run the yarn import command. This will ensure that yarn installs the package versions that are specified in package-lock.json.

### Step 2 - Run client

```sh
$ npm start
```

## Example scenario: To trigger call between sales person and customer

### Step 1 - For sales person, open below URL in browser 

Redirect to :

```sh
http://localhost:3000/sales
```

### Step 2 - For customer, open below url in browser 

Redirect to :

```sh
http://localhost:3000/customer
```

## Step 3 - Initiate call and check the response 
Click on "Call" button

--

For more information visit our official [documentation](https://docs.videosdk.live/docs/realtime-communication/intro)
