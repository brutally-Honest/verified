import { useEffect, useCallback, useState, useContext, useRef } from "react";
import { SocketContext } from "../../context/SocketContext";
import peer from "../../Services/peer";
import ReactPlayer from "react-player";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { LeaveCall, PhoneCall } from "../../assets/Svg";
import BeatLoader from "react-spinners/BeatLoader";

export const VideoCall = () => {
  const socket = useContext(SocketContext);
  const [remoteUserSocketId, setRemoteUserSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { role } = jwtDecode(localStorage.getItem("token"));
  const [callConnected,setCallConnected]=useState(false)
  const navigate = useNavigate();

  const handleUserJoined = useCallback(
    ({ userSocket, userId }) => {
      console.log(userId, "Joined room 1 with socket Id:", userSocket);
      setRemoteUserSocketId(userSocket);
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  //setMyStream and send offer to remote user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    setCallConnected(true)
    const offer = await peer.getOffer();
    socket.emit("userCall", { to: remoteUserSocketId, offer });
  }, [remoteUserSocketId, socket]);

  //receieve offer, setMyStream and send answer
  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteUserSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      console.log("Incomming Call", offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("callAccepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted");
      sendStreams();
    },
    [sendStreams]
  );

  const handleTracks = useCallback(
    async (eve) => {
      const remoteStream = eve.streams;
      setRemoteStream(remoteStream[0]);
    },
    [remoteStream]
  );

  useEffect(() => {
    console.log("Listening for remote Stream");
    peer.peer.addEventListener("track", handleTracks);
    return () => {
      peer.peer.removeEventListener("track", handleTracks);
    };
  }, []);
  
//negotiations for reconnection
  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peerNegotiationNeeded", { offer, to: remoteUserSocketId });
  }, [remoteUserSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  const handleNegotiationIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peerNegotiationDone", { to: from, ans });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on("userJoined", handleUserJoined);
    socket.on("incommingCall", handleIncommingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("peerNegotiationNeeded", handleNegotiationIncomming);
    socket.on("peerNegotiationFinal", handleNegotiationFinal);
    return () => {
      socket.off("userJoined", handleUserJoined);
      socket.off("incommingCall", handleIncommingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("peerNegotiationNeeded", handleNegotiationIncomming);
      socket.off("peerNegotiationFinal", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegotiationIncomming,
    handleNegotiationFinal,
  ]);

  useEffect(() => {
    return () => {
      if ((myStream, remoteStream)) {
        myStream.getTracks().forEach((track) => track.stop());
        remoteStream.getTracks().forEach((track) => track.stop());
        setMyStream(null);
        setRemoteStream(null);
      }
    };
  }, []);
  const leaveCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const myTracks = stream.getTracks();
    myTracks.forEach((track) => {
      track.stop();
      track.enabled = false;
    });
    const remoteTracks = remoteStream.getTracks();
    remoteTracks.forEach((track) => {
      track.stop();
    });
    console.log(myTracks);
    setMyStream(null);
    setRemoteStream(null);
    setCallConnected(false)

    // setRemoteUserSocketId(null);
    if (role === "member" || role === "groupAdmin") navigate("/dashboard");
    else navigate("/visitors/new");
    window.location.reload();
    // mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    // mediaStreamRef.current.srcObject=null
    // // myVideoRef.current.destroy();
    // // userVideoRef.current.destroy();
    // userVideoRef.current.srcObject=null
    // myVideoRef.current.srcObject=null
  };
  return (
    <>
      <div>
        <h2 className="text-center font-normal text-3xl">Video Call</h2>
      </div>
      {remoteUserSocketId ? (
        <h2 className="text-center font-semibold text-2xl">Connected</h2>
      ) : (
        <div className="flex justify-center">
          <h2 className="text-center font-semibold text-2xl">Yet to connect</h2>
          <div className="flex items-center ml-2">
            <BeatLoader
              color="#333333"
              loading={!remoteUserSocketId ? true : false}
            />
          </div>
        </div>
      )}
      {(remoteUserSocketId && !callConnected) &&(
        <div className="flex justify-center p-2 m-1 text-xl">
          <button onClick={handleCallUser}>
            <PhoneCall />
            Call
          </button>
        </div>
      )}

      <div className="md:flex md:overflow-hidden ">
        <div>
          {remoteStream && (
            <div className="md:p-1 md:m-0 md:text-white md:rounded-lg md:border-2 md:w-fit md:h-fit md:bg-black ">
              <div>Remote User</div>
              <div>
                <ReactPlayer
                  url={remoteStream}
                  playing
                  muted
                  width={"70vw"}
                  height={"50dvh"}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex md:items-end   ">
          {myStream && (
            <div className="md:p-1 md:m-0 md:text-white md:rounded-md md:border-2 md:w-fit md:h-fit md:bg-black flex md:items-end ">
              <div>Me</div>
              <div>
                <ReactPlayer
                  url={myStream}
                  playing
                  muted
                  width={"25vw"}
                  height={"35dvh"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {(myStream && callConnected) && <div className="flex justify-center m-1 p-1 text-xl font-semibold">
        <button onClick={leaveCall}>
          <div className="flex justify-center">
            <LeaveCall />
          </div>
          Leave Call{" "}
        </button>
      </div>}
      
    </>
  );
};
