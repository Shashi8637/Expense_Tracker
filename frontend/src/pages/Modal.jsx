import React from 'react';

const Modal = ({ isOpen, onClose, entry, onSave }) => {
    const [formData, setFormData] = React.useState(entry || {});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        setFormData(entry || {});
    }, [entry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`http://localhost:5500/api/v1/editentries/${entry._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update the entry');
            }

            const updatedEntry = await response.json();
            onSave(updatedEntry);
            setSuccess(true);
            setTimeout(onClose, 2000); // Close the modal after 2 seconds
        } catch (error) {
            console.error('Error updating entry:', error);
            setError('Failed to update the entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <h2 className="text-xl mb-4">Edit Entry</h2>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">Entry updated successfully!</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Payment Method</label>
                        <input
                            type="text"
                            name="paymentMethod"
                            value={formData.paymentMethod || ''}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date || ''}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
