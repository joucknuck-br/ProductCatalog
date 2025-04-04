import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductAddPage from './pages/ProductAddPage';
import ProductEditPage from './pages/ProductEditPage';
import './index.css'; // Import basic styles

function App() {
    return (
        <Router>
            <div>
                {/* Basic Navigation (Optional) */}
                {/* <nav>
                    <ul>
                        <li><Link to="/">Product List</Link></li>
                    </ul>
                </nav> */}

                {/* Content Area */}
                <main className="container">
                    <Routes>
                        <Route path="/" element={<ProductListPage />} />
                        <Route path="/add" element={<ProductAddPage />} />
                        <Route path="/edit/:id" element={<ProductEditPage />} />
                         {/* Add a 404 or default route if needed */}
                         <Route path="*" element={<div><h2>Page Not Found</h2><Link to="/">Go Home</Link></div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;