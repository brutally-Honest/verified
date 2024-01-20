import _ from "lodash";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MyGroupIcon, MyVisitorsIcon, PaymentsIcon } from "../../assets/Svg";
import { RecentMember } from "../recents/recentMember";
import { RecentVisitor } from "../recents/recentVisitor";

export const GroupAdminLinks = () => {
  const { userState } = useContext(UserContext);
  const { role } = jwtDecode(localStorage.getItem("token"));
  return (
    <>
      {role === "groupAdmin" &&
        (userState.group ? (
          <>
            {userState.group.status === "approved" &&
              (userState.user.property ? (
                <Link to="/myVisitors">
                  <div className="flex justify-center items-center">
                    <MyVisitorsIcon/>
                    My Vistors
                  </div>
                </Link>
              ) : (
                <Link to="/addUnit">Set my Unit</Link>
              ))}
            <Link to="/myGroup">
              <div className="flex items-center justify-center">
                <MyGroupIcon/>
                My Group
              </div>
            </Link>
            <Link to="/payments">
              <div className="flex items-center justify-center">
                <PaymentsIcon/>
                Payments
              </div>
            </Link>
            {/* <div className="flex justify-evenly mt-3 w-[50dvw]">
            <RecentMember/>
             <RecentVisitor/> 
            </div> */}
            {userState.group.status === "pending" && (
              <div>Group Approval Pending...</div>
            )}
          </>
        ) : (
          <Link to="/groups/new">Create Group</Link>
        ))}
      {role === "member" && (
        <>
          <Link to="/myGroup">
            <div className="flex items-center justify-center">
              <MyGroupIcon/>
              My Group
            </div>
          </Link>
          {userState.user.status === "approved" ? (
            <>
              <Link to="/myVisitors">My Vistors</Link>
            </>
          ) : (
            <>
              <div>Member Approval Pending...</div>
            </>
          )}
        </>
      )}
    </>
  );
};
