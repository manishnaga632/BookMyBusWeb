
// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ContactManager = () => {
//   const [contacts, setContacts] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem("admin_token");
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data);
//     } catch (err) {
//       console.error("Error fetching contacts", err);
//       toast.error("Failed to fetch contacts");
//     }
//   };

//   const handleMarkSeen = async (id) => {
//     try {
//       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/contact/seen/${id}`);
//       fetchContacts();
//       toast.success("Contact marked as seen successfully");
//     } catch (err) {
//       console.error("Error marking as seen", err);
//       toast.error("Failed to mark as seen");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this contact?")) {
//       return;
//     }
    
//     try {
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/contact/delete/${id}`);
//       fetchContacts();
//       toast.success("Contact deleted successfully");
//     } catch (err) {
//       console.error("Error deleting contact", err);
//       toast.error("Failed to delete contact");
//     }
//   };

//   const exportToPDF = () => {
//     if (contacts.length === 0) {
//       toast.warning("No contacts to export");
//       return;
//     }
    
//     try {
//       const doc = new jsPDF();
//       autoTable(doc, {
//         head: [["ID", "Name", "Email", "Subject", "Message", "Created At"]],
//         body: contacts.map((c) => [
//           c.id,
//           c.name,
//           c.email,
//           c.subject,
//           c.message,
//           new Date(c.created_at).toLocaleString(),
//         ]),
//       });
//       doc.save("contacts.pdf");
//       toast.success("PDF exported successfully");
//     } catch (err) {
//       console.error("PDF export error", err);
//       toast.error("Failed to export PDF");
//     }
//   };

//   const exportToExcel = () => {
//     if (contacts.length === 0) {
//       toast.warning("No contacts to export");
//       return;
//     }
    
//     try {
//       const worksheet = XLSX.utils.json_to_sheet(contacts);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
//       const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//       const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//       saveAs(data, "contacts.xlsx");
//       toast.success("Excel exported successfully");
//     } catch (err) {
//       console.error("Excel export error", err);
//       toast.error("Failed to export Excel");
//     }
//   };

//   return (
//     <div className="contact-manager-container">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
      
//       <div className="contact-manager-header">
//         <button onClick={() => router.back()} className="contact-btn contact-btn-back">
//           🔙 Back
//         </button>
//         <h2>Contact Manager</h2>
//       </div>

//       <div className="contact-export-buttons">
//         <button onClick={exportToPDF} className="contact-btn contact-btn-pdf">
//           Export to PDF
//         </button>
//         <button onClick={exportToExcel} className="contact-btn contact-btn-excel">
//           Export to Excel
//         </button>
//       </div>

//       <table className="contact-manager-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Subject</th>
//             <th>Message</th>
//             <th>Created At</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {contacts.length > 0 ? (
//             contacts.map((c) => (
//               <tr key={c.id}>
//                 <td>{c.id}</td>
//                 <td>{c.name}</td>
//                 <td>{c.email}</td>
//                 <td>{c.subject}</td>
//                 <td>{c.message}</td>
//                 <td>{new Date(c.created_at).toLocaleString()}</td>
//                 <td className={c.seen ? "contact-status-seen" : "contact-status-unseen"}>
//                   {c.seen ? "✅ Seen" : "❌ Unseen"}
//                 </td>
//                 <td className="contact-action-buttons">
//                   {!c.seen && (
//                     <button
//                       className="contact-btn contact-btn-mark"
//                       onClick={() => handleMarkSeen(c.id)}
//                     >
//                       👁️ Mark Seen
//                     </button>
//                   )}
//                   <button
//                     className="contact-btn contact-btn-delete"
//                     onClick={() => handleDelete(c.id)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
//                 No contacts found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ContactManager;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
      toast.error("Failed to fetch contacts");
    }
  };

  const handleMarkSeen = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/contact/seen/${id}`);
      fetchContacts();
      toast.success("Contact marked as seen successfully");
    } catch (err) {
      console.error("Error marking as seen", err);
      toast.error("Failed to mark as seen");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/contact/delete/${id}`);
      fetchContacts();
      toast.success("Contact deleted successfully");
    } catch (err) {
      console.error("Error deleting contact", err);
      toast.error("Failed to delete contact");
    }
  };

  const exportToPDF = () => {
    if (contacts.length === 0) {
      toast.warning("No contacts to export");
      return;
    }

    try {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["ID", "Name", "Email", "Subject", "Message", "Created At"]],
        body: contacts.map((c) => [
          c.id,
          c.name,
          c.email,
          c.subject,
          c.message,
          new Date(c.created_at).toLocaleString(),
        ]),
      });
      doc.save("contacts.pdf");
      toast.success("PDF exported successfully");
    } catch (err) {
      console.error("PDF export error", err);
      toast.error("Failed to export PDF");
    }
  };

  const exportToExcel = () => {
    if (contacts.length === 0) {
      toast.warning("No contacts to export");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "contacts.xlsx");
      toast.success("Excel exported successfully");
    } catch (err) {
      console.error("Excel export error", err);
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="contact-manager">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="contact-manager-header">
        <button className="btn btn-back" onClick={() => router.back()}>
          🔙 Back
        </button>
        <h2>Contact Manager</h2>
      </div>

      <div className="btn-group">
        <button className="btn btn-pdf" onClick={exportToPDF}>
          Export to PDF
        </button>
        <button className="btn btn-excel" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      <div className="table-wrapper">
        <table className="contact-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.subject}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                  <td>
                    <span className={c.seen ? "status seen" : "status unseen"}>
                      {c.seen ? "✅ Seen" : "❌ Unseen"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {!c.seen && (
                        <button className="btn btn-mark" onClick={() => handleMarkSeen(c.id)}>
                          👁️ Mark Seen
                        </button>
                      )}
                      <button className="btn btn-delete" onClick={() => handleDelete(c.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactManager;
