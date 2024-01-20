import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config/axios";
import { Modal } from "../ui/Modal2";
import { BarLoader } from "react-spinners";
import CustomTable from "../ui/CustomTable";
import noImage from "../../assets/noImage.jpg";

export const PastVisitors = () => {
  const { userState } = useContext(UserContext);
  const [myVisitors, setMyVisitors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const elementsPerPage = 5;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const unit = userState.user.property?._id;
      if (unit) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(
            `/visitors/myVisitors/${unit}?limit=${elementsPerPage}&skip=${
              (currentPage - 1) * elementsPerPage
            }`
          );
          setMyVisitors(data.myVisitors);
          setTotalPages(Math.ceil(data.total / elementsPerPage));
          setLoading(false);
        } catch (e) {
          console.log(e.response);
        }
      }
    })();
  }, [currentPage]);

  const columns = [
    { header: "Name", accessor: "visitorName" },
    { header: "PhoneNumber", accessor: "visitorPhoneNumber" },
    { header: "Type", accessor: "type" },
    { header: "Date", accessor: "date" },
    { header: "Time", accessor: "time" },
    { header: "Permission", accessor: "permission" },
    { header: "Permission By", accessor: "approvedBy" },
  ];

  const myPastVisitors = useMemo(
    () =>
      myVisitors.map((e) => {
        return {
          id: e._id,
          visitorName: e.visitorName,
          visitorPhoneNumber: e.visitorPhoneNumber,
          type: userState?.visitorTypes?.find(
            (ele) => ele._id === e.visitorType
          )?.type,
          date: new Date(e.createdAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          visitorPhoto: e.visitorPhoto,
          time: new Date(e.createdAt).toLocaleTimeString(),
          permission:
            "permission" in e
              ? e.permission
                ? "Approved"
                : "Rejected"
              : "No Response",
          approvedBy: e.approvedBy
            ? userState.group?.members?.find(
                (ele) => ele.memberId._id === e.approvedBy
              )?.memberId?.userAuthId?.userName ||
              userState?.group?.groupAdmin.userAuthId.userName
            : "-",
        };
      }),
    [myVisitors]
  );

  return (
    <div className="flex flex-col mt-10 items-center">
      {loading ? (
        <>
          <BarLoader speedMultiplier={1.5} width={200} />
        </>
      ) : (
        <>
          {myPastVisitors.length > 0 ? (
            <CustomTable
              columns={columns}
              data={myPastVisitors}
              width={500}
              actions={{ name: "View" }}
              setOpen={setIsOpen}
              setValue={setValue}
              paginate={true}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <div className="flex justify-center font-thin text-xl">
              No Visitors Yet
            </div>
          )}
          {isOpen && (
            <Modal
              open={isOpen}
              setOpen={setIsOpen}
              title={
                <span className="text-lg font-semibold">{`${value.visitorName}`}</span>
              }
              description={
                <div className="flex justify-center">
                  <img src={value.visitorPhoto || noImage} />
                </div>
              }
              value={value}
              simple={true}
            />
          )}
        </>
      )}
    </div>
  );
};
