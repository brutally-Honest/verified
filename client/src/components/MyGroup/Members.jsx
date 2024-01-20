import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { axiosInstance } from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import { Modal } from "../ui/Modal2";
import toast from "react-hot-toast";
import  CustomTable  from "../ui/CustomTable";

export const Members = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [valueAccept, setValueAccept] = useState("");
  const [valueApprove, setValueApprove] = useState("");
  const { role } = jwtDecode(localStorage.getItem("token"));
  const { userState, userDispatch } = useContext(UserContext);
  
  const approved = userState.group?.members?.filter(
    (ele) => ele.memberId.status === "approved")
  
  const unitPending = userState.group?.members?.filter(
    (ele) => ele.memberId.status === "Unit Pending")
  
  const pending = userState.group?.members?.filter(
    (ele) => ele.memberId.status === "pending")
  
  const elementsPerPage = 5;
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageUnitPending, setCurrentPageUnitPending] = useState(1);
  const [currentPagePending, setCurrentPagePending] = useState(1);

  const totalPagesApproved = Math.ceil(approved?.length / elementsPerPage);
  const totalPagesUnitPending = Math.ceil(unitPending?.length / elementsPerPage) + 1;
  const totalPagesPending = Math.ceil(pending?.length / elementsPerPage) + 1;

  const membersApproved = useMemo(
    () =>
      approved
        ?.slice(
          currentPageApproved * elementsPerPage - elementsPerPage,
          currentPageApproved * elementsPerPage
        )
        .map((e) => {
          return {
            id: e.memberId._id,
            userName: e.memberId.userAuthId.userName,
            userPhoneNumber: e.memberId.userAuthId.userPhoneNumber,
            email: e.memberId.userAuthId.email,
            unit: `${e.memberId.property.block.blockName}-${e.memberId.property.unitNumber}`,
            status: e.memberId.status,
          };
        }),
    [approved, currentPageApproved]
  );

  const columnsPending = [
    { header: "Name", accessor: "userName" },
    { header: "Phone Number", accessor: "userPhoneNumber" },
    { header: "Email", accessor: "email" },
    { header: "Status", accessor: "status" },
  ];
  const membersPending = useMemo(
    () =>
      pending
        ?.slice(
          currentPagePending * elementsPerPage - elementsPerPage,
          currentPagePending * elementsPerPage
        )
        .map((e) => {
          return {
            id: e.memberId._id,
            userName: e.memberId.userAuthId.userName,
            userPhoneNumber: e.memberId.userAuthId.userPhoneNumber,
            email: e.memberId.userAuthId.email,
            status: e.memberId.status,
          };
        }),
    [pending, currentPagePending]
  );

  const columnsUnitPending = [
    { header: "Name", accessor: "userName" },
    { header: "Phone Number", accessor: "userPhoneNumber" },
    { header: "Email", accessor: "email" },
    { header: "Unit", accessor: "unit" },
    { header: "Status", accessor: "status" },
  ];
  const membersUnitPending = useMemo(
    () =>
      unitPending
        ?.slice(
          currentPageUnitPending * elementsPerPage - elementsPerPage,
          currentPageUnitPending * elementsPerPage
        )
        .map((e) => {
          return {
            id: e.memberId._id,
            userName: e.memberId.userAuthId.userName,
            userPhoneNumber: e.memberId.userAuthId.userPhoneNumber,
            email: e.memberId.userAuthId.email,
            unit: e.memberId.property?.block.blockName
              ? `${e.memberId.property?.block.blockName}-${e.memberId.property?.unitNumber}`
              : "Unit Not Set",
            status: e.memberId.status,
          };
        }),
    [unitPending, currentPageUnitPending]
  );

  const acceptMember = async (data) => {
    const formData = {
      group: userState.group._id,
      groupAdmin: userState.group.groupAdmin._id,
      id: data.id,
    };
    try {
      const { data } = await axiosInstance.put(
        `/groups/accept-member`,
        formData
      );
      toast.success("Member Accepted to Group");
      userDispatch({ type: "ACCEPT_MEMBER", payload: data });
    } catch (e) {
      console.log(e);
    }
    setIsOpen(false);
  }

  const approveMember = async (memberData) => {
    const member = userState.group.members?.find(
      (e) => e.memberId._id === memberData.id
    );
    const formData = {
      block: {
        blockName: member.memberId?.property?.block?.blockName,
        unitNumber: member.memberId?.property?.unitNumber,
      },
      group: userState.group._id,
      groupAdmin: userState.user._id,
    };
    // console.log(formData);
    try {
      const { data } = await axiosInstance.put(
        `/groups/member/${memberData.id}`,
        formData
      );
      userDispatch({ type: "APPROVE_MEMBER", payload: data });
      toast.success(`Member approved`);
    } catch (e) {
      console.log(e.response);
      toast.error("Unit not Set");
    }
    setIsOpen2(false);
  };

  return (
    <div className="flex justify-center">
      <div className="m-3 w-[80dvw]">

        {/* Approved Members */}
        {membersApproved?.length > 0 ? (
          <>
            {role === "groupAdmin" && (
              <div className="flex justify-center">
                <div className="mt-2 bg-blue-700 w-[200px] text-center rounded-[4px] text-sky-400 font-semibold">
                  Approved Members
                </div>
              </div>
            )}
            <div className="flex flex-col items-center">
            <CustomTable
              columns={columnsUnitPending}
              data={membersApproved}
              paginate={true}
              totalPages={totalPagesApproved}
              currentPage={currentPageApproved}
              setCurrentPage={setCurrentPageApproved}
            />
            </div>
          </>
        ) : (
          <div className="flex justify-center text-xl font-thin">No Members Yet</div>
        )}

        {role === "groupAdmin" && (
          <>
            {/* Members to be Accepted */}
            {membersPending?.length > 0 && (
              <>
               <div className="flex justify-center">
                 <div className="mt-2 bg-blue-700 w-[200px] text-center rounded-[4px] text-sky-400 font-semibold">
                  Members to be Accepted
                </div>
               </div>
                <div className="flex flex-col items-center">
                <CustomTable
                  columns={columnsPending}
                  data={membersPending}
                  actions={{ method: acceptMember, name: "Accept" }}
                  setOpen={setIsOpen}
                  setValue={setValueAccept}
                  currentPage={currentPagePending}
                  setCurrentPage={setCurrentPagePending}
                  totalPages={totalPagesPending}
                  paginate={true}
                />
                </div>
              </>
            )}

            {/* Members who are accepted with Unit approval pending */}
            {membersUnitPending?.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="mt-2 bg-blue-700 w-[300px] text-center rounded-[4px] text-sky-400 font-semibold">
                  Accepted Members with Unit Pending
                </div>
                </div>
                <div className="flex flex-col items-center">
                <CustomTable
                  columns={columnsUnitPending}
                  data={membersUnitPending}
                  actions={{ method: approveMember, name: "Approve" }}
                  setOpen={setIsOpen2}
                  setValue={setValueApprove}
                  totalPages={totalPagesUnitPending}
                  currentPage={currentPageUnitPending}
                  setCurrentPage={setCurrentPageUnitPending}
                  paginate={true}
                />
                </div>
              </>
            )}
          </>
        )}
      </div>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={setIsOpen}
          action={{ method: acceptMember, name: "Accept" }}
          title={<span>{`Accept Member`}</span>}
          description={
            <span>
              Are you sure you want to accept{" "}
              <span className="font-bold text-black">
                {valueAccept.userName}
              </span>{" "}
              to the group ?{" "}
            </span>
          }
          value={valueAccept}
        />
      )}
      {isOpen2 && (
        <Modal
          open={isOpen2}
          setOpen={setIsOpen2}
          action={{ method: approveMember, name: "Approve" }}
          title={<span>{`Approve Member`}</span>}
          description={
            <span>
              Are you sure you want to approve{" "}
              <span className="font-bold text-bl">{valueApprove.userName}</span>{" "}
              ?{" "}
            </span>
          }
          value={valueApprove}
        />
      )}
    </div>
  );
};
