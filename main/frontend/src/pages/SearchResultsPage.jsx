// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ConsumerSearchService } from "../services/consumer/consumerSearchService.js";
import { formatCurrency } from "../lib/utils.js";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState({ products: [], vendors: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await ConsumerSearchService.getSearchResults(query);
        setResults(data || { products: [], vendors: [] });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = results.products.length + results.vendors.length;

  // --- MODIFIED: Fixed filtering logic for tabs ---
  const filteredProducts = activeTab === "all" || activeTab === "products" ? results.products : [];
  const filteredVendors = activeTab === "all" || activeTab === "brands" ? results.vendors : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 font-sans text-[#0D1539]">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Search Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Search Results
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  <i className="fas fa-search text-xs"></i>
                  "{query}"
                </span>
                <span className="text-sm">
                  • {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                </span>
              </p>
            </div>

            {/* Filter Tabs */}
            {!loading && totalResults > 0 && (
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "all"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "products"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Products ({results.products.length})
                </button>
                <button
                  onClick={() => setActiveTab("brands")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "brands"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Brands ({results.vendors.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-search text-orange-500 text-xl"></i>
              </div>
            </div>
            <p className="text-gray-600 mt-6 font-medium animate-pulse">Searching the marketplace...</p>
          </div>
        ) : (
          <>
            {/* NO RESULTS STATE */}
            {totalResults === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6 animate-bounce">🔍</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">No results found</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We couldn't find any matches for <span className="font-semibold text-gray-900">"{query}"</span>. 
                    Try adjusting your search terms or explore our categories.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/map"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <i className="fas fa-th-large"></i>
                      Browse Categories
                    </Link>
                    <button
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      <i className="fas fa-arrow-left"></i>
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VENDORS SECTION */}
            {filteredVendors.length > 0 && (
              <div className="mb-12 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-store text-white"></i>
                    </div>
                    <span>Brands</span>
                    <span className="text-base font-normal text-gray-500">({filteredVendors.length})</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredVendors.map((vendor, index) => (
                    <Link
                      key={vendor.id}
                      to={`/vendor/${vendor.id}/products/all`}
                      className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center gap-4 group hover:-translate-y-1 animate-slideUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 flex-shrink-0 group-hover:border-orange-300 transition-colors">
                          <img
                            src={vendor.brand_logo_1 || "https://placehold.co/100x100?text=Logo"}
                            alt={vendor.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="overflow-hidden flex-grow">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors mb-1">
                          {vendor.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <i className="fas fa-envelope text-gray-400"></i>
                          {vendor.email}
                        </p>
                      </div>
                      
                      <i className="fas fa-arrow-right text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"></i>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS GRID */}
            {filteredProducts.length > 0 && (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-box-open text-white"></i>
                    </div>
                    <span>Products</span>
                    <span className="text-base font-normal text-gray-500">({filteredProducts.length})</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.product_uuid}`}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-2 animate-slideUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                        <img
                          src={product.product_images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <span className="font-bold text-gray-900 text-lg">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
                          {product.category || "Product"}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow leading-relaxed">
                          {product.description || "No description available"}
                        </p>
                        
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <i className="fas fa-star text-sm"></i>
                            <span className="text-sm font-bold text-gray-700">
                              {product.avg_review || "0.0"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            <span className="group-hover:underline">View</span>
                            <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out backwards; }
      `}</style>
    </div>
  );
};

export default SearchResultsPage;