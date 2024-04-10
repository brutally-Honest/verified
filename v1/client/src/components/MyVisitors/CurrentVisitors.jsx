import _ from "lodash";
import { SocketContext } from "../../context/SocketContext";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export const CurrentVisitors = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [video, setVideo] = useState(false);
  const [vImg, setVImg] = useState("");

  const handleClick = (permission) => {
    const result = {
      ...userState.visitorPermission,
      permission: permission,
      video,
      approvedBy: userState.user._id,
    };
    socket.emit("permission acknowledged", result);
    userDispatch({ type: "CLEAR_CURRENT_VISITOR" });
    if (video) {
      // socket.emit("joinVideoCall");
      socket.emit("joinVideoCall",userState.user._id);
      navigate("/videoCall");
    }
  };

  useEffect(() => {
    if (!_.isEmpty(userState.visitorPermission)) {
      console.log(userState.visitorPermission);
      if (_.isEmpty(userState.visitorPermission.imageUrl)) {
        const reader = new FileReader();
        reader.readAsDataURL(userState.visitorPermission.blob);
        reader.onloadend = () => setVImg(reader.result);
      } else {
        const vImage = userState.visitorPermission.imageUrl;
        setVImg(vImage);
      }
    }
  }, [userState.visitorPermission]);

  return (
    <>
      <div className=" mt-[50px]">
        <div className="flex justify-center">
          {_.isEmpty(userState.visitorPermission) ? (
            <div className="font-extralight text-4xl text-center">
              No Visitors
            </div>
          ) : (
            <div className=" bg-gradient-to-l from-black via-cyan-800 to-emerald-500  border-2 border-gray-600 flex flex-col items-center  rounded-md shadow-md px-[6dvw] py-5 ">
                <div>
                  <img
                    src={vImg}
                    width={300}
                    height={200}
                    className=" border-2 shadow-md"
                  />
                </div>
              
              <div className="p-2">
                <span className="  p-1  font-medium text-white kanit">
                  NAME :
                </span>
                <span className="font-semibold text-lg p-1 text-white">
                  {userState.visitorPermission?.visitorName}
                </span>
              </div>
              <div className="p-2">
                <span className=" p-1 font-medium text-white  kanit">
                  PHONE NUMBER :
                </span>
                <span className="font-semibold text-lg p-1 text-white">
                  {userState.visitorPermission?.visitorPhoneNumber}
                </span>
              </div>
              <div className="flex p-2">
                <div className="flex items-center font-medium p-1 text-white kanit">
                  {" "}
                  VIDEO :
                </div>
                <div className="flex ">
                  <button
                    className={`m-1 p-1  px-2 rounded  border-black font-semibold  ${
                      video ? "bg-green-600  " : "bg-white"
                    }`}
                    onClick={() => setVideo(true)}
                  >
                    True
                  </button>
                  <button
                    className={`m-1 p-1 px-2  rounded border-black  font-semibold  ${
                      !video ? "bg-red-600  " : "bg-white"
                    }`}
                    onClick={() => setVideo(false)}
                  >
                    False
                  </button>
                </div>
              </div>
              {video ? (
                <div>
                  <button
                    className="m-1 p-2 bg-emerald-500/80 rounded font-semibold hover:bg-green-400"
                    onClick={() => handleClick(true)}
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="flex ">
                  <button
                    className="m-1 p-2 bg-emerald-500/80 rounded font-semibold hover:bg-green-400"
                    onClick={() => handleClick(true)}
                  >
                    Accept
                  </button>
                  <button
                    className="m-1 p-2 bg-rose-500/90 rounded  font-semibold hover:bg-red-600"
                    onClick={() => handleClick(false)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
