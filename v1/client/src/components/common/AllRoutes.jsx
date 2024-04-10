import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { Register } from "./Register";
import { Dashboard } from "./Dashboard";
import { ProtectedRoutes } from "../../utils/ProtectedRoutes";
import { Groups } from "../admin/Groups";
import { Users } from "../admin/Users";
import { NewGroup } from "../groupAdmin/NewGroup";
import { AddUnit } from "../groupAdmin/AddUnit";
import { Profile } from "./Profile";
import { MyGroup } from "../MyGroup/MyGroup";
import { NewVisitor } from "../gaurd/NewVisitor";
import { MyVistors } from "../MyVisitors/MyVisitors";
import { CurrentVisitors } from "../MyVisitors/CurrentVisitors";
import { PastVisitors } from "../MyVisitors/PastVisitors";
import { Members } from "../MyGroup/Members";
import { CreateGaurd } from "../groupAdmin/CreateGaurd";
import { GroupDetails } from "../MyGroup/GroupDetails";
import { ExpectedVisitors } from "../MyVisitors/ExpectedVisitors";
import { VideoCall } from "../VideoCall/VideoCall";
import { ExpectedVisitorsGaurd } from "../gaurd/ExpectedVisitorsGaurd";
import { Verification } from "../gaurd/Verification";
import { NoticeBoard } from "../MyGroup/NoticeBoard";
import { TodaysVisitors } from "../gaurd/TodaysVisitors";
import { Payments } from "../groupAdmin/Payments";
import { Revenue } from "../admin/Revenue";
import { RecentGroup } from "../recents/recentGroup";
import { RecentMember } from "../recents/recentMember";
import { RecentPayment } from "../recents/recentPayment";
import { RecentVisitor } from "../recents/recentVisitor";
import { Home } from "./Home";

export const AllRoutes = () => {
  return (
    <>
      <Routes >
        <Route path="/" exact element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recentGroup" element={<RecentGroup />} />
          <Route path="/recentMember" element={<RecentMember />} />
          <Route path="/recentPayment" element={<RecentPayment />} />
          <Route path="/recentVisitor" element={<RecentVisitor />} />
          <Route path="/groups/all" element={<Groups />} />
          <Route path="/users/all" element={<Users />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/groups/new" element={<NewGroup />} />
          <Route path="/gaurd/new" element={<CreateGaurd />} />
          <Route path="/addUnit" element={<AddUnit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/videoCall" element={<VideoCall />} />

          <Route path="/myGroup" element={<MyGroup />}>
            <Route path="/myGroup/members" element={<Members />} />
            <Route path="/myGroup/details" element={<GroupDetails />} />
            <Route path="/myGroup/gaurd/new" element={<CreateGaurd />} />
            <Route path="/myGroup/notice-board" element={<NoticeBoard />} />
          </Route>
          
          <Route path="/myVisitors" element={<MyVistors />}>
            <Route path="/myVisitors/current" element={<CurrentVisitors />} />
            <Route path="/myVisitors/past" element={<PastVisitors />} />
            <Route path="/myVisitors/expected" element={<ExpectedVisitors />} />
          </Route>

          <Route path="/payments" element={<Payments />} />

          <Route path="/visitors/new" element={<NewVisitor />} />
          <Route path="/visitors/today" element={<TodaysVisitors />} />
          <Route path="/visitors/expected" element={<ExpectedVisitorsGaurd />} />
          <Route path="/visitors/expected/verification/:id" element={<Verification />} />
          <Route path="/myGroup/gaurd/new" element={<CreateGaurd />} />
        </Route>
      </Routes>
    </>
  );
};
