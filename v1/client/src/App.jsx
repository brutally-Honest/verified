import _ from "lodash";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { UserContext } from "./context/UserContext";
import { userReducer } from "./reducers/currentUserReducer";
import { gaurdReducer } from "./reducers/gaurdReducer";
import { useDispatch } from "react-redux";
import { Navbar } from "./components/common/Navbar";
import { AllRoutes } from "./components/common/AllRoutes";
import { axiosInstance } from "./config/axios";
import { jwtDecode } from "jwt-decode";
import { startGetAllData } from "./actions/adminActions";
import { SocketContext, socket } from "./context/SocketContext";
import { PuffLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [userState, userDispatch] = useReducer(userReducer, {
    user: {},
    group: {},
    visitorTypes: [],
    isLoggedIn: false,
    visitorPermission: {}, //received from gaurd
  });
  const [gaurdState, gaurdDispatch] = useReducer(gaurdReducer, {
    visitors: [],
  });

//page reloads
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const { role, id } = jwtDecode(localStorage.getItem("token"));
      (async () => {
        setLoading(true);
        try {
          if (role === "admin") {
            const { data } = await axiosInstance.get("/users/account");
            userDispatch({ type: "SET_ADMIN", payload: data });
            dispatch(startGetAllData());
          } else {
            const responses = await Promise.all([
              await axiosInstance.get("/users/account"),
              await axiosInstance.get("/groups/account"),
              await axiosInstance.get("/visitors/types"),
            ]);
            // console.log(responses);
            socket.emit("userAuthId", { role, id: responses[0].data._id });
            userDispatch({
              type: "SET_USER",
              payload: responses.map((e) => e.data),
            });
          }
          setLoading(false);
        } catch (e) {
          toast.error("Something went Wrong!");
        }
      })();
    }
  }, [socket]);

  //for resident
  const handleRequest = useCallback((visitorData) => {
    toast("New Visitor Alert", { duration: 5000 });
    const blob = new Blob([visitorData.image.body], {
      type: visitorData.image.type,
    });
    visitorData.blob = blob;
    userDispatch({ type: "CURRENT_VISITOR", payload: visitorData });
  }, []);

  //for gaurd
  const handleExpectedVisitor = useCallback((data) => {
    toast("New Visitor Expected");
    gaurdDispatch({ type: "NEW_VISITOR", payload: data });
  }, []);

//socket
  useEffect(() => {
    socket.on("s-Permission", handleRequest);
    if (localStorage.getItem("token")) {
      const { role } = jwtDecode(localStorage.getItem("token"));
      if (role === "gaurd") {
        socket.on("s-expectedVisitor", handleExpectedVisitor);
      }
    }
    return () => {
      socket.off("s-Permission", handleRequest);
      socket.off("s-expectedVisitor", handleExpectedVisitor);
    };
  }, [socket, handleRequest]);

  return (
    <>
      {loading ? (
        <div className="h-screen w-screen">
          <div className="flex justify-center items-center h-full">
            <PuffLoader size={90} speedMultiplier={1.5} color="#6238cf"/>
          </div>
        </div>
      ) : (
        <SocketContext.Provider value={socket}>
          <UserContext.Provider value={{ userState, userDispatch, gaurdState, gaurdDispatch }}>
            <Toaster position="bottom-center" />
            <div className="flex flex-col h-screen">
              <Navbar />
              <AllRoutes />
            </div>
          </UserContext.Provider>
        </SocketContext.Provider>
      )}
    </>
  );
}

export default App;
