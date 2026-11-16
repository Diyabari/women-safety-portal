import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const load = () => {
    api.get("/admin/users").then((res) => setUsers(res.data.data));
  };

  useEffect(load, []);

  const toggleStatus = async (id, isActive) => {
    const res = await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
    setUsers((prev) => prev.map((u) => (u._id === id ? res.data.data : u)));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="page-title">Manage Users</h1>
        <p className="mt-1 text-slate-500">View and manage registered users on the platform.</p>

        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
                <th className="py-2 pr-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-800">{u.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                  <td className="py-3 pr-4 capitalize text-slate-600">{u.role}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleStatus(u._id, u.isActive)}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
