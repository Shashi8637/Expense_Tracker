import React, { useEffect, useState } from 'react';
import Modal from '../Modal'; // Adjust the path as necessary

const CreditPage = () => {
    const [creditEntries, setCreditEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'amount', direction: 'ascending' });
    const [modalOpen, setModalOpen] = useState(false); // Modal state
    const [currentEntry, setCurrentEntry] = useState(null); // Current entry being edited

    const fetchCreditEntries = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/v1/getincomeentry');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setCreditEntries(data.incomeEntries);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditEntries();
    }, []);

    const totalIncome = creditEntries.reduce((acc, entry) => acc + entry.amount, 0);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedEntries = [...creditEntries].sort((a, b) => {
        if (sortConfig.direction === 'ascending') {
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

    const handleSave = async (updatedEntry) => {
        try {
            const response = await fetch(`http://localhost:5500/api/v1/editentries/${updatedEntry._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEntry),
            });

            if (!response.ok) throw new Error('Failed to update the entry');

            // Update state with new entry data
            setCreditEntries((prev) =>
                prev.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
            );

            handleModalClose(); // Close the modal
        } catch (error) {
            console.error('Error updating entry:', error);
            alert('Failed to update the entry. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5500/api/v1/deleteentries/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete the entry');

            setCreditEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
            console.log(`Successfully deleted entry with id: ${id}`);
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete the entry. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Credit Entries</h1>

            <div className="text-xl font-semibold mb-4">
                Total Income: ₹{totalIncome.toLocaleString()}
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
                            <tr key={entry._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="py-2 px-4 border-b">{entry.type}</td>
                                <td className="py-2 px-4 border-b">{entry.description}</td>
                                <td className="py-2 px-4 border-b">{entry.amount}</td>
                                <td className="py-2 px-4 border-b">{entry.category}</td>
                                <td className="py-2 px-4 border-b">{entry.paymentMethod}</td>
                                <td className="py-2 px-4 border-b">{new Date(entry.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(entry)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(entry._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded">
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
                onSave={handleSave}
            />
        </div>
    );
};

export default CreditPage;
