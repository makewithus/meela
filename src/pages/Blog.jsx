import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiUser, FiSearch } from "react-icons/fi";
import ScrollTopProgress from "../components/ScrollTopProgress";
import WhatsAppButton from "../components/WhatsAppButton";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      if (!db) {
        throw new Error("Blog system is unavailable offline. Please configure Firebase to see the blogs.");
      }
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase());

    // Time filter logic
    let matchesTime = true;
    if (timeFilter !== "all" && blog.createdAt) {
      const blogDate = blog.createdAt.toDate ? blog.createdAt.toDate() : new Date(blog.createdAt);
      const now = new Date();
      const monthsAgo = (now - blogDate) / (1000 * 60 * 60 * 24 * 30);

      if (timeFilter === "6months") {
        matchesTime = monthsAgo <= 6;
      } else if (timeFilter === "1year") {
        matchesTime = monthsAgo <= 12;
      }
    }

    return matchesSearch && matchesTime;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-coffee/20 border-t-coffee rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-coffee font-serif text-xl">Loading blogs...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-serif text-coffee mb-2">Oops!</h2>
          <p className="text-coffee/70 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-3 bg-coffee text-cream rounded-lg hover:bg-coffee/90 transition-colors font-semibold"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative text-cream py-16 md:py-24 px-4"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dvaxoo30e/image/upload/v1764607946/product_bg_y26lan.png')" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-coffee text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Hair Care Blogs
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-lg text-coffee/90"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Discover expert tips, insights, and inspiration for Hairs
          </motion.p>
        </div>
      </motion.section>

      {/* Search Bar */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto px-6 md:px-4 -mt-4 md:-mt-6 relative z-10"
      >
        <div className="bg-white rounded-xl shadow-xl p-2 md:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center gap-3 flex-1">
              <FiSearch className="w-5 h-5 text-coffee/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-2 py-2 text-sm md:text-base focus:outline-none text-coffee"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              />
            </div>

            {/* Time Filter Dropdown - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-2">
              <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Filter:
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 pr-10 border border-coffee/20 rounded-lg text-sm text-coffee focus:outline-none focus:border-coffee cursor-pointer appearance-none bg-white"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B4423' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="all">All</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Blog List */}
      <section className="max-w-6xl mx-auto px-6 md:px-4 py-8 md:py-16">
        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-serif text-coffee mb-2">No blogs found</h3>
            <p className="text-coffee/70">
              {searchQuery
                ? "Try adjusting your search"
                : "Check back soon for new content!"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 md:space-y-8"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-coffee/10 pb-6 mb-6 md:pb-8 md:mb-8 last:border-b-0"
                >
                  <Link to={`/blog/${blog.id}`} className="block">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      {/* Image */}
                      {blog.imageUrl && (
                        <div className="w-full md:w-72 lg:w-80 h-48 md:h-64 flex-shrink-0 overflow-hidden">
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-center py-2">
                        {/* Category */}
                        {blog.category && (
                          <div className="mb-2 md:mb-3">
                            <span className="text-[10px] md:text-sm font-semibold text-coffee/70 uppercase tracking-wider border-b-2 border-coffee pb-1">
                              {blog.category}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h2
                          className="text-lg md:text-3xl lg:text-4xl font-bold text-coffee mb-3 md:mb-4 hover:text-coffee/80 transition-colors leading-tight"
                          style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                          {blog.title}
                        </h2>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-base text-coffee/60">
                          <div className="flex items-center gap-2">
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          {blog.author && (
                            <div className="flex items-center gap-2">
                              <span>BY {blog.author.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      <ScrollTopProgress />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
