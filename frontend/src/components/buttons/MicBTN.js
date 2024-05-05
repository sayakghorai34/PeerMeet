import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import MicOffIcon from "../../icons/Bottombar/MicOffIcon";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { useMeeting, useMediaDevice } from "@videosdk.live/react-sdk";
import { OutlinedButton } from "./OutlinedButton";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";
import { Popover, Transition } from "@headlessui/react";


const MicBTN = () => {
    const {
      selectedMic,
      setSelectedMic,
      selectedSpeaker,
      setSelectedSpeaker,
      isMicrophonePermissionAllowed
    } = useMeetingAppContext()
  
    const {
       getMicrophones, getPlaybackDevices
    } = useMediaDevice();
  
    const mMeeting = useMeeting();
    const [mics, setMics] = useState([]);
    const [speakers, setSpeakers] = useState([])
    const localMicOn = mMeeting?.localMicOn;
    const changeMic = mMeeting?.changeMic;
  
    const getMics = async () => {
      const mics = await getMicrophones();
      const speakers = await getPlaybackDevices();
  
      mics && mics?.length && setMics(mics);
      speakers && speakers?.length && setSpeakers(speakers)
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
          Icon={localMicOn ? MicOnIcon : MicOffIcon}
          onClick={() => { mMeeting.toggleMic() }}
          bgColor={localMicOn ? "bg-gray-750" : "bg-white"}
          borderColor={localMicOn && "#ffffff33"}
          isFocused={localMicOn}
          focusIconColor={localMicOn && "white"}
          tooltip={"Toggle Mic"}
          renderRightComponent={() => {
            return (
              <>
                <Popover className="relative">
                  {({ close }) => (
                    <>
                      <Popover.Button disabled={!isMicrophonePermissionAllowed} className="flex items-center justify-center mt-1 mr-1 focus:outline-none">
                        <div
                          ref={btnRef}
                          onMouseEnter={openTooltip}
                          onMouseLeave={closeTooltip}
                        >
                          <button
                            onClick={() => { getMics() }}
                          >
                            <ChevronDownIcon
                              className="h-4 w-4"
                              style={{
                                color: mMeeting.localMicOn ? "white" : "black",
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
                                    {"MICROPHONE"}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  {mics.map(({ deviceId, label }, index) => (
                                    <div
                                      className={`px-3 py-1 my-1 pl-6 text-white text-left ${deviceId === selectedMic.id &&
                                        "bg-gray-150"
                                        }`}
                                    >
                                      <button
                                        className={`flex flex-1 w-full text-left ${deviceId === selectedMic.id &&
                                          "bg-gray-150"
                                          }`}
                                        key={`mics_${deviceId}`}
                                        onClick={() => {
                                          setSelectedMic({ id: deviceId });
                                          changeMic(deviceId);
                                          close();
                                        }}
                                      >
                                        {label || `Mic ${index + 1}`}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <hr className='border border-gray-50 mt-2 mb-1' />
                              <div>
                                <div className="flex p-3 pb-0">
                                  <p className="ml-3 text-sm text-gray-900  text-center">
                                    {"SPEAKER"}
                                  </p>
                                </div>
                                <div className="flex flex-col ">
                                  {speakers.map(({ deviceId, label }, index) => (
                                    <div
                                      className={`px-3 py-1 my-1 pl-6 text-white ${deviceId === selectedSpeaker.id &&
                                        "bg-gray-150"
                                        }`}
                                    >
                                      <button
                                        className={`flex flex-1 w-full text-left ${deviceId === selectedSpeaker.id &&
                                          "bg-gray-150"
                                          }`}
                                        key={`speakers_${deviceId}`}
                                        onClick={() => {
                                          setSelectedSpeaker({ id: deviceId });
                                          close();
                                        }}
                                      >
                                        {label || `Speaker ${index + 1}`}
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
                    <p className="text-base text-white ">
                      {"Change microphone"}
                    </p>
                  </div>
                </div>
              </>
            );
          }}
        />
      </>
    );
  };

  export default MicBTN;