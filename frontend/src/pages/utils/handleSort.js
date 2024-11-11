// utils/handleSort.js
export const handleSort = (key, sortConfig, setSortConfig) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
};
