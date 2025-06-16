"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      alert("Not authorized. Please login.");
      router.push("/admin/login");
      return;
    }

    fetchCurrentUser(token);
    fetchUsers(token);
  }, [router]); // ✅ router added


  useEffect(() => {
    const results = users.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const fetchCurrentUser = async (token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.error("Error fetching profile", err);
      alert("Failed to fetch current admin profile.");
    }
  };

  const fetchUsers = async (token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/all_users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/delete_users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User deleted successfully!");
      fetchUsers(token);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "First Name", "Last Name", "Email", "Mobile", "Age", "Gender", "Role"]],
      body: filteredUsers.map((u) => [
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.mobile,
        u.age,
        u.gender,
        u.role
      ]),
    });
    doc.save("users.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "users.xlsx");
  };

  return (
    <div className="users-manager-container">
      <div className="users-header">
        <button onClick={() => router.back()} className="btn btn-back">
          🔙 Back
        </button>
        <h2>Users Manager</h2>
      </div>

      <div className="search-export-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="search-bar" style={{ width: '50%' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div className="export-buttons">
          <button onClick={exportToPDF} className="btn btn-pdf">
            Export to PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-excel">
            Export to Excel
          </button>
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const isProtectedAdmin = u.role === "admin" && u.id === currentUserId;
            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>{u.age}</td>
                <td>{u.gender}</td>
                <td>{u.role}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => router.push(`/admin/users/edit/${u.id}`)}
                      className="btn btn-edit"
                      disabled={isProtectedAdmin}
                      title={isProtectedAdmin ? "Admins can't edit themselves" : "Edit user"}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="btn btn-delete"
                      disabled={isProtectedAdmin}
                      title={isProtectedAdmin ? "Admins can't delete themselves" : "Delete user"}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManager;