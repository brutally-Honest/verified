import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import { GroupDetailsIcon, GroupMembersIcon, GroupNoticeIcon } from "../../assets/Svg";

export const MyGroup = () => {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  const { role } = jwtDecode(localStorage.getItem("token"));

  return (
    <>
      <div className="md:mt-12 sm:mt-3 flex justify-evenly sm:flex-wrap ">
        <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white">
          <button
            onClick={() => navigate("/myGroup/details")}
            className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
          >
            Details
            <div>
              <GroupDetailsIcon/>
            </div>
          </button>
        </div>
        {((userState.group.status === "approved" && role === "groupAdmin") ||
          userState.user.status === "approved") && (
          <>
            <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white ">
              <button
                onClick={() => navigate("/myGroup/members")}
                className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
              >
                Members
                <div>
                  <GroupMembersIcon/>
                </div>
              </button>
            </div>
            <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white">
              <button
                onClick={() => navigate("/myGroup/notice-board")}
                className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
              >
                Notice Board
                <div>
                  <GroupNoticeIcon/>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
      <Outlet />
    </>
  );
};
