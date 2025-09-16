import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" className="active">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-16 md:py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Local Treasures</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">Your favorite local marketplace for unique products and services</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/login/customer" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition">
                Shop Now
              </a>
              <a href="/login/vendor" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition">
                Sell With Us
              </a>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section id="categories" className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Featured Categories</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Explore our most popular product categories</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center card-hover">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas fa-${['laptop', 'tshirt', 'home', 'heartbeat'][i]} text-gray-600 text-2xl`}></i>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {['Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty'][i]}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {['Smartphones, laptops, and more', 'Clothing, shoes, accessories', 'Furniture, decor, and tools', 'Skincare, supplements'][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">How Locarto Works</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Simple steps to buy or sell locally</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="text-center bg-white p-8 rounded-xl shadow-md card-hover">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-gray-700 text-2xl font-bold">{step}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">
                    {['Create Account', 'Browse or List', 'Connect & Transact'][step - 1]}
                  </h3>
                  <p className="text-gray-600">
                    {['Sign up in seconds', 'Find or list products', 'Complete secure transactions'][step - 1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">What Our Users Say</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Real stories from our community</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {['Sarah Johnson', 'Michael Chen', 'Emma Rodriguez'].map((name, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md testimonial-card">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-bold">{name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, star) => (
                          <i 
                            key={star} 
                            className={`fas ${star < (i === 1 ? 4.5 : 5) ? 'fa-star' : 'fa-star-half-alt'}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    {[
                      "Found unique handmade jewelry here!",
                      "Sales increased by 40% in first month!",
                      "Exceptional customer service experience."
                    ][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
