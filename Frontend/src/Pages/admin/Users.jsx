import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAppContext } from "../../context/AppProvider";

const Users = ({ users, handleDeleteUser, handleUserStatus }) => {
  const [user, setUser] = useState([]);
  const [company, setCompany] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [istype, setIsType] = useState("candidate");

  const { searchRef } = useAppContext();

  useEffect(() => {
    // Separate users into candidates and companies
    let candidates = users.filter((role) => role.accountType !== "company");
    let recruiters = users.filter((role) => role.accountType !== "candidate");

    // Apply search filter if text exists
    if (searchtext.length > 0) {
      const lowerSearch = searchtext.toLowerCase().trim();
      candidates = candidates.filter((names) =>
        names.firstName.toLowerCase().trim().includes(lowerSearch),
      );
      recruiters = recruiters.filter((names) =>
        names.firstName.toLowerCase().trim().includes(lowerSearch),
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
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Helper to update local state immediately when dropdown changes
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
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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
            placeholder="Search candidate and Recruiter"
            className="border-0 border-b-2 border-gray-500 outline-0 placeholder:text-wrap w-[50%] rounded p-1 placeholder:text-gray-400 placeholder:capitalize"
          />
        </div>
        <div></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y capitalize divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {heading.map((title, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user?.candidate?.profile_image || user?.company?.logo ? (
                        <img
                          src={`${istype === "candidate" ? user?.candidate?.profile_image : `${user?.company?.logo}`}`}
                          alt="logo"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <p className="w-10 h-10 rounded-full object-cover text-2xl bg-blue-400 text-center">
                          {" "}
                          {user?.firstName.charAt(0)}{" "}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.accountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {istype === "candidate" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {user.status}
                        </span>
                      ) : (
                        <select
                          value={user.status}
                          onChange={(e) =>
                            handleStatusChange(user._id, e.target.value)
                          }
                          className={`capitalize px-2 rounded-2xl text-xs p-0.5 leading-10 font-semibold ${getStatusColor(user.status)}`}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {istype === "company" && (
                        <button
                          onClick={() =>
                            handleUserStatus(user._id, user.status)
                          }
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          Update
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
