import _ from "lodash";
import { useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config/axios";
import  CustomTable  from "../ui/CustomTable";

export const ExpectedVisitorsGaurd = () => {
  const { userState } = useContext(UserContext);
  const { gaurdDispatch, gaurdState } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.post(`/visitors/expected/`, {
          group: userState.user.group,
        });
        gaurdDispatch({ type: "SET_VISITORS", payload: data });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const columns = [
    { header: "Name", accessor: "visitorName" },
    { header: "Phone", accessor: "visitorPhoneNumber" },
    { header: "Unit", accessor: "unitNumber" },
    { header: "Approved By", accessor: "approvedBy" },
    // { header: "Actions", accessor: "visitorType" },
  ];

  const visitorsExpected = useMemo(
    () =>
      gaurdState.visitors.map((e) => {
        return {
          id: e._id,
          visitorName: e.visitorName,
          visitorPhoneNumber: e.visitorPhoneNumber,
          unitNumber: `${
            userState.group.blocks.find((ele) => ele.blockId._id === e.block)
              .blockId.blockName
          }-${
            userState.group.blocks
              .find((ele) => ele.blockId._id === e.block)
              .blockId.units.find((element) => element.unitId._id === e.unit)
              .unitId.unitNumber
          }`,
          approvedBy:
            userState.group.members.find(
              (ele) => ele.memberId._id === e.approvedBy
            )?.memberId.userAuthId.userName ||
            userState.group.groupAdmin.userAuthId.userName,
        };
      }),
    [gaurdState.visitors]
  );

  return (
    <div className="flex flex-col  mb-1 items-center p-2">
      <div className="text-xl">Expected Visitors</div>
      {_.isEmpty(gaurdState.visitors) ? (
        <>
          <h2 className="font-2xl font-semibold">No Visitors Yet</h2>
        </>
      ) : (
        <div>
          <div className="flex justify-center">
            <h2 className="font-semibold text-xl">Visitors Expected</h2>
          </div>
          <div>
          <CustomTable
            columns={columns}
            data={visitorsExpected}
            width={"600px"}
            actions={{ name: "Verify" }}
          />
          </div>
        </div>
      )}
    </div>
  );
};
