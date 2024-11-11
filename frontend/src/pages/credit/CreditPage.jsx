import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Adjust the path as necessary
import { handleDelete } from "../utils/handleDelete.js";
import { fetchEntries } from "../utils/fetchEntries.js";
import { handleSave } from "../utils/handleSave.js";
import { handleSort } from "../utils/handleSort.js";

const CreditPage = () => {
  const [creditEntries, setCreditEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "amount",
    direction: "ascending",
  });
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [currentEntry, setCurrentEntry] = useState(null); // Current entry being edited

  const fetchCreditEntries = () => {
    fetchEntries(
      "http://localhost:5500/api/v1/getincomeentry",
      "incomeEntries",
      setCreditEntries,
      setError,
      setLoading
    );
  };

  useEffect(() => {
    fetchCreditEntries();
  }, []);

  const totalIncome = creditEntries.reduce(
    (acc, entry) => acc + entry.amount,
    0
  );

  const sortedEntries = [...creditEntries].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentEntry(null);
  };

  const handleSaveClick = async () => {
    if (currentEntry) {
      await handleSave(currentEntry, setCreditEntries, handleModalClose);
    }
  };

  const handleDeleteCredit = (id) => {
    handleDelete(
      id,
      setCreditEntries,
      "http://localhost:5500/api/v1/deleteentries"
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Credit Entries</h1>

      <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-md flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Total Income:</h2>
        <p className="text-lg font-semibold">₹{totalIncome.toLocaleString()}</p>
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
                    onClick={() => handleDeleteCredit(entry._id)}
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

export default CreditPage;
