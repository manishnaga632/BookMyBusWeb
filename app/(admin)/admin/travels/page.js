"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TravelsManager = () => {
  const [travels, setTravels] = useState([]);
  const [filteredTravels, setFilteredTravels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTravels();
  }, []);

  useEffect(() => {
    const results = travels.filter(travel =>
      travel.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.to_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      travel.time.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTravels(results);
  }, [searchTerm, travels]);

  const fetchTravels = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/travels/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTravels(response.data);
      setFilteredTravels(response.data);
    } catch (error) {
      toast.error('Failed to fetch travels');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this travel?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/travels/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Travel deleted successfully');
      fetchTravels();
    } catch (error) {
      toast.error('Failed to delete travel');
    }
  };

  const exportToPDF = () => {
    if (filteredTravels.length === 0) {
      toast.warning('No travels to export');
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "From", "To", "Time", "Seats", "Price", "Created At"]],
      body: filteredTravels.map(t => [
        t.id,
        t.from_location,
        t.to_location,
        t.time,
        t.available_seats,
        t.price_per_seat,
        new Date(t.created_at).toLocaleString()
      ]),
      styles: {
        fillColor: [20, 20, 30],
        textColor: [255, 255, 255],
        fontStyle: 'normal'
      },
      headStyles: {
        fillColor: [138, 43, 226],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [25, 25, 35]
      }
    });
    doc.save('travels.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToExcel = () => {
    if (filteredTravels.length === 0) {
      toast.warning('No travels to export');
      return;
    }

    // Prepare data for Excel export
    const excelData = filteredTravels.map(t => ({
      ID: t.id,
      'Bus Image': t.bus_image,
      'From': t.from_location,
      'To': t.to_location,
      'Time': t.time,
      'Available Seats': t.available_seats,
      'Price Per Seat': t.price_per_seat,
      'Created At': new Date(t.created_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Travels");
    
    // Generate Excel file
    XLSX.writeFile(workbook, "travels.xlsx");
    toast.success('Excel exported successfully');
  };

  return (
    <div className="travels-manager-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="travels-header">
        <button onClick={() => router.back()} className="btn btn-back">
          🔙 Back
        </button>
        <h2>Travels Manager</h2>
      </div>

      <div className="search-export-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search travels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="export-buttons">
          <button onClick={exportToPDF} className="btn btn-pdf">
            Export to PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-excel">
            Export to Excel
          </button>
          <button 
            onClick={() => router.push('/admin/travels/add')} 
            className="btn btn-add"
          >
            ➕ Add Travel
          </button>
        </div>
      </div>

      <div className="travels-table-container">
        <table className="travels-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bus Image</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTravels.length > 0 ? (
              filteredTravels.map(travel => (
                <tr key={travel.id}>
                  <td>{travel.id}</td>
                  <td>
                    <img 
                      src={travel.bus_image} 
                      alt="Bus" 
                      className="bus-image"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/100?text=Bus+Image';
                      }}
                    />
                  </td>
                  <td>{travel.from_location}</td>
                  <td>{travel.to_location}</td>
                  <td>{travel.time}</td>
                  <td>{travel.available_seats}</td>
                  <td>₹{travel.price_per_seat}</td>
                  <td>{new Date(travel.created_at).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => router.push(`/admin/travels/edit/${travel.id}`)}
                        className="btn btn-edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(travel.id)}
                        className="btn btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No travels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelsManager;