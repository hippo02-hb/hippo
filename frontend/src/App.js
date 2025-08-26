import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/booking/:showtimeId" element={<BookingPage />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;