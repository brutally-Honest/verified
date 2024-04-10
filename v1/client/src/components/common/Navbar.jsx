import _ from "lodash";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { socket } from "../../context/SocketContext";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ProfileIcon } from "../../assets/Svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const { userState, userDispatch } = useContext(UserContext);

  const handleLogout = () => {
    userDispatch({ type: "REMOVE_USER" });
    localStorage.removeItem("token");
    socket.disconnect();
  };
  return (
    <>
      {
        <nav className={`w-full`}>
          <div
            className={`flex ${
              userState.isLoggedIn
                ? "lg:justify-evenly md:justify-between sm:justify-between"
                : "sm:justify-center bg-gradient-to-r from-cyan-500 to-blue-500"
            }   flex-wrap items-center  mx-auto p-2 `}
          >
            {userState.isLoggedIn ? (
              <Link to="/dashboard" className="flex items-center  ">
                <span className=" text-sm font-bold me-2 px-2.5 py-0.5  ">
                  VERIFIED
                </span>
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="flex items-center  ">
                  <span className=" text-sm font-bold me-2 px-2.5 py-0.5  ">
                    HOME
                  </span>
                </Link>
                <Link to="/login" className="flex items-center  ">
                  <span className=" text-sm font-bold me-2 px-2.5 py-0.5  ">
                    LOGIN
                  </span>
                </Link>
                <Link to="/register" className="flex items-center  ">
                  <span className=" text-sm font-bold me-2 px-2.5 py-0.5  ">
                    REGISTER
                  </span>
                </Link>
              </>
            )}
            <div className="flex items-center ">
              {userState.isLoggedIn && (
                <>
                  <Menu as="div" className="relative inline-block text-left">
                    <div className=" ">
                      <Menu.Button className=" w-full flex pl-3 pr-1  text-sm font-semibold   ">
                        <ProfileIcon />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={"/profile"}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={"/login"}
                                onClick={handleLogout}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Logout
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </nav>
      }
    </>
  );
};
