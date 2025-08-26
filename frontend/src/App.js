import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BookingWidget from "./components/BookingWidget";
import MovieSection from "./components/MovieSection";
import PromoSection from "./components/PromoSection";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <BookingWidget />
      <MovieSection />
      <PromoSection />
      <NewsSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
