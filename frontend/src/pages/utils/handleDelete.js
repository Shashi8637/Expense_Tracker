// utils/handleDelete.js

export const handleDelete = async (id, setEntries, apiUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete the entry');

        setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));

        console.log(`Successfully deleted entry with id: ${id}`);
    } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete the entry. Please try again.');
    }
};
