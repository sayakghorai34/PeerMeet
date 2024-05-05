import React, { useEffect, useRef, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const WaitingToJoinScreen = () => {
  const waitingMessages = useMemo(() => [
    { index: 0, text: "Creating a room for you..." },
    { index: 1, text: "Almost there..." },
  ], []);

  const [message, setMessage] = useState(waitingMessages[0]);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [waitingMessages]);

  return (
    <div
      className="bg-gray-800"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="flex flex-col items-center">
        <CircularProgress style={{ color: "white" }} />
        <h1 className="text-white text-center font-bold mt-3 text-xl">
          {message.text}
        </h1>
      </div>
    </div>
  );
};

export default WaitingToJoinScreen;
