import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import WebcamOffIcon from "../../icons/Bottombar/WebcamOffIcon";
import useMediaStream from "../../hooks/useMediaStream";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { useMeeting, useMediaDevice } from "@videosdk.live/react-sdk";
import { OutlinedButton } from "./OutlinedButton";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";
import { Popover, Transition } from "@headlessui/react";


const WebCamBTN = () => {
    const {
      selectedWebcam,
      setSelectedWebcam,
      isCameraPermissionAllowed,
    } = useMeetingAppContext()
    const {getCameras} = useMediaDevice();
    const mMeeting = useMeeting();
    const [webcams, setWebcams] = useState([]);
    const { getVideoTrack } = useMediaStream();
  
    const localWebcamOn = mMeeting?.localWebcamOn;
    const changeWebcam = mMeeting?.changeWebcam;
  
    const getWebcams = async () => {
      let webcams = await getCameras();
      webcams && webcams?.length && setWebcams(webcams);
    };
  
    const [tooltipShow, setTooltipShow] = useState(false);
    const btnRef = useRef();
    const tooltipRef = useRef();
  
    const openTooltip = () => {
      createPopper(btnRef.current, tooltipRef.current, {
        placement: "top",
      });
      setTooltipShow(true);
    };
    const closeTooltip = () => {
      setTooltipShow(false);
    };
  
    return (
      <>
        <OutlinedButton
          Icon={localWebcamOn ? WebcamOnIcon : WebcamOffIcon}
          onClick={async () => {
            let track;
            if (!localWebcamOn) {
              track = await getVideoTrack({
                webcamId: selectedWebcam.id
              });
            }
            mMeeting.toggleWebcam(track);
          }}
          bgColor={localWebcamOn ? "bg-gray-750" : "bg-white"}
          borderColor={localWebcamOn && "#ffffff33"}
          isFocused={localWebcamOn}
          focusIconColor={localWebcamOn && "white"}
          tooltip={"Toggle Webcam"}
          renderRightComponent={() => {
            return (
              <>
                <Popover className="relative">
                  {({ close }) => (
                    <>
                      <Popover.Button disabled={!isCameraPermissionAllowed} className="flex items-center justify-center mt-1 mr-1 focus:outline-none">
                        <div
                          ref={btnRef}
                          onMouseEnter={openTooltip}
                          onMouseLeave={closeTooltip}
                        >
                          <button
                            onClick={() => { getWebcams() }}
                          >
                            <ChevronDownIcon
                              className="h-4 w-4"
                              style={{
                                color: localWebcamOn ? "white" : "black",
                              }}
                            />
                          </button>
                        </div>
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute left-1/2 bottom-full z-10 mt-3 w-72 -translate-x-1/2 transform px-4 sm:px-0 pb-4">
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className={" bg-gray-750 py-1"}>
                              <div>
                                <div className="flex items-center p-3 pb-0">
                                  <p className="ml-3 text-sm text-gray-900">
                                    {"WEBCAM"}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  {webcams.map(({ deviceId, label }, index) => (
                                    <div
                                      className={`px-3 py-1 my-1 pl-6 text-white ${deviceId === selectedWebcam.id &&
                                        "bg-gray-150"
                                        }`}
                                    >
                                      <button
                                        className={`flex flex-1 w-full text-left ${deviceId === selectedWebcam.id &&
                                          "bg-gray-150"
                                          }`}
                                        key={`output_webcams_${deviceId}`}
                                        onClick={() => {
                                          setSelectedWebcam({ id: deviceId });
                                          changeWebcam(deviceId);
                                          close();
                                        }}
                                      >
                                        {label || `Webcam ${index + 1}`}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
                <div
                  style={{ zIndex: 999 }}
                  className={`${tooltipShow ? "" : "hidden"
                    } overflow-hidden flex flex-col items-center justify-center pb-4`}
                  ref={tooltipRef}
                >
                  <div className={"rounded-md p-1.5 bg-black "}>
                    <p className="text-base text-white ">{"Change webcam"}</p>
                  </div>
                </div>
              </>
            );
          }}
        />
      </>
    );
  };

  export default WebCamBTN;