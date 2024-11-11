// utils/fetchEntries.js
export const fetchEntries = async (apiUrl, dataKey, setEntries, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Use dataKey to access the appropriate entries, fallback to empty array if undefined
        setEntries(data[dataKey] || []);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
