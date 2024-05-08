import { createCameraVideoTrack , createMicrophoneAudioTrack } from "@videosdk.live/react-sdk";

const useMediaStream = () => {

  const getVideoTrack = async ({ webcamId, encoderConfig }) => {
    try {
      const track = await createCameraVideoTrack({
        cameraId: webcamId ,
        encoderConfig: encoderConfig ?  encoderConfig :"h2160p_w3840p",
        optimizationMode: "detail",
        multiStream: true,
      });

      return track;
    } catch(error) {
      return null;
    }
  };

  const getAudioTrack = async ({micId}) => {
    try{
      const track = await createMicrophoneAudioTrack({
        microphoneId: micId,
        encoderConfig: "high_quality_stereo",
        noiseConfig:{
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false
        }
      });
      return track;
    } catch(error) {
      return null;
    }
  };

  return { getVideoTrack,getAudioTrack };
};

export default useMediaStream;
