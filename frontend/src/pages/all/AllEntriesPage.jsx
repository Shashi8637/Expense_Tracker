import React, { useEffect, useState } from "react";

const AllEntriesPage = () => {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "amount",
    direction: "ascending",
  });

  // State for the edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  // State for the add modal
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "Income", // Default type
    description: "",
    amount: 0,
    category: "",
    subcategory: "", // Added subcategory field
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0], // Default to today’s date
  });

  // Function to fetch all entries
  const fetchAllEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5500/api/v1/allentries");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data); // Log the response to verify structure
      setAllEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries when component mounts
  useEffect(() => {
    fetchAllEntries();
  }, []);

  // Calculate total income, total expense, and balance
  const totalIncome = allEntries
    .filter((entry) => entry.type === "Income")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalExpense = allEntries
    .filter((entry) => entry.type === "Expense")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort entries based on sortConfig
  const sortedEntries = [...allEntries].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  // Handle edit entry
  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  // Function to update an entry
  const updateEntry = async (updatedEntry) => {
    try {
      const response = await fetch(
        `http://localhost:5500/api/v1/editentries/${updatedEntry._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEntry),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the entry");
      }

      // Update the entries in the state
      setAllEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === updatedEntry._id ? updatedEntry : entry
        )
      );

      setIsEditing(false); // Close the modal
      setCurrentEntry(null); // Clear current entry
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update the entry. Please try again.");
    }
  };

  // Handle delete entry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5500/api/v1/deleteentries/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the entry");
      }

      setAllEntries((prevEntries) =>
        prevEntries.filter((entry) => entry._id !== id)
      );
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete the entry. Please try again.");
    }
  };

  // Function to add an entry
  const addEntry = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/v1/addentries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to add the entry");
      }

      const addedEntry = await response.json();

      // Ensure the added entry has a valid formatted date
      const formatDate = (date) => {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      };

      addedEntry.date = formatDate(addedEntry.date);

      // Update the entries in the state immediately
      setAllEntries((prevEntries) => [...prevEntries, addedEntry]);

      setIsAdding(false); // Close the modal
      setNewEntry({
        type: "Income",
        description: "",
        amount: 0,
        category: "",
        subcategory: "",
        paymentMethod: "",
        date: formatDate(new Date()), // Reset date to today's formatted date
      });
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add the entry. Please try again.");
    }
  };

  // Render loading state, error message, or the entries
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if allEntries is an array
  if (!Array.isArray(allEntries)) {
    return <div>No entries found or data is not valid.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Entries</h1>

      {/* Button to Add Entry */}
      <button
        onClick={() => setIsAdding(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Entry
      </button>

      {/* Display Total Income, Total Expense, and Total Balance */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Total Income: ₹{totalIncome.toLocaleString()}
        </h2>
        <h2 className="text-xl font-semibold">
          Total Expense: ₹{totalExpense.toLocaleString()}
        </h2>
        <h2 className="text-xl font-semibold">
          Total Balance: ₹{totalBalance.toLocaleString()}
        </h2>
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={sortConfig.key}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="amount">Sort by Amount</option>
          <option value="paymentMethod">Sort by Payment Method</option>
          <option value="date">Sort by Date</option>
          <option value="description">Sort by Description</option>
          <option value="category">Sort by Category</option>
          <option value="type">Sort by Type</option>
          <option value="subcategory">Sort by subcategory</option>
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
              <th className="py-2 px-4 border-b">Subcategory</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => (
              <tr key={`${entry._id}-${index}`}>
                <td className="py-2 px-4 border-b">{entry.type}</td>
                <td className="py-2 px-4 border-b">{entry.description}</td>
                <td className="py-2 px-4 border-b">₹{entry.amount}</td>
                <td className="py-2 px-4 border-b">{entry.category}</td>
                <td className="py-2 px-4 border-b">{entry.subcategory}</td>
                <td className="py-2 px-4 border-b">{entry.paymentMethod}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(entry.date).toLocaleDateString('en-GB')}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
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

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEntry();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Type</label>
                <select
                  value={newEntry.type}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, type: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={newEntry.description}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, description: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newEntry.amount === 0 ? "" : newEntry.amount} // Show empty input if the amount is 0
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty value but convert to a number if there is input
                    setNewEntry({
                      ...newEntry,
                      amount: value === "" ? 0 : Number(value),
                    });
                  }}
                  onBlur={() => {
                    // Ensure the value is at least 0 after leaving the input field
                    if (newEntry.amount === "") {
                      setNewEntry({ ...newEntry, amount: 0 });
                    }
                  }}
                  className="border border-gray-300 rounded p-2 w-full"
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={newEntry.category}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, category: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Subcategory</label>
                <input
                  type="text"
                  value={newEntry.subcategory}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, subcategory: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Payment Method</label>
                <input
                  type="text"
                  value={newEntry.paymentMethod}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, paymentMethod: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, date: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && currentEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">Edit Entry</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEntry(currentEntry);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Type</label>
                <select
                  value={currentEntry.type}
                  onChange={(e) =>
                    setCurrentEntry({ ...currentEntry, type: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={currentEntry.description}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  value={currentEntry.amount}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      amount: +e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={currentEntry.category}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      category: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Subcategory</label>
                <input
                  type="text"
                  value={currentEntry.subcategory}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      subcategory: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Payment Method</label>
                <input
                  type="text"
                  value={currentEntry.paymentMethod}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  value={
                    currentEntry?.date
                      ? new Date(currentEntry.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentEntry({ ...currentEntry, date: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEntriesPage;
