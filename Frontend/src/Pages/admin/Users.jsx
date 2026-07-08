import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppProvider";
import UserDetailPage from "./UserDetailPage";
import { Navigate } from "react-router-dom";

const Users = ({
  users,
  handleDeleteUser,
  handleUserStatus,
  setId,
  setActiveTab,
}) => {
  const [user, setUser] = useState([]);
  const [company, setCompany] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [istype, setIsType] = useState("candidate");
  const [updatedUsers, setUpdatedUsers] = useState({});

  const { searchRef, navigate } = useAppContext();

  useEffect(() => {
    let candidates = users.filter((role) => role.accountType !== "company");
    let recruiters = users.filter((role) => role.accountType !== "candidate");

    if (searchtext.length > 0) {
      const lowerSearch = searchtext.toLowerCase().trim();

      candidates = candidates.filter((candidate) =>
        (candidate?.firstName.trim() + " " + candidate?.lastName.trim())
          .toLowerCase()
          .includes(lowerSearch),
      );

      recruiters = recruiters.filter(
        (recruiter) =>
          (recruiter?.firstName.trim() + " " + recruiter?.lastName.trim())
            .toLowerCase()
            .includes(lowerSearch) ||
          recruiter?.company?.name.trim().toLowerCase().includes(lowerSearch),
      );
    }
    setUser(candidates);
    setCompany(recruiters);
  }, [searchtext, users]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-400 dark:bg-gray-200 dark:text-gray-400";
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updateList = (list) =>
      list.map((u) => (u._id === id ? { ...u, status: newStatus } : u));

    if (istype === "candidate") {
      setUser(updateList(user));
    } else {
      setCompany(updateList(company));
    }
  };

  const heading = ["Profile", "Name", "Email", "Role", "Status", "Action"];

  return (
    <section id="users">
      <div className="bg-white min-h-screen dark:bg-gray-800 shadow rounded-lg p-2 lg:p-6 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <select
            name=""
            id=""
            onChange={(e) => setIsType(e.target.value)}
            className="text-gray-900 dark:text-white "
          >
            <option value="candidate" className="text-gray-900 ">
              Candidate
            </option>
            <option value="company" className="text-gray-900 ">
              Recruiter
            </option>
          </select>
          <input
            type="text"
            name="search_user"
            id="search"
            ref={searchRef}
            value={searchtext}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search candidate or recruiter"
            className="border-0 border-b-2 border-gray-500 outline-0 placeholder:text-wrap w-[50%]  p-1 placeholder:text-gray-400"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y capitalize divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {heading.map((title, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-8 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.length > 0 &&
                (istype === "candidate" ? user : company).map((user, i) => (
                  <tr key={i}>
                    <td className="px-8 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user?.candidate?.profile_image || user?.company?.logo ? (
                        <img
                          src={`${istype === "candidate" ? user?.candidate?.profile_image : `${user?.company?.logo}`}`}
                          alt="logo"
                          title={user?.company?.name}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer"
                          onClick={() => [
                            setId(user._id),
                            setActiveTab("userDetail"),
                          ]}
                        />
                      ) : (
                        <p className="w-10 h-10 rounded-full object-cover text-2xl bg-blue-400 text-center">
                          {" "}
                          {user?.firstName.charAt(0)}{" "}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </td>
                    <td className=" py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user?.email.trim()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user?.accountType}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {istype === "candidate" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {user?.status}
                        </span>
                      ) : (
                        <select
                          value={user?.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;

                            handleStatusChange(user._id, newStatus);

                            setUpdatedUsers((prev) => ({
                              ...prev,
                              [user._id]: user?.status !== newStatus,
                            }));
                          }}
                          className={`capitalize px-2  rounded-2xl text-xs p-0.5 leading-10 font-semibold ${getStatusColor(user.status)}`}
                        >
                          <option
                            value="pending"
                            className={`${getStatusColor("pending")}`}
                          >
                            pending
                          </option>
                          <option
                            value="accepted"
                            className={`${getStatusColor("accepted")}`}
                          >
                            accepted
                          </option>
                          <option
                            value="rejected"
                            className={`${getStatusColor("rejected")}`}
                          >
                            rejected
                          </option>
                        </select>
                      )}
                    </td>
                    <td className="px-1 flex justify-evenly gap-4 py-4 whitespace-nowrap text-sm font-medium">
                      {istype === "company" && (
                        <button
                          disabled={!updatedUsers[user._id]}
                          title="Update Status"
                          onClick={() => {
                            handleUserStatus(user?._id, user?.status);
                            setUpdatedUsers((prev) => ({
                              ...prev,
                              [user._id]: false,
                            }));
                          }}
                          className="text-white dark:text-white w-full  bg-blue-500 p-1.5 rounded active:scale-95"
                        >
                          Update
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete"
                        className="text-white dark:text-white bg-red-500 w-full p-1.5 rounded active:scale-95"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Users;
