import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import  CustomTable  from "../ui/CustomTable";
import { useMemo, useState } from "react";
import { Modal } from "../ui/Modal2";
import { startChangeGroupStatus } from "../../actions/adminActions";
import toast from "react-hot-toast";

export const Groups = () => {
  const groups = useSelector((state) => {
    return state.admin.groups;
  });
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const approved = groups.filter((e) => e.status === "approved");
  const pending = groups.filter((e) => e.status === "pending");
  const elementsPerPage = 5;
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPagePending, setCurrentPagePending] = useState(1);

  const toalPagesApproved =Math.ceil(approved.length / elementsPerPage);
  const toalPagesPending = Math.ceil(pending.length / elementsPerPage);
  
  const columns = [
    { header: "Name", accessor: "groupName" },
    { header: "Phone Number", accessor: "groupPhoneNumber" },
    { header: "Group Admin", accessor: "groupAdmin" },
    { header: "Gaurd", accessor: "gaurd" },
    { header: "Members", accessor: "members" },
    { header: "Status", accessor: "status" },
  ];
  const groupsApproved = useMemo(
    () =>
      approved
        ?.slice(
          currentPageApproved * elementsPerPage - elementsPerPage,
          currentPageApproved * elementsPerPage
        )
        .map((e) => {
          return {
            id: e._id,
            groupName: e.groupName,
            groupPhoneNumber: e.groupPhoneNumber,
            groupAdmin: e.groupAdmin.userAuthId.userName,
            gaurd: e.gaurd ? (
              e.gaurd.userAuthId.userName
            ) : (
              <>
                {" "}
                No Gaurd
                {e.status === "approved" && (
                  <Link
                    to={`/gaurd/new`}
                    state={{ group: e._id, groupAdmin: e.groupAdmin._id }}
                  >
                    Create One!
                  </Link>
                )}{" "}
              </>
            ),
            members: e.members.length,
            status: e.status,
          };
        }),
    [approved, currentPageApproved]
  );
  const groupsPending = useMemo(
    () =>
      pending
        ?.slice(
          currentPagePending * elementsPerPage - elementsPerPage,
          currentPagePending * elementsPerPage
        )
        .map((e) => {
          return {
            id: e._id,
            groupName: e.groupName,
            groupPhoneNumber: e.groupPhoneNumber,
            groupAdmin: e.groupAdmin.userAuthId.userName,
            groupAdminId: e.groupAdmin._id,
            gaurd: e.gaurd ? (
              e.gaurd.userAuthId.userName
            ) : (
              <>
                {" "}
                No Gaurd
                {e.status === "approved" && (
                  <Link
                    to={`/gaurd/new`}
                    state={{ group: e._id, groupAdmin: e.groupAdmin._id }}
                  >
                    {" "}Create One!
                  </Link>
                )}{" "}
              </>
            ),
            members: e.members.length,
            status: e.status,
          };
        }),
    [pending, currentPagePending]
  );

  const approveGroup = (data) => {
    dispatch(
      startChangeGroupStatus(
        { group: data.id, groupAdmin: data.groupAdminId },
        toast
      )
    );
    setIsOpen(false);
  };
  return (
    <div className="flex  flex-col items-center mt-16">
      <h1>Total Groups-{groups.length}</h1>
      <h2>Approved Groups-{groupsApproved.length}</h2>
      <CustomTable
        columns={columns}
        data={groupsApproved}
        paginate={true}
        totalPages={toalPagesApproved}
        currentPage={currentPageApproved}
        setCurrentPage={setCurrentPageApproved}
      />
      {groupsPending.length != 0 ? (
        <>
          <h2>Pending Groups-{groupsPending.length}</h2>
          <CustomTable
            columns={columns}
            data={groupsPending}
            actions={{ method: approveGroup, name: "Approve Group" }}
            setOpen={setIsOpen}
            setValue={setValue}
            paginate={true}
            totalPages={toalPagesPending}
            currentPage={currentPagePending}
            setCurrentPage={setCurrentPagePending}
          />
        </>
      ) : (
        <div className="font-semibold text-xl mt-4">
          All Groups are verified👍
        </div>
      )}
      <Link to="/groups/new">Create Group</Link>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={setIsOpen}
          action={{ method: approveGroup, name: "Approve" }}
          title={
            <span className="text-lg font-semibold">{`Approve Group ${value.groupName}`}</span>
          }
          description={
            <span>{`Are you sure you want to change Group status to "Approved"?`}</span>
          }
          value={value}
        />
      )}
    </div>
  );
};
