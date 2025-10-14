// src/pages/consumer/ShopProducts.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ShopProducts = () => {
  const { shopId } = useParams();
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState({});

  // Complete shop database with unique IDs matching MapView
  const allShops = {
    // Wellness Category Shops
    'serenity-yoga-studio': { 
      id: 'serenity-yoga-studio',
      name: 'Serenity Yoga Studio', 
      category: 'Wellness', 
      color: '#10B981', 
      icon: 'fas fa-leaf',
      products: [
        { id: 1, name: 'Yoga Mat Premium', type: 'Yoga Equipment', price: '$49.99', rating: 4.9, stock: 25, image: 'https://via.placeholder.com/300/10B981/ffffff?text=Yoga+Mat' },
        { id: 2, name: 'Meditation Cushion', type: 'Wellness', price: '$34.99', rating: 4.7, stock: 18, image: 'https://via.placeholder.com/300/059669/ffffff?text=Cushion' },
        { id: 3, name: 'Yoga Block Set', type: 'Yoga Equipment', price: '$24.99', rating: 4.8, stock: 30, image: 'https://via.placeholder.com/300/047857/ffffff?text=Blocks' },
        { id: 4, name: 'Resistance Bands', type: 'Fitness', price: '$19.99', rating: 4.6, stock: 40, image: 'https://via.placeholder.com/300/065f46/ffffff?text=Bands' },
        { id: 5, name: 'Water Bottle', type: 'Accessories', price: '$14.99', rating: 4.5, stock: 50, image: 'https://via.placeholder.com/300/064e3b/ffffff?text=Bottle' },
        { id: 6, name: 'Yoga Strap', type: 'Yoga Equipment', price: '$12.99', rating: 4.7, stock: 35, image: 'https://via.placeholder.com/300/10B981/ffffff?text=Strap' }
      ]
    },
    'mindful-fitness-center': { 
      id: 'mindful-fitness-center',
      name: 'Mindful Fitness Center', 
      category: 'Wellness', 
      color: '#10B981', 
      icon: 'fas fa-leaf',
      products: [
        { id: 1, name: 'Dumbbells Set', type: 'Fitness Equipment', price: '$89.99', rating: 4.8, stock: 15, image: 'https://via.placeholder.com/300/10B981/ffffff?text=Dumbbells' },
        { id: 2, name: 'Treadmill Home', type: 'Cardio Equipment', price: '$599.99', rating: 4.9, stock: 5, image: 'https://via.placeholder.com/300/059669/ffffff?text=Treadmill' },
        { id: 3, name: 'Exercise Ball', type: 'Fitness', price: '$29.99', rating: 4.6, stock: 25, image: 'https://via.placeholder.com/300/047857/ffffff?text=Ball' },
        { id: 4, name: 'Kettlebell', type: 'Fitness Equipment', price: '$44.99', rating: 4.7, stock: 20, image: 'https://via.placeholder.com/300/065f46/ffffff?text=Kettlebell' },
        { id: 5, name: 'Jump Rope', type: 'Cardio', price: '$15.99', rating: 4.5, stock: 45, image: 'https://via.placeholder.com/300/064e3b/ffffff?text=Rope' },
        { id: 6, name: 'Foam Roller', type: 'Recovery', price: '$34.99', rating: 4.8, stock: 30, image: 'https://via.placeholder.com/300/10B981/ffffff?text=Roller' }
      ]
    },
    
    // Lifestyle Category Shops
    'urban-style-boutique': { 
      id: 'urban-style-boutique',
      name: 'Urban Style Boutique', 
      category: 'Lifestyle', 
      color: '#F59E0B', 
      icon: 'fas fa-shopping-bag',
      products: [
        { id: 1, name: 'Designer Handbag', type: 'Fashion Accessories', price: '$199.99', rating: 4.9, stock: 8, image: 'https://via.placeholder.com/300/F59E0B/ffffff?text=Handbag' },
        { id: 2, name: 'Leather Jacket', type: 'Clothing', price: '$299.99', rating: 4.8, stock: 12, image: 'https://via.placeholder.com/300/D97706/ffffff?text=Jacket' },
        { id: 3, name: 'Sunglasses', type: 'Accessories', price: '$89.99', rating: 4.7, stock: 20, image: 'https://via.placeholder.com/300/B45309/ffffff?text=Sunglasses' },
        { id: 4, name: 'Silk Scarf', type: 'Accessories', price: '$54.99', rating: 4.6, stock: 25, image: 'https://via.placeholder.com/300/92400E/ffffff?text=Scarf' },
        { id: 5, name: 'Sneakers Premium', type: 'Footwear', price: '$149.99', rating: 4.8, stock: 15, image: 'https://via.placeholder.com/300/78350F/ffffff?text=Sneakers' },
        { id: 6, name: 'Belt Designer', type: 'Accessories', price: '$69.99', rating: 4.5, stock: 30, image: 'https://via.placeholder.com/300/F59E0B/ffffff?text=Belt' }
      ]
    },
    'casa-living': { 
      id: 'casa-living',
      name: 'Casa Living', 
      category: 'Lifestyle', 
      color: '#F59E0B', 
      icon: 'fas fa-shopping-bag',
      products: [
        { id: 1, name: 'Decorative Vase', type: 'Home Decor', price: '$79.99', rating: 4.8, stock: 18, image: 'https://via.placeholder.com/300/F59E0B/ffffff?text=Vase' },
        { id: 2, name: 'Throw Pillows Set', type: 'Home Textiles', price: '$44.99', rating: 4.7, stock: 30, image: 'https://via.placeholder.com/300/D97706/ffffff?text=Pillows' },
        { id: 3, name: 'Wall Art Canvas', type: 'Wall Decor', price: '$129.99', rating: 4.9, stock: 10, image: 'https://via.placeholder.com/300/B45309/ffffff?text=Canvas' },
        { id: 4, name: 'Table Lamp', type: 'Lighting', price: '$64.99', rating: 4.6, stock: 22, image: 'https://via.placeholder.com/300/92400E/ffffff?text=Lamp' },
        { id: 5, name: 'Rug Modern', type: 'Home Textiles', price: '$159.99', rating: 4.8, stock: 8, image: 'https://via.placeholder.com/300/78350F/ffffff?text=Rug' },
        { id: 6, name: 'Photo Frames Set', type: 'Decor', price: '$34.99', rating: 4.5, stock: 35, image: 'https://via.placeholder.com/300/F59E0B/ffffff?text=Frames' }
      ]
    },
    
    // Accessories Category Shops
    'golden-crown-jewellers': { 
      id: 'golden-crown-jewellers',
      name: 'Golden Crown Jewellers', 
      category: 'Accessories', 
      color: '#EF4444', 
      icon: 'fas fa-gem',
      products: [
        { id: 1, name: 'Gold Necklace', type: 'Jewellery', price: '$599.99', rating: 4.9, stock: 5, image: 'https://via.placeholder.com/300/EF4444/ffffff?text=Necklace' },
        { id: 2, name: 'Diamond Ring', type: 'Jewellery', price: '$899.99', rating: 5.0, stock: 3, image: 'https://via.placeholder.com/300/DC2626/ffffff?text=Ring' },
        { id: 3, name: 'Pearl Earrings', type: 'Jewellery', price: '$249.99', rating: 4.8, stock: 12, image: 'https://via.placeholder.com/300/B91C1C/ffffff?text=Earrings' },
        { id: 4, name: 'Silver Bracelet', type: 'Jewellery', price: '$179.99', rating: 4.7, stock: 15, image: 'https://via.placeholder.com/300/991B1B/ffffff?text=Bracelet' },
        { id: 5, name: 'Gold Chain', type: 'Jewellery', price: '$449.99', rating: 4.8, stock: 8, image: 'https://via.placeholder.com/300/7F1D1D/ffffff?text=Chain' },
        { id: 6, name: 'Gemstone Pendant', type: 'Jewellery', price: '$329.99', rating: 4.9, stock: 10, image: 'https://via.placeholder.com/300/EF4444/ffffff?text=Pendant' }
      ]
    },
    'timepiece-gallery': { 
      id: 'timepiece-gallery',
      name: 'Timepiece Gallery', 
      category: 'Accessories', 
      color: '#EF4444', 
      icon: 'fas fa-gem',
      products: [
        { id: 1, name: 'Rolex Submariner', type: 'Luxury Watch', price: '$8999.99', rating: 5.0, stock: 2, image: 'https://via.placeholder.com/300/EF4444/ffffff?text=Rolex' },
        { id: 2, name: 'Omega Seamaster', type: 'Luxury Watch', price: '$6499.99', rating: 4.9, stock: 3, image: 'https://via.placeholder.com/300/DC2626/ffffff?text=Omega' },
        { id: 3, name: 'Tag Heuer Sport', type: 'Sports Watch', price: '$3299.99', rating: 4.8, stock: 5, image: 'https://via.placeholder.com/300/B91C1C/ffffff?text=Tag' },
        { id: 4, name: 'Seiko Automatic', type: 'Automatic Watch', price: '$599.99', rating: 4.7, stock: 10, image: 'https://via.placeholder.com/300/991B1B/ffffff?text=Seiko' },
        { id: 5, name: 'Casio G-Shock', type: 'Digital Watch', price: '$149.99', rating: 4.6, stock: 20, image: 'https://via.placeholder.com/300/7F1D1D/ffffff?text=Casio' },
        { id: 6, name: 'Fossil Chronograph', type: 'Fashion Watch', price: '$249.99', rating: 4.5, stock: 15, image: 'https://via.placeholder.com/300/EF4444/ffffff?text=Fossil' }
      ]
    }
  };

  // Get current shop data based on shopId from URL
  const currentShop = allShops[shopId] || { 
    id: 'default',
    name: 'Shop Not Found', 
    category: 'Unknown', 
    color: '#8B5CF6',
    icon: 'fas fa-store',
    products: []
  };

  const products = currentShop.products;

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans">
      {/* Animated Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br opacity-10 rounded-full blur-3xl animate-pulse" 
             style={{ background: `radial-gradient(circle, ${currentShop.color}, transparent)` }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br opacity-10 rounded-full blur-3xl animate-pulse animation-delay-2000" 
             style={{ background: `radial-gradient(circle, ${currentShop.color}, transparent)` }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Back Button - Top Left */}
        <div className="mb-6">
          <Link 
            to="/map" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 p-3 hover:bg-white/10 rounded-xl group bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <i className="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
            <span className="font-medium">Back to Map</span>
          </Link>
        </div>

        {/* Shop Info Banner */}
        <div className="mb-8 rounded-3xl shadow-2xl p-8 text-white backdrop-blur-xl border border-white/10 relative overflow-hidden"
             style={{ 
               background: `linear-gradient(135deg, ${currentShop.color}dd, ${currentShop.color}99)` 
             }}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border border-white/30">
              <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center overflow-hidden">
                <i className={`${currentShop.icon} text-3xl text-white drop-shadow-lg`}></i>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{currentShop.name}</h2>
              <p className="text-white/90 mb-3 drop-shadow">Premium quality products curated just for you</p>
              <div className="flex items-center justify-center md:justify-start gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <i className="fas fa-star text-yellow-300"></i>
                  <span className="font-semibold">4.7 Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <i className="fas fa-box text-white/90"></i>
                  <span className="font-semibold">{products.length} Products</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <i className="fas fa-tag text-white/90"></i>
                  <span className="font-semibold">{currentShop.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const inCartQty = cart[product.id] || 0;
              const isInWishlist = wishlist.has(product.id);

              return (
                <div 
                  key={product.id} 
                  className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 flex flex-col group hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-3xl"
                >
                  <div className="relative mb-4">
                    <div className="overflow-hidden rounded-xl bg-white/5">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full p-2.5 shadow-lg hover:scale-110 transition-all duration-200 border border-white/20"
                    >
                      <i className={`fas fa-heart text-lg transition-colors ${
                        isInWishlist ? 'text-red-500' : 'text-white/70 hover:text-red-400'
                      }`}></i>
                    </button>
                    {product.stock < 10 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>

                  <div className="flex-1 mb-4">
                    <h3 className="font-bold text-white mb-1 text-lg">{product.name}</h3>
                    <p className="text-sm text-white/60 mb-3">{product.type}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i}
                            className={`fas fa-star text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-white/20'
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-white/80">{product.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        {product.price}
                      </span>
                      <button 
                        onClick={() => addToCart(product.id)}
                        className="rounded-full w-11 h-11 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95 text-white border border-white/20"
                        style={{ background: `linear-gradient(135deg, ${currentShop.color}, ${currentShop.color}dd)` }}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    {inCartQty > 0 && (
                      <div className="text-center text-sm font-semibold py-2 rounded-lg backdrop-blur-sm"
                           style={{ 
                             background: `${currentShop.color}30`,
                             color: currentShop.color,
                             border: `1px solid ${currentShop.color}50`
                           }}>
                        {inCartQty} in cart
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
            <div className="text-7xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Products Available</h3>
            <p className="text-white/60">This shop doesn't have any products at the moment.</p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .hover\:shadow-3xl:hover {
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), 
                      0 18px 36px -18px rgba(0, 0, 0, 0.4);
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ShopProducts;