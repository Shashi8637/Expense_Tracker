import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Adjust the path as necessary
import { handleDelete } from "../utils/handleDelete.js";
import { fetchEntries } from "../utils/fetchEntries.js";
import { handleSave } from "../utils/handleSave.js";
import { handleSort } from "../utils/handleSort.js";

const DebitPage = () => {
  const [debitEntries, setDebitEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "amount",
    direction: "ascending",
  });
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [currentEntry, setCurrentEntry] = useState(null); // Current entry being edited

  const fetchDebitEntries = () => {
    fetchEntries(
      "http://localhost:5500/api/v1/getexpense",
      "expenseEntries", // Specify the correct key for expense entries
      setDebitEntries,
      setError,
      setLoading
    );
  };

  useEffect(() => {
    fetchDebitEntries();
  }, []);

  const totalDebit = debitEntries.reduce((acc, entry) => acc + entry.amount, 0);

  // const handleSort = (key) => {
  //     let direction = 'ascending';
  //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
  //         direction = 'descending';
  //     }
  //     setSortConfig({ key, direction });
  // };

  const sortedEntries = [...debitEntries].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleEdit = (entry) => {
    setCurrentEntry(entry); // Set current entry to edit
    setModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentEntry(null);
  };

  const handleSaveClick = async () => {
    if (currentEntry) {
      await handleSave(currentEntry, setDebitEntries, handleModalClose);
    }
  };

  const handleDeleteDebit = (id) => {
    handleDelete(
      id,
      setDebitEntries,
      "http://localhost:5500/api/v1/deleteentries"
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debit Entries</h1>

      <div className="p-4 bg-red-100 shadow-md rounded-lg border border-red-200 flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-red-600">Total Expenses</h2>
        <p className="text-lg font-bold text-red-800">
          ₹{totalDebit.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={sortConfig.key}
          onChange={(e) =>
            handleSort(e.target.value, sortConfig, setSortConfig)
          }
          className="border border-gray-300 rounded p-2"
        >
          <option value="amount">Sort by Amount</option>
          <option value="paymentMethod">Sort by Payment Method</option>
          <option value="date">Sort by Date</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => (
              <tr
                key={entry._id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="py-2 px-4 border-b">{entry.type}</td>
                <td className="py-2 px-4 border-b">{entry.description}</td>
                <td className="py-2 px-4 border-b">{entry.amount}</td>
                <td className="py-2 px-4 border-b">{entry.category}</td>
                <td className="py-2 px-4 border-b">{entry.paymentMethod}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDebit(entry._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing */}
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        entry={currentEntry}
        onSave={handleSaveClick}
      />
    </div>
  );
};

export default DebitPage;
