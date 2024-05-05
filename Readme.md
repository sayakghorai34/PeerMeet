# PeerMeet
This is a simple video conferencing app built using VideoSDK SDK and MERN stack. The goal of the project is to practice MERN Stack, know about SDKs',
This project is built for educational purpose. 

## Live Link: 
 - [https://sg34-peermeet.netlify.app/](https://sg34-peermeet.netlify.app/)
 - The site deals with high resolution real time video streams and hence utilizes a lot of resources. Hence, this link may crash several time due to the limited resource allocation of the free hosting services.

## Highlights of the Project:
 - Like-Realtime Communication(very minimal latency)
 - High Quality audio-visual communication
 - Features like switching media devices such as camera, mic, speaker; Screen Sharing, In Call Chat, Raising Hand, Meeting Recording(Recording will be available at the SDK provider's dashboard)
 - Network Status monitoring
 - Interactive and self explinatory User Interface.

## How to Run the Project?
 - Clone the repository by `git clone https://github.com/sayakghorai34/PeerMeet.git`
 ### server:
  - Go to the `VideoSDK` homepage [https://www.videosdk.live/](https://www.videosdk.live/) and follow the instructions to create your `API` and `SECRET`.
  - Go to the server directory by running `cd server`
  - Rename the `.env copy` to `.env`
  - Paste your `API` and `SECRET` under `API_KEY` and `SECRET_KEY`.
  - Run `npm i` to install all the dependencies/ node modules.
  - Run `npm start` to start the server.
### frontend:
  - Go to the frontend directoy by `cd frontend`
  - Run `npm i` to install all the dependencies/ node modules.
  - Run `npm start` to start the server.
  - This should auutomatically opean `http://localhost:3000`or some other available port if already occupied.
## Future Aspects:
  - Implement Login & oAuth for the sake of user's own API and SECRET usages.
      - Currently, the user will be using the developer's API and SECRET so the meeting recordings won't be available to the users, but developer can access it. Developer can also monitor accactivities such as meeting duration, participants, meetings stats and analytics and many more things. So, generally it will raise an user privacy and security issue. If we implement Login feature and store the data using some database, MongoDB preferably, we can store user's own API and SECRET of all individual users. Then the backend server can generate the token using the user's own credentials and all data will be stored within the user's reach. They will be able to see their meeting logs and recordings and everything will stay within the VideoSDK server with the concent of user that they must had agreed upon during Account setup.
  - Optimise the code for better performance within limited resource
  - Optimise media stream for negotiating with media quality, and network bandwidth.

## Updates:
  - Implemented a bit of Lazy loading for resource optimisation
  - Explored and modified the Media Streams (video and audio track) such as implemented multi-track video, audio processing, for better experience
  - Modularized and break down large modules into small small components
