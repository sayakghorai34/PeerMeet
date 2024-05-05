import PipIcon from "../icons/Bottombar/PipIcon";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { MobileIconButton } from "../components/buttons/MobileIconButton";
import { OutlinedButton } from "../components/buttons/OutlinedButton";
import { useRef } from "react";

const PipBTN = ({ isMobile, isTab }) => {
    const { pipMode, setPipMode } = useMeetingAppContext();
  
    const getRowCount = (length) => {
      return length > 2 ? 2 : length > 0 ? 1 : 0;
    };
    const getColCount = (length) => {
      return length < 2 ? 1 : length < 5 ? 2 : 3;
    };
  
    const pipWindowRef = useRef(null);
    const togglePipMode = async () => {
      if (pipWindowRef.current) {
        await document.exitPictureInPicture();
        pipWindowRef.current = null;
        return;
      }
  
      if ("pictureInPictureEnabled" in document) {
        const source = document.createElement("canvas");
        const ctx = source.getContext("2d");
  
        const pipVideo = document.createElement("video");
        pipWindowRef.current = pipVideo;
        pipVideo.autoplay = true;
  
        const stream = source.captureStream();
        pipVideo.srcObject = stream;
        drawCanvas();
  
        pipVideo.onloadedmetadata = () => {
          pipVideo.requestPictureInPicture();
        };
        await pipVideo.play();
  
        pipVideo.addEventListener("enterpictureinpicture", (event) => {
          drawCanvas();
          setPipMode(true);
        });
  
        pipVideo.addEventListener("leavepictureinpicture", (event) => {
          pipWindowRef.current = null;
          setPipMode(false);
          pipVideo.srcObject.getTracks().forEach((track) => track.stop());
        });
  
        function drawCanvas() {
          const videos = document.querySelectorAll("video");
          try {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, source.width, source.height);
            const rows = getRowCount(videos.length);
            const columns = getColCount(videos.length);
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < columns; j++) {
                if (j + i * columns <= videos.length || videos.length === 1) {
                  ctx.drawImage(
                    videos[j + i * columns],
                    j < 1 ? 0 : source.width / (columns / j),
                    i < 1 ? 0 : source.height / (rows / i),
                    source.width / columns,
                    source.height / rows
                  );
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
          if (document.pictureInPictureElement === pipVideo) {
            requestAnimationFrame(drawCanvas);
          }
        }
      } else {
        alert("PIP is not supported by your browser");
      }
    };
  
    return isMobile || isTab ? (
      <MobileIconButton
        id="pip-btn"
        tooltipTitle={pipMode ? "Stop PiP" : "Start Pip"}
        buttonText={pipMode ? "Stop PiP" : "Start Pip"}
        isFocused={pipMode}
        Icon={PipIcon}
        onClick={() => {
          togglePipMode();
        }}
        disabled={false}
      />
    ) : (
      <OutlinedButton
        Icon={PipIcon}
        onClick={() => {
          togglePipMode();
        }}
        isFocused={pipMode}
        tooltip={pipMode ? "Stop PiP" : "Start Pip"}
        disabled={false}
      />
    );
  }

export default PipBTN;