export const handleSave = async (updatedEntry, setEntries, handleModalClose) => {
    try {
        const response = await fetch(`http://localhost:5500/api/v1/editentries/${updatedEntry._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEntry),
        });

        if (!response.ok) throw new Error('Failed to update the entry');

        setEntries((prev) =>
            prev.map((entry) => (entry._id === updatedEntry._id ? updatedEntry : entry))
        );

        handleModalClose(); // Close the modal
    } catch (error) {
        console.error('Error updating entry:', error);
        alert('Failed to update the entry. Please try again.');
    }
};
