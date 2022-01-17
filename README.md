# Video SDK RTC Call Trigger Code Sample

## What is it?

This code sample represents call trigger feature using video sdk built with [Video SDK RTC Prebuilt SDK](https://docs.videosdk.live/docs/guide/prebuilt-video-and-audio-calling/getting-started) and [Video SDK RTC JS SDK](https://docs.videosdk.live/docs/realtime-communication/sdk-reference/javascript-sdk/setup)

- Built for serverless video calling experience.
- Scale it upto 5,000 participants with low code.
- 10,000 minutes free on monthly basis.
- Inbuilt video and audio quality optimization.
- Inbuilt chat poll, whiteboard, Q and A support.


## Features

- [x] Completely Low code and serverless.
- [x] Video API with real-time audio, video and data streams
- [x] 5,000+ participants support
- [x] Chat support with rich media.
- [x] Screen sharing with HD and Full HD.
- [x] Play realtime video in meeting
- [x] Connect it with social media such as Facebook, Youtube etc (RTMP out support).
- [x] Intelligent speaker switch
- [x] Record your meetings on cloud
- [x] Inbuilt support of whiteboard, poll and Q & A.
- [x] Customize UI as per your needs.

## Browser Support

Visit our official guide for [Browser Support](https://docs.videosdk.live/docs/realtime-communication/see-also/device-browser-support)

## Prerequisites

- node
- npm
- react

## Getting started
## SERVER


1. Clone the repo and change directory to server

   ```sh
   git clone https://github.com/videosdk-live/videosdk-rtc-react-prebuilt-call-trigger-example.git
   cd videosdk-rtc-react-prebuilt-call-trigger-example/server
   ```

2. Copy the `.env.example` file to `.env` file.

   ```sh
   cp .env.example .env
   ```
3. Install NPM packages

   ```sh
   npm install
   ```

4. Run the server

   ```sh
   npm start
    ```

## CLIENT


1. Change directory to client

   ```sh
   cd videosdk-rtc-react-prebuilt-call-trigger-example/client
   ```

2. Copy the `.env.example` file to `.env` file.

   ```sh
   cp .env.example .env
   ```
  
3. Update api key generated from [app.videosdk.live](https://app.videosdk.live/settings/api-keys) in `.env`.

   ```
   REACT_APP_VIDEOSDK_API_KEY="<API KEY>"
   ```

4. Install NPM packages

   ```sh
   npm install
   ```

5. Run the client

   ```sh
   npm start
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
Click on "Execute Call" button

--

For more information visit our official [documentation](https://docs.videosdk.live/docs/guide/prebuilt-video-and-audio-calling/getting-started)
