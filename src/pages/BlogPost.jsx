import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiClock, FiArrowLeft, FiTag } from "react-icons/fi";
import ScrollTopProgress from "../components/ScrollTopProgress";
import WhatsAppButton from "../components/WhatsAppButton";
import 'react-quill-new/dist/quill.snow.css';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      if (!db) {
        throw new Error("Blog system is unavailable offline.");
      }
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Blog post not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "1 min read";
    const text = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
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
          <p className="text-coffee font-serif text-xl">Loading blog post...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !blog) {
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-coffee text-cream rounded-lg hover:bg-coffee/90 transition-colors font-semibold"
          >
            <FiArrowLeft /> Back to Blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Back Button */}
      <div className="px-6 md:px-12 pt-28">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-coffee/70 hover:text-coffee transition-colors text-sm font-medium"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to all blogs
        </Link>
      </div>

      {/* Featured Image */}
      {blog.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto px-4 mt-6"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Blog Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Category Badge */}
        {blog.category && (
          <div className="flex items-center gap-2 mb-4">
            <FiTag className="text-coffee/60 text-sm" />
            <span className="text-xs md:text-sm font-bold text-coffee/70 uppercase tracking-wider border-b-2 border-coffee pb-1">
              {blog.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee mb-6 leading-tight"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-coffee/60 mb-8 pb-6 border-b-2 border-coffee/10">
          {blog.author && (
            <div className="flex items-center gap-2">
              <FiUser className="text-coffee/50 w-4 h-4" />
              <span className="font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {blog.author}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FiCalendar className="text-coffee/50 w-4 h-4" />
            <span style={{ fontFamily: '"Poppins", sans-serif' }}>
              {formatDate(blog.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-coffee/50 w-4 h-4" />
            <span style={{ fontFamily: '"Poppins", sans-serif' }}>
              {calculateReadTime(blog.content)}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <div
          className="blog-content prose prose-sm md:prose-base lg:prose-lg max-w-none overflow-x-hidden"
          style={{ fontFamily: '"Poppins", sans-serif' }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </motion.article>

      <ScrollTopProgress />
      <WhatsAppButton />

      <style jsx>{`
        .blog-content {
          color: #6f4a3c;
          line-height: 1.8;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: normal;
          max-width: 100%;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          font-family: "Playfair Display", serif;
          color: #6f4a3c;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .blog-content h1 {
          font-size: 2rem;
        }

        .blog-content h2 {
          font-size: 1.75rem;
        }

        .blog-content h3 {
          font-size: 1.5rem;
        }

        .blog-content h4 {
          font-size: 1.25rem;
        }

        .blog-content p {
          margin-bottom: 1.25rem;
          font-size: 1rem;
          line-height: 1.8;
        }

        .blog-content a {
          color: #6f4a3c;
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.2s;
        }

        .blog-content a:hover {
          color: #8b6254;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
          list-style-position: outside;
        }

        .blog-content li {
          margin-bottom: 0.75rem;
          margin-left: 0;
        }

        .blog-content ul li {
          list-style-type: disc;
        }

        .blog-content ol li {
          list-style-type: decimal;
        }

        .blog-content blockquote {
          border-left: 4px solid #6f4a3c;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6f4a3c;
          background: #f7efe6;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .blog-content img {
          border-radius: 1rem;
          margin: 2rem 0;
          max-width: 100%;
          width: 100%;
          height: auto;
          box-shadow: 0 10px 30px rgba(111, 74, 60, 0.1);
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(111, 74, 60, 0.1);
        }

        .blog-content th,
        .blog-content td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #6f4a3c20;
        }

        .blog-content th {
          background: #6f4a3c;
          color: #f7efe6;
          font-weight: 600;
          font-family: "Poppins", sans-serif;
        }

        .blog-content tr:hover {
          background: #f7efe6;
        }

        .blog-content code {
          background: #f7efe6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #6f4a3c;
        }

        .blog-content pre {
          background: #2d2d2d;
          color: #f7efe6;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .blog-content pre code {
          background: transparent;
          padding: 0;
          color: #f7efe6;
        }

        .blog-content strong {
          font-weight: 600;
          color: #6f4a3c;
        }

        .blog-content em {
          font-style: italic;
        }

        .blog-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #6f4a3c, transparent);
          margin: 3rem 0;
        }

        @media (max-width: 768px) {
          .blog-content {
            overflow-x: hidden;
          }

          .blog-content h1 {
            font-size: 1.75rem;
          }

          .blog-content h2 {
            font-size: 1.5rem;
          }

          .blog-content h3 {
            font-size: 1.25rem;
          }

          .blog-content p {
            font-size: 0.9375rem;
          }

          .blog-content ul,
          .blog-content ol {
            padding-left: 1.25rem;
          }

          .blog-content table {
            font-size: 0.875rem;
          }

          .blog-content th,
          .blog-content td {
            padding: 0.5rem 0.75rem;
          }

          .blog-content pre {
            padding: 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
