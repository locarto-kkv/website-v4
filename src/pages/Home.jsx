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
            <h2 className="text-3xl font-bold text-center mb-4 text-secondary">Featured Categories</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Explore our most popular product categories</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Category 1 */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center card-hover">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-laptop text-primary text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg mb-2">Electronics</h3>
                <p className="text-gray-600 text-sm">Smartphones, laptops, and more</p>
              </div>
              
              {/* Category 2 */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center card-hover">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-tshirt text-primary text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg mb-2">Fashion</h3>
                <p className="text-gray-600 text-sm">Clothing, shoes, and accessories</p>
              </div>
              
              {/* Category 3 */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center card-hover">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-home text-primary text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg mb-2">Home & Garden</h3>
                <p className="text-gray-600 text-sm">Furniture, decor, and tools</p>
              </div>
              
              {/* Category 4 */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center card-hover">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heartbeat text-primary text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg mb-2">Health & Beauty</h3>
                <p className="text-gray-600 text-sm">Skincare, supplements, and more</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-secondary">How Locarto Works</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Simple steps to buy or sell locally</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center bg-white p-8 rounded-xl shadow-md card-hover">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Create Account</h3>
                <p className="text-gray-600">Sign up as a customer or vendor in seconds</p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center bg-white p-8 rounded-xl shadow-md card-hover">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Browse or List</h3>
                <p className="text-gray-600">Find products or list your items for sale</p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center bg-white p-8 rounded-xl shadow-md card-hover">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Connect & Transact</h3>
                <p className="text-gray-600">Communicate and complete secure transactions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-secondary">What Our Users Say</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Real stories from our community</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md testimonial-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <div className="flex text-yellow-400">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"I found unique handmade jewelry on Locarto that I couldn't find anywhere else. The seller was responsive and shipping was fast!"</p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md testimonial-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <div className="flex text-yellow-400">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"As a vendor, Locarto helped me reach local customers without the high fees of other platforms. My sales increased by 40% in the first month!"</p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md testimonial-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">E</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Emma Rodriguez</h4>
                    <div className="flex text-yellow-400">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The customer service is exceptional. When I had an issue with my order, they resolved it immediately and even gave me a discount for my next purchase."</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;