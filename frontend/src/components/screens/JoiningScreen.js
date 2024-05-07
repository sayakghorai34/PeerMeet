import React, { useEffect, useRef, useState } from "react";
import { MeetingDetailsScreen } from "../MeetingDetailsScreen";
import { createMeeting, getToken, validateMeeting } from "../../api";
import ConfirmBox from "../ConfirmBox";
import {
  Constants,
  useMediaDevice
} from "@videosdk.live/react-sdk";
import useMediaStream from "../../hooks/useMediaStream";
import useIsMobile from "../../hooks/useIsMobile";
import WebcamOffIcon from "../../icons/WebcamOffIcon";
import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import MicOffIcon from "../../icons/MicOffIcon";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import MicPermissionDenied from "../../icons/MicPermissionDenied";
import CameraPermissionDenied from "../../icons/CameraPermissionDenied";
import DropDown from "../DropDown";
import DropDownCam from "../DropDownCam";
import DropDownSpeaker from "../DropDownSpeaker";
import NetworkStats from "../NetworkStats";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { toast } from "react-toastify";
import Logo from "./webcam.png";

const JoiningScreen = ({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  onClickStartMeeting,
  micOn,
  webcamOn,
  setWebcamOn,
  setMicOn,
  customAudioStream,
  setCustomAudioStream,
  setCustomVideoStream
}) => {
  const {
    selectedWebcam,
    selectedMic,
    setSelectedMic,
    setSelectedWebcam,
    setSelectedSpeaker,
    isCameraPermissionAllowed,
    isMicrophonePermissionAllowed,
    setIsCameraPermissionAllowed,
    setIsMicrophonePermissionAllowed
  } = useMeetingAppContext();

  const [{ webcams, mics, speakers }, setDevices] = useState({
    webcams: [],
    mics: [],
    speakers: [],
  });
  const { getVideoTrack, getAudioTrack } = useMediaStream();
  const {
    checkPermissions,
    getCameras,
    getMicrophones,
    requestPermission,
    getPlaybackDevices,
  } = useMediaDevice({ onDeviceChanged });
  const [audioTrack, setAudioTrack] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [dlgMuted, setDlgMuted] = useState(false);
  const [dlgDevices, setDlgDevices] = useState(false);
  const [didDeviceChange, setDidDeviceChange] = useState(false);

  const videoPlayerRef = useRef();
  const videoTrackRef = useRef();
  const audioTrackRef = useRef();
  const audioAnalyserIntervalRef = useRef();
  const permissonAvaialble = useRef();
  const webcamRef = useRef();
  const micRef = useRef();
  const isMobile = useIsMobile();

  useEffect(() => { webcamRef.current = webcamOn }, [webcamOn]);
  useEffect(() => { micRef.current = micOn }, [micOn]);

  useEffect(() => {
    permissonAvaialble.current = {
      isCameraPermissionAllowed,
      isMicrophonePermissionAllowed,
    };
  }, [isCameraPermissionAllowed, isMicrophonePermissionAllowed]);

  useEffect(() => {
    if (micOn) {
      audioTrackRef.current = audioTrack;
      startMuteListener();
    }
  }, [micOn, audioTrack]);

  useEffect(() => {
    if (webcamOn) {
      videoTrackRef.current = videoTrack;
      handleVideoTrack();
    }
  }, [webcamOn, videoTrack]);

  useEffect(() => {
    getDevices();
  }, [isCameraPermissionAllowed, isMicrophonePermissionAllowed]);

  useEffect(() => {
    checkMediaPermission();
  }, []);

  const handleVideoTrack = () => {
    const videoTrack = videoTrackRef.current;
    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack]);
      videoPlayerRef.current.srcObject = videoSrcObject;
    } else {
      videoPlayerRef.current.srcObject = null;
    }
  };

  const getDevices = async () => {
    if (isCameraPermissionAllowed) {
      const webcams = await getCameras();
      setSelectedWebcam({ id: webcams[0]?.deviceId, label: webcams[0]?.label });
      setDevices((devices) => ({ ...devices, webcams }));
    }

    if (isMicrophonePermissionAllowed) {
      const mics = await getMicrophones();
      const speakers = await getPlaybackDevices();
      setSelectedSpeaker({ id: speakers[0]?.deviceId, label: speakers[0]?.label });
      setSelectedMic({ id: mics[0]?.deviceId, label: mics[0]?.label });
      setDevices((devices) => ({ ...devices, mics, speakers }));
    }
  };

  const startMuteListener = () => {
    const currentAudioTrack = audioTrackRef.current;
    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }
      currentAudioTrack.addEventListener("mute", () => {
        setDlgMuted(true);
      });
    }
  };

  const checkMediaPermission = async () => {
    const checkAudioVideoPermission = await checkPermissions();
    const cameraPermissionAllowed = checkAudioVideoPermission.get(Constants.permission.VIDEO);
    const microphonePermissionAllowed = checkAudioVideoPermission.get(Constants.permission.AUDIO);

    setIsCameraPermissionAllowed(cameraPermissionAllowed);
    setIsMicrophonePermissionAllowed(microphonePermissionAllowed);

    if (microphonePermissionAllowed) {
      setMicOn(true);
      getDefaultMediaTracks({ mic: true, webcam: false });
    } else {
      await requestAudioVideoPermission(Constants.permission.AUDIO);
    }

    if (cameraPermissionAllowed) {
      setWebcamOn(true);
      getDefaultMediaTracks({ mic: false, webcam: true });
    } else {
      await requestAudioVideoPermission(Constants.permission.VIDEO);
    }
  };

  const getDefaultMediaTracks = async ({ mic, webcam }) => {
    if (mic) {
      const stream = await getAudioTrack({ micId: selectedMic.id });
      setCustomAudioStream(stream);
      const audioTracks = stream?.getAudioTracks();
      const audioTrack = audioTracks.length ? audioTracks[0] : null;
      setAudioTrack(audioTrack);
    }

    if (webcam) {
      const stream = await getVideoTrack({ webcamId: selectedWebcam.id });
      setCustomVideoStream(stream);
      const videoTracks = stream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
    }
  };

  const requestAudioVideoPermission = async (mediaType) => {
    try {
      const permission = await requestPermission(mediaType);

      if (mediaType === Constants.permission.AUDIO) {
        setIsMicrophonePermissionAllowed(permission.get(Constants.permission.AUDIO));
      }

      if (mediaType === Constants.permission.VIDEO) {
        setIsCameraPermissionAllowed(permission.get(Constants.permission.VIDEO));
      }

      if (permission.get(Constants.permission.AUDIO)) {
        setMicOn(true);
        getDefaultMediaTracks({ mic: true, webcam: false });
      }

      if (permission.get(Constants.permission.VIDEO)) {
        setWebcamOn(true);
        getDefaultMediaTracks({ mic: false, webcam: true });
      }
    } catch (ex) {
      console.log("Error in requestPermission ", ex);
    }
  };

  const _toggleWebcam = () => {
    if (webcamOn) {
      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
        setVideoTrack(null);
        setCustomVideoStream(null);
        setWebcamOn(false);
      }
    } else {
      getDefaultMediaTracks({ mic: false, webcam: true });
      setWebcamOn(true);
    }
  };

  const _toggleMic = () => {
    if (micOn) {
      if (audioTrackRef.current) {
        audioTrackRef.current.stop();
        setAudioTrack(null);
        setCustomAudioStream(null);
        setMicOn(false);
      }
    } else {
      getDefaultMediaTracks({ mic: true, webcam: false });
      setMicOn(true);
    }
  };

  const changeWebcam = async (deviceId) => {
    if (webcamOn) {
      const currentVideoTrack = videoTrackRef.current;
      if (currentVideoTrack) {
        currentVideoTrack.stop();
      }
      const stream = await getVideoTrack({ webcamId: deviceId });
      setCustomVideoStream(stream);
      const videoTracks = stream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
    }
  };

  const changeMic = async (deviceId) => {
    if (micOn) {
      const currentAudioTrack = audioTrackRef.current;
      currentAudioTrack && currentAudioTrack.stop();
      const stream = await getAudioTrack({ micId: deviceId });
      setCustomAudioStream(stream);
      const audioTracks = stream?.getAudioTracks();
      const audioTrack = audioTracks.length ? audioTracks[0] : null;
      clearInterval(audioAnalyserIntervalRef.current);
      setAudioTrack(audioTrack);
    }
  };

  function onDeviceChanged() {
    setDidDeviceChange(true);
    getDevices();
    getDefaultMediaTracks({ mic: micRef.current, webcam: webcamRef.current });
  }

  const ButtonWithTooltip = ({ onClick, onState, OnIcon, OffIcon }) => {
    const btnRef = useRef();
    return (
      <div>
        <div>
          <button
            ref={btnRef}
            onClick={onClick}
            className={`rounded-full min-w-auto w-12 h-12 flex items-center justify-center 
            ${onState ? "bg-white" : "bg-red-650 text-white"}`}
          >
            {onState ? (
              <OnIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            ) : (
              <OffIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 select-none">
      <div className="overflow-y-auto flex flex-col flex-1 h-screen bg-gray-800">
        <div className="flex flex-1 flex-col md:flex-row items-center justify-center md:m-[72px] m-16">
          <div className="container grid  md:grid-flow-col grid-flow-row ">
            <div className="grid grid-cols-12">
              <div className="md:col-span-7 2xl:col-span-7 col-span-12">
                <div className="flex items-center justify-center p-1.5 sm:p-4 lg:p-6">
                  <div className="relative w-full md:pl-4 sm:pl-10 pl-5  md:pr-4 sm:pr-10 pr-5">
                    <div className="w-full relative" style={{ height: "55vh" }}>
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoPlayerRef}
                        controls={false}
                        style={{ backgroundColor: "#1c1c1c" }}
                        className={"rounded-[10px] h-full w-full object-cover flex items-center justify-center flip "}
                      />
                      {!isMobile ? (
                        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                          {!webcamOn && <p className="text-xl xl:text-lg 2xl:text-xl text-white">The camera is off</p>}
                        </div>
                      ) : null}
                      <div className="absolute xl:bottom-6 bottom-4 left-0 right-0">
                        <div className="container grid grid-flow-col space-x-4 items-center justify-center md:-m-2">
                          {isMicrophonePermissionAllowed ? (
                            <ButtonWithTooltip
                              onClick={_toggleMic}
                              onState={micOn}
                              OnIcon={MicOnIcon}
                              OffIcon={MicOffIcon}
                            />
                          ) : (
                            <MicPermissionDenied />
                          )}
                          {isCameraPermissionAllowed ? (
                            <ButtonWithTooltip
                              onClick={_toggleWebcam}
                              onState={webcamOn}
                              OnIcon={WebcamOnIcon}
                              OffIcon={WebcamOffIcon}
                            />
                          ) : (
                            <CameraPermissionDenied />
                          )}
                        </div>
                      </div>
                    </div>
                    {!isMobile && (
                      <>
                        <div className="absolute top-2 right-10">
                          <NetworkStats />
                        </div>
                        <div className="flex mt-3">
                          <DropDown
                            mics={mics}
                            changeMic={changeMic}
                            customAudioStream={customAudioStream}
                            audioTrack={audioTrack}
                            micOn={micOn}
                            didDeviceChange={didDeviceChange}
                            setDidDeviceChange={setDidDeviceChange}
                          />
                          <DropDownSpeaker speakers={speakers} />
                          <DropDownCam
                            changeWebcam={changeWebcam}
                            webcams={webcams}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 2xl:col-span-5 col-span-12 md:relative">
                <div className=" align-middle">
                  <h1 className="text-gray-400 text-2xl sm:text-xl font-bold text-center mt-4">
                    <img src={Logo} alt="PeerMeet Logo" className="w-12 h-12 mx-auto transition-transform duration-300 transform scale-100 hover:scale-95" />
                    <span className="">Welcome to PeerMeet!</span>
                  </h1>
                  <div className="flex flex-1 flex-col items-center justify-center xl:m-16 lg:m-6 md:mt-9 lg:mt-14 xl:mt-20 mt-3 md:absolute md:left-0 md:right-0 md:top-0 md:bottom-0">
                    <MeetingDetailsScreen
                      participantName={participantName}
                      setParticipantName={setParticipantName}
                      videoTrack={videoTrack}
                      setVideoTrack={setVideoTrack}
                      onClickStartMeeting={onClickStartMeeting}
                      onClickJoin={async (id) => {
                        const token = await getToken();
                        const { meetingId, err } = await validateMeeting({
                          roomId: id,
                          token,
                        });
                        if (meetingId === id) {
                          setToken(token);
                          setMeetingId(id);
                          onClickStartMeeting();
                        } else {
                          toast(
                            `${err}`,
                            {
                              position: "bottom-left",
                              autoClose: 4000,
                              hideProgressBar: true,
                              closeButton: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            }
                          );
                        }
                      }}
                      _handleOnCreateMeeting={async () => {
                        const token = await getToken();
                        const { meetingId, err } = await createMeeting({ token });
                        if (meetingId) {
                          setToken(token);
                          setMeetingId(meetingId);
                        }
                        return { meetingId: meetingId, err: err }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmBox
        open={dlgMuted}
        successText="OKAY"
        onSuccess={() => {
          setDlgMuted(false);
        }}
        title="System mic is muted"
        subTitle="You're default microphone is muted, please unmute it or increase audio input volume from system settings."
      />
      <ConfirmBox
        open={dlgDevices}
        successText="DISMISS"
        onSuccess={() => {
          setDlgDevices(false);
        }}
        title="Mic or webcam not available"
        subTitle="Please connect a mic and webcam to speak and share your video in the meeting. You can also join without them."
      />
    </div>
  );  
}
export default JoiningScreen;