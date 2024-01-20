import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import _ from "lodash";
import { axiosInstance } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

export const AddUnit = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const [blockWithUnit, setBlockWithUnit] = useState({});
  const navigate = useNavigate();
  const { role } = jwtDecode(localStorage.getItem("token"));

  const setAdminUnit = async () => {
    const t1 = toast.loading("Updating Unit...", { position: "bottom-center" });
    const formData = {
      group: userState.group._id,
      groupAdmin: userState.group.groupAdmin._id,
      block: blockWithUnit,
    };
    try {
      if (role === "groupAdmin") {
        const { data } = await axiosInstance.post(
          "users/groupAdmin/unit",
          formData
        );
        console.log(data);
        toast.dismiss(t1);
        toast.success("Successfully set unit ", { duration: 3000 });
        userDispatch({ type: "SET_GROUP_ADMIN'S_UNIT", payload: data });
        navigate("/dashboard");
      } else {
        const { data } = await axiosInstance.post(
          `users/member/unit/${userState.user._id}`,
          formData
        );
        console.log(data);
        toast.dismiss(t1);
        toast.success("Successfully set unit\n Approval Pending... ", {
          duration: 3000,
          position: "bottom-center",
        });
        userDispatch({ type: "SET_MEMBER'S_UNIT", payload: data });
        navigate("/dashboard");
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };
  
  return (
    <>
      {_.isEmpty(userState.group) ? (
        <div></div>
      ) : (
        <div className="mt-5 flex flex-col justify-center">
          <Toaster />
          <h1 className="flex justify-center">Set Unit</h1>
          <div className="flex  justify-center flex-wrap">
            {userState.group.blocks.map((e) => (
              <div
                key={e.blockId._id}
                className="flex flex-col p-2 mx-[5px] my-2 rounded-sm shadow-md flex-wrap bg-gradient-to-t from-violet-500/60 to-violet-200 sm:flex-col"
              >
                <div className="flex justify-center">{e.blockId.blockName}</div>
                <div className="flex justify-center">
                  {e.blockId.units.map((ele) => (
                    <button
                      key={ele.unitId._id}
                      value={JSON.stringify({
                        blockName: e.blockId.blockName,
                        unitNumber: ele.unitId.unitNumber,
                      })}
                      onClick={(e) =>
                        setBlockWithUnit(JSON.parse(e.target.value))
                      }
                      className="p-2 border-blue-600/40 border-[1.5px] m-2 rounded-sm shadow-md z-[100] font-semibold hover:bg-blue-600 focus:bg-blue-600"
                    >
                      {ele.unitId.unitNumber}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className=" flex justify-center">
            <button
              onClick={setAdminUnit}
              className=" w-[100px] mt-3 p-[4px] rounded-md shadow-md text-indigo-500 font-semibold hover:text-white hover:bg-indigo-500"
            >
              Set{" "}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
