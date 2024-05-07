# PeerMeet
This is a simple video conferencing app built using VideoSDK SDK and MERN stack. The goal of the project is to practice MERN Stack, know about SDK,
This project is built for educational purposes. 

## Live Link: 
 - Link1: [https://sg34-peermeet.netlify.app/](https://sg34-peermeet.netlify.app/)
 - Link2: [https://sg34-peermeet.web.app/](https://sg34-peermeet.web.app/)
 - Link3: [https://sg34-peermeet.firebaseapp.com/](https://sg34-peermeet.firebaseapp.com/)

 - The site deals with high-resolution real-time video streams and hence utilizes a lot of resources. Hence, this link may crash several times due to the limited resource allocation of the free hosting services.

## Highlights of the Project:
 - Like-Realtime Communication(very minimal latency)
 - High-quality audio-visual communication
 - Features like switching media devices such as camera, mic, speaker; Screen Sharing, Call Chat, Raising Hand, Meeting Recording(Recording will be available at the SDK provider's dashboard)
 - Network Status monitoring
 - Interactive and self-explanatory User Interface.

## How to Run the Project?
 - Clone the repository by `git clone https://github.com/sayakghorai34/PeerMeet.git`
 ### server:
  - Go to the `VideoSDK` homepage [https://www.videosdk.live/](https://www.videosdk.live/) and follow the instructions to create your `API` and `SECRET`.
  The VideoSDK API screen would look like this:
<img width="1383" alt="Screenshot 2024-05-08 at 4 01 12 AM" src="https://github.com/sayakghorai34/PeerMeet/assets/137064671/bd52d43b-ce8e-4362-9b10-e19aa36b9848">

### In the code editor:
  - Go to the server directory by running `cd server`
  - Rename the `.env copy` to `.env`
  - Paste your `API` and `SECRET` under `API_KEY` and `SECRET_KEY`.
  - Run `npm i` to install all the dependencies/ node modules.
  - Run `npm start` to start the server.
### frontend:
  - Go to the frontend directory by `cd frontend`
  - Run `npm i` to install all the dependencies/ node modules.
  - Run `npm start` to start the server.
  - This should automatically open `http://localhost:3000` or some other available port if already occupied.

## A Quick UI tour:  
 - The Homepage:
   ![image](https://github.com/sayakghorai34/PeerMeet/assets/115321969/55a98b7e-d11b-4945-80c3-3054d72c9e26)
 - Create Meeting:
   ![image](https://github.com/sayakghorai34/PeerMeet/assets/115321969/6f501c1c-38d7-4108-9c51-f7d03659ec52)
 - Join Meeting:
   ![image](https://github.com/sayakghorai34/PeerMeet/assets/115321969/6903d56f-9104-4cda-8b17-86974976505c)
 - Meeting Room:
   ![image](https://github.com/sayakghorai34/PeerMeet/assets/115321969/2142e02f-07f6-4cae-82c0-995acb1ff7d5)
 - Meeting controls/toggles:
   ![image](https://github.com/sayakghorai34/PeerMeet/assets/115321969/bdf52292-3cfa-4e5e-80ce-3d357e218baa)
 - Chat Section:
   ![WhatsApp Image 2024-05-08 at 03 55 26_dba2277d](https://github.com/sayakghorai34/PeerMeet/assets/115321969/d0f00ce3-4652-4ad9-874f-48461af791c1)
## Future Aspects:
  - Implement Login & oAuth for the sake of the user's distinct API and SECRET usages.
      - Currently, the user will be using the developer's API and SECRET so the meeting recordings won't be available to the users, but the developer can access it. The Developer can also monitor activities such as meeting duration, participants, meeting stats and analytics, and many more things. So, generally, it will raise user privacy and security issues. If we implement the Login feature and store the data using some database, MongoDB preferably, we can store the user's own API and SECRET of all individual users. Then the backend server can generate the token using the user's credentials and all data will be stored within the user's reach. They will be able to see their meeting logs and recordings and everything will stay within the VideoSDK server with the consent of the user that they must have agreed upon during Account setup.
  - Optimise the code for better performance within limited resource
  - Optimise media stream for negotiating with media quality, and network bandwidth.

## Updates:
  - Implemented a bit of Lazy loading for resource optimization
  - Explored and modified the Media Streams (video and audio track) such as implementing multi-track video, and audio processing, for a better experience
  - Modularized and break down large modules into small small components
