import _ from "lodash";
import { useFormik } from "formik";
import { groupCreationSchema } from "../../validations/clientSideValidations";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { startCreateGroup } from "../../actions/adminActions";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config/axios";
import { Modal } from "../ui/Modal2";

export const NewGroup = () => {
  const { role } = jwtDecode(localStorage.getItem("token"));
  const [isOpen, setIsOpen] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => {
    return state.admin;
  });
  const { userState, userDispatch } = useContext(UserContext);

  const createGroup = async () => {
    if (role === "admin") {
      dispatch(startCreateGroup(groupData, setServerErrors, navigate));
    } else {
      try {
        const newGroup = await axiosInstance.post(
          "/groups/register",
          groupData
        );
        console.log(newGroup.data);
        userDispatch({ type: "SET_USER'S_GROUP", payload: newGroup.data });
        navigate("/dashboard");
      } catch (e) {
        setIsOpen(false)
        console.log(e.response.data.errors);
        setServerErrors(e.response.data.errors);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupPhoneNumber: "",
      blocks: [
        {
          blockName: "",
          blockUnits: [
            { unit: "", id: crypto.randomUUID() },
            { unit: "", id: crypto.randomUUID() },
            { unit: "", id: crypto.randomUUID() },
          ],
          id: crypto.randomUUID(),
        },
        {
          blockName: "",
          blockUnits: [
            { unit: "", id: crypto.randomUUID() },
            { unit: "", id: crypto.randomUUID() },
            { unit: "", id: crypto.randomUUID() },
          ],
          id: crypto.randomUUID(),
        },
      ],
      groupAdmin: role === "admin" ? "" : `${userState.user._id}`,
    },
    validateOnChange: false,
    validationSchema: groupCreationSchema,
    onSubmit: async (formData, { resetForm }) => {
      const blocksFormatted = formik.values.blocks.map((e) => {
        return {
          blockName: e.blockName,
          blockUnits: [...e.blockUnits.map((ele) => ele.unit)],
        };
      });
      setGroupData({ ...formData, blocks: blocksFormatted });
      // console.log(groupData);
      setIsOpen(true);
    },
  });

  const addBlock = () => {
    const newBlock = [
      ...formik.values.blocks,
      {
        blockName: "",
        blockUnits: [
          { unit: "", id: crypto.randomUUID() },
          { unit: "", id: crypto.randomUUID() },
          { unit: "", id: crypto.randomUUID() },
        ],
        id: crypto.randomUUID(),
      },
    ];
    formik.setFieldValue("blocks", newBlock);
  };

  const removeBlock = (blockIndex) => {
    const filter = formik.values.blocks.filter((e, i) => i !== blockIndex);
    formik.setFieldValue("blocks", filter);
  };
  
  const addUnit = (blockIndex) => {
    const updatedBlock = formik.values.blocks.map((e, i) => {
      if (i == blockIndex)
        return {
          ...e,
          blockUnits: [...e.blockUnits, { unit: "", id: crypto.randomUUID() }],
        };
      else return { ...e };
    });
    formik.setFieldValue("blocks", updatedBlock);
  };

  const removeUnit = (blockIndex, unitIndex) => {
    const filter = formik.values.blocks.map((e, i) => {
      if (i === blockIndex)
        return {
          ...e,
          blockUnits: e.blockUnits.filter((ele, elei) => elei !== unitIndex),
        };
      else return { ...e };
    });
    formik.setFieldValue("blocks", filter);
  };

  return (
    <div className="flex justify-center mt-5">
      <form
        className="flex flex-col items-center "
      >
        <div className="sm:flex sm:flex-col">
          <input
            type="text"
            name="groupName"
            onChange={formik.handleChange}
            placeholder="Group Name"
            className={`m-1 p-1 ${
              formik.errors.groupName
                ? "outline-red-500 border-red-500 "
                : " outline-indigo-400"
            } border-[1.5px] rounded-md text-center outline-indigo-400 `}
          />
          <div className="flex justify-center h-5 text-sm text-red-500 font-semibold">
            {formik.errors.groupName}
            {serverErrors
              .filter((e) => e.path === "groupName")
              .map((e) => e.msg)}
          </div>
          <input
            type="number"
            name="groupPhoneNumber"
            onChange={formik.handleChange}
            placeholder="Phone Number"
            className={`m-1 p-1 ${
              formik.errors.groupPhoneNumber
                ? "outline-red-500 border-red-500  "
                : " outline-indigo-400"
            } border-[1.5px] rounded-md text-center outline-indigo-400 `}
          />
          <div className="flex justify-center h-5 text-sm text-red-500 font-semibold">
            {formik.errors.groupPhoneNumber}
          </div>
        </div>
        <div className="flex flex-wrap justify-around pl-[30px] pr-[30px] ">
          {formik.values.blocks.map((e, bi) => (
            <div
              key={e.id}
              className={`flex flex-col mx-3 my-[4px] p-[15px] rounded-2xl h-fit shadow-2xl  bg-white  `}
            >
              <input
                type="text"
                name={`blocks[${bi}].blockName`}
                onChange={formik.handleChange}
                placeholder="Block Name"
                className={`p-1 text-center h-[30px] ${
                  bi >= 2 && ""
                } bg-gray-50/20 outline-none`}
              />
              <div className="flex justify-center h-5 text-sm text-red-500 font-semibold">
                {formik.errors?.blocks
                  ?.filter((e, i) => i == bi)
                  .map((e) => e.blockName)}
              </div>
              {e.blockUnits.map((ele, ui) => (
                <div key={ele.id} className="w-[215px] flex ">
                  <div>
                    {" "}
                    <input
                      type="Number"
                      name={`blocks[${bi}].blockUnits[${ui}].unit`}
                      onChange={formik.handleChange}
                      placeholder="Unit Number"
                      className={`p-1 mb-1 ${
                        ui <= 2 && "w-full "
                      }  placeholder-opacity-40 bg-gray-50/20 outline-none `}
                    />
                    <div className="flex justify-center h-5 text-sm text-red-500 font-semibold">
                      {formik.errors?.blocks
                        ?.filter((e, i) => i === bi)
                        ?.map((e) =>
                          e.blockUnits
                            .filter((e, i) => i === ui)
                            ?.map((e) => e.unit)
                        )}
                      {serverErrors
                        .filter((e) => e.path === `blocks[${bi}].blockUnits`)
                        .map((e) => e.msg)}
                    </div>
                  </div>
                  {ui >= 3 && (
                    <input
                      type="button"
                      onClick={() => removeUnit(bi, ui)}
                      value={"x"}
                      className=" rounded-sm h-8 w-[17px] ml-[6px] border-purple-800 border-[1.5px] bg-indigo-500 text-white font-semibold  outline-none hover:text-black hover:bg-indigo-600 cursor-pointer "
                    />
                  )}
                </div>
              ))}
              <input
                type="button"
                onClick={() => addUnit(bi)}
                value={"+ Unit"}
                className="rounded-md bg-indigo-500 font-semibold p-1 mt-[5px] cursor-pointer border-[1.5px] border-purple-800 hover:text-white"
              />
              {bi >= 2 && (
                <input
                  type="button"
                  value={"X"}
                  onClick={() => removeBlock(bi)}
                  className="absolute border-[1.5px]  border-purple-800 p-1  bg-indigo-500 text-white font-semibold  hover:text-black cursor-pointer rounded-sm"
                />
              )}
            </div>
          ))}
        </div>
        <input
          type="button"
          onClick={addBlock}
          value={"Add Block"}
          className=" mt-3 cursor-pointer rounded-md pt-[2px] pb-[2px] pl-[6px] pr-[6px] bg-indigo-500 hover:text-white font-semibold border-purple-800 border-2"
        />
        {role === "admin" && (
          <>
            <select
              onChange={formik.handleChange}
              name="groupAdmin"
              className={`${
                formik.errors.groupAdmin
                  ? " border-red-500 outline-red-500"
                  : "border-opacity-40"
              } border-2 mt-3 p-[2px] rounded-md cursor-pointer outline-indigo-400`}
            >
              <option value={""}>Select Admin</option>
              {users.groupAdmins
                ?.filter((e) => !e.group)
                .map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.userAuthId.userName}
                  </option>
                ))}
            </select>
            <div className="flex justify-center h-5 text-sm text-red-500 font-semibold">
              {formik.errors.groupAdmin}
            </div>
          </>
        )}
        <input
          type="button"
          value={"Create Group"}
          onClick={() => formik.handleSubmit()}
          className="cursor-pointer mb-4 rounded-md p-1 pl-[6px] pr-[6px] bg-white text-indigo-500 font-semibold mt-3 border-2 border-transparent hover:bg-indigo-500 hover:text-white hover:border-purple-800 "
        />
      </form>
      {isOpen && (
        <Modal open={isOpen} setOpen={setIsOpen} action={{method:createGroup,name:'Create'}} title={'Group'} description={
          <span>
            Are you sure you want to create Group{" "}
            <span className="font-bold text-black">
              {formik.values.groupName}
            </span>{" "}
            ?
          </span>
        } value={groupData}/>
        
      )}
    </div>
  );
};
