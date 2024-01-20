import _ from "lodash";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import { AdminLinks } from "../admin/AdminLinks";
import { GroupAdminLinks } from "../groupAdmin/GroupAdminLinks";
import { GaurdLinks } from "../gaurd/GaurdLinks";


export const Dashboard = () => {
  const { userState } = useContext(UserContext);
  const { role } = jwtDecode(localStorage.getItem("token"));
  return (
    <div className="flex justify-center ">
      {_.isEmpty(userState.user) ? (
        <div>Loading...</div>
      ) : (
        <div className="px-10 pt-5 ">
          <h3 className=" py-2 text-2xl font-semibold  text-center">
            Welcome{" "}
            {role === "admin" ? (
              <span className="bg-indigo-400 text-white p-1 rounded-md">
                {userState.user.userName}
              </span>
            ) : (
              <span className="bg-indigo-400 text-white p-1 rounded-md">
                {userState.user.userAuthId?.userName}
              </span>
            )}
            👋
          </h3>
          <div className="flex flex-col text-xl font-medium items-center ">
            {role === "admin" && <AdminLinks />}
            {role === "groupAdmin" && <GroupAdminLinks />}
            {role === "member" && <GroupAdminLinks />}
            {role === "gaurd" && <GaurdLinks />}
          </div>
        </div>
      )}
    </div>
  );
};
