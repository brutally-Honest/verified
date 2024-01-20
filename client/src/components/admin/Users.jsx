import { useSelector } from "react-redux";
import  CustomTable  from "../ui/CustomTable";
import { useMemo, useState } from "react";
export const Users = () => {
  const { users: allUsers } = useSelector((state) => {
    return state.admin;
  });
  const { groupAdmins, members, gaurds } = allUsers;
  const approved = members?.filter((ele) => ele.status === "approved");
  const unitPending = members?.filter((ele) => ele.status === "Unit Pending");
  const pending = members?.filter((ele) => ele.status === "pending");
  const elementsPerPage = 5;
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageUnitPending, setCurrentPageUnitPending] = useState(1);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageGroupAdmin, setCurrentPageGroupAdmin] = useState(1);
  const [currentPageGaurd, setCurrentPageGaurd] = useState(1);

  const totalPagesGroupAdmin = Math.ceil(groupAdmins?.length / elementsPerPage);
  const totalPagesGaurd = Math.ceil(gaurds?.length / elementsPerPage);
  const totalPagesApproved =Math.ceil(approved?.length / elementsPerPage);
  const totalPagesUnitPending =Math.ceil(unitPending?.length / elementsPerPage) ;
  const totalPagesPending = Math.ceil(pending?.length / elementsPerPage) ;

  const columns = [
    { header: "Name", accessor: "userName" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "userPhoneNumber" },
    { header: "Group", accessor: "groupName" },
  ];
  const groupAdminsData = useMemo(
    () =>
      groupAdmins
        ?.slice(
          currentPageGroupAdmin * elementsPerPage - elementsPerPage,
          currentPageGroupAdmin * elementsPerPage
        )
        ?.map((e) => {
          return {
            id: e._id,
            userName: e.userAuthId ? e.userAuthId.userName : e.userName,
            email: e.userAuthId ? e.userAuthId.email : e.email,
            userPhoneNumber: e.userAuthId
              ? e.userAuthId.userPhoneNumber
              : e.userPhoneNumber,
            groupName: e.group ? e.group.groupName : "Not Created Yet",
          };
        }),
    [groupAdmins, currentPageGroupAdmin]
  );
  const gaurdsData = useMemo(
    () =>
      gaurds
        ?.slice(
          currentPageGaurd * elementsPerPage - elementsPerPage,
          currentPageGaurd * elementsPerPage
        )
        ?.map((e) => {
          return {
            id: e._id,
            userName: e.userAuthId ? e.userAuthId.userName : e.userName,
            email: e.userAuthId ? e.userAuthId.email : e.email,
            userPhoneNumber: e.userAuthId
              ? e.userAuthId.userPhoneNumber
              : e.userPhoneNumber,
            groupName: e.group?.groupName,
          };
        }),
    [gaurds, currentPageGaurd]
  );
  const membersApprovedData = useMemo(
    () =>
      approved
        ?.slice(
          currentPageApproved * elementsPerPage - elementsPerPage,
          currentPageApproved * elementsPerPage
        )
        ?.map((e) => {
          return {
            id: e._id,
            userName: e.userAuthId ? e.userAuthId.userName : e.userName,
            email: e.userAuthId ? e.userAuthId.email : e.email,
            userPhoneNumber: e.userAuthId
              ? e.userAuthId.userPhoneNumber
              : e.userPhoneNumber,
            groupName: e.group?.groupName,
          };
        }),
    [members, currentPageApproved]
  );
  const membersPendingData = useMemo(
    () =>
      pending
        ?.slice(
          currentPagePending * elementsPerPage - elementsPerPage,
          currentPagePending * elementsPerPage
        )
        ?.map((e) => {
          return {
            id: e._id,
            userName: e.userAuthId ? e.userAuthId.userName : e.userName,
            email: e.userAuthId ? e.userAuthId.email : e.email,
            userPhoneNumber: e.userAuthId
              ? e.userAuthId.userPhoneNumber
              : e.userPhoneNumber,
            groupName: e.group?.groupName,
          };
        }),
    [members, currentPagePending]
  );
  const membersUnitPendingData = useMemo(
    () =>
      unitPending
        ?.slice(
          currentPageUnitPending * elementsPerPage - elementsPerPage,
          currentPageUnitPending * elementsPerPage
        )
        ?.map((e) => {
          return {
            id: e._id,
            userName: e.userAuthId ? e.userAuthId.userName : e.userName,
            email: e.userAuthId ? e.userAuthId.email : e.email,
            userPhoneNumber: e.userAuthId
              ? e.userAuthId.userPhoneNumber
              : e.userPhoneNumber,
            groupName: e.group?.groupName,
          };
        }),
    [members, currentPageUnitPending]
  );
  return (
    <div>
      <div>
        <div className="">
          <div className="md:flex justify-evenly sm:block">
            {groupAdmins?.length > 0 && (
              <div className="m-2">
                <h3 className="text-lg font-light">Group Admins-<span className="font-semibold">{groupAdmins.length}</span></h3>
                <CustomTable
                  columns={columns}
                  data={groupAdminsData}
                  width="400px"
                  paginate={true}
                  currentPage={currentPageGroupAdmin}
                  totalPages={totalPagesGroupAdmin}
                  setCurrentPage={setCurrentPageGroupAdmin}
                />
              </div>
            )}
            <div className="flex justify-evenly">
              {gaurds?.length > 0 && (
                <div className="m-2">
                  <h3 className="text-lg font-light">Gaurds-<span className="font-semibold">{gaurds.length}</span></h3>
                  <CustomTable
                    columns={columns}
                    data={gaurdsData}
                    width="400px"
                    paginate={true}
                    currentPage={currentPageGaurd}
                    totalPages={totalPagesGaurd}
                    setCurrentPage={setCurrentPageGaurd}
                  />
                </div>
              )}
            </div>
          </div>
          {members?.length > 0 && (
            <>
              <div className="flex justify-evenly ">
                {pending.length > 0 && (
                  <div className="m-2 ">
                    <h3 className="text-lg font-light">
                      Members Pending-
                      <span className="font-semibold">{pending.length}</span>
                    </h3>
                    <CustomTable
                      columns={columns}
                      data={membersPendingData}
                      width="400px"
                      paginate={true}
                      currentPage={currentPagePending}
                      setCurrentPage={setCurrentPagePending}
                      totalPages={totalPagesPending}
                      
                    />
                  </div>
                )}
                {unitPending.length > 0 && (
                  <div className="m-2 ">
                    <h3 className="text-lg font-light">
                      Members Unit Pending-
                      <span className="font-semibold">{unitPending.length}</span>
                    </h3>
                    <CustomTable
                      columns={columns}
                      data={membersUnitPendingData}
                      width="400px"
                      paginate={true}
                      currentPage={currentPageUnitPending}
                      setCurrentPage={setCurrentPageUnitPending}
                      totalPages={totalPagesUnitPending}
                      
                    />
                  </div>
                )}
              </div>
              <div className="m-2 flex flex-col items-center ">
                <h3 className="text-lg font-light">
                  Members Approved-
                  <span className="font-semibold">{approved.length}</span>
                </h3>
                <CustomTable
                  columns={columns}
                  data={membersApprovedData}
                  width="400px"
                  paginate={true}
                  currentPage={currentPageApproved}
                  setCurrentPage={setCurrentPageApproved}
                  totalPages={totalPagesApproved}
                  
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
