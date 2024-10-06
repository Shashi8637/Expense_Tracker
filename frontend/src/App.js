import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreditPage from './pages/credit/CreditPage'; // Implement your CreditPage
import DebitPage from './pages/debit/DebitPage'; // Implement your DebitPage
import AllEntriesPage from './pages/all/AllEntriesPage'; // Implement your AllEntriesPage

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-4">
          <Link to="/credit">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mx-2">Credit Page</button>
          </Link>
          <Link to="/debit">
            <button className="bg-green-500 text-white px-4 py-2 rounded mx-2">Debit Page</button>
          </Link>
        </div>

        <Routes>
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/debit" element={<DebitPage />} />
          <Route path="/" element={<AllEntriesPage />} />
          <Route path="/all" element={<AllEntriesPage />} /> {/* In case you need this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
