import { useEffect, useState } from "react";
import React from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState({ orders: true, newsletter: true, contacts: true, coupons: true, blogs: true });
  const [errors, setErrors] = useState({ orders: "", newsletter: "", contacts: "", coupons: "", blogs: "" });
  const [currentPage, setCurrentPage] = useState({ orders: 1, newsletter: 1, contacts: 1, coupons: 1, blogs: 1 });
  const [itemsPerPage, setItemsPerPage] = useState({ orders: 10, newsletter: 10, contacts: 10, coupons: 10, blogs: 10 });
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Coupon form states
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
    expiryDate: "",
    usageLimit: "",
    usedCount: 0,
  });
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  // Blog form states
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    imageUrl: "",
  });
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check authentication state (MUST be first)
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      setShowLoginModal(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setShowLoginModal(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Orders (only when authenticated)
  useEffect(() => {
    if (!user || !db) return;
    setLoading(prev => ({ ...prev, orders: true }));
    setErrors(prev => ({ ...prev, orders: "" }));

    try {
      // Try with orderBy first, fallback to simple query if it fails
      let q;
      try {
        q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );
      } catch (orderByError) {
        console.warn("orderBy failed, using simple query:", orderByError);
        q = collection(db, "orders");
      }

      const unsub = onSnapshot(
        q,
        (snap) => {
          const ordersData = snap.docs.map((d) => {
            const data = d.data();
            return { id: d.id, ...data };
          });
          // Sort manually if orderBy didn't work
          ordersData.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
            const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });
          setOrders(ordersData);
          setLoading(prev => ({ ...prev, orders: false }));
          console.log("Orders fetched:", ordersData.length, ordersData);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setErrors(prev => ({ ...prev, orders: error.message || "Failed to load orders" }));
          setLoading(prev => ({ ...prev, orders: false }));
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up orders query:", error);
      setErrors(prev => ({ ...prev, orders: error.message || "Failed to set up orders query" }));
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, [user]);

  // Fetch Newsletter Subscribers (only when authenticated)
  useEffect(() => {
    if (!user || !db) return;

    setLoading(prev => ({ ...prev, newsletter: true }));
    setErrors(prev => ({ ...prev, newsletter: "" }));

    try {
      let q;
      try {
        q = query(
          collection(db, "newsletter"),
          orderBy("subscribedAt", "desc")
        );
      } catch (orderByError) {
        console.warn("orderBy failed, using simple query:", orderByError);
        q = collection(db, "newsletter");
      }

      const unsub = onSnapshot(
        q,
        (snap) => {
          const newsletterData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          newsletterData.sort((a, b) => {
            const aTime = a.subscribedAt?.toDate?.()?.getTime() || 0;
            const bTime = b.subscribedAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });
          setNewsletters(newsletterData);
          setLoading(prev => ({ ...prev, newsletter: false }));
          console.log("Newsletters fetched:", newsletterData.length, newsletterData);
        },
        (error) => {
          console.error("Error fetching newsletters:", error);
          setErrors(prev => ({ ...prev, newsletter: error.message || "Failed to load newsletters" }));
          setLoading(prev => ({ ...prev, newsletter: false }));
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up newsletter query:", error);
      setErrors(prev => ({ ...prev, newsletter: error.message || "Failed to set up newsletter query" }));
      setLoading(prev => ({ ...prev, newsletter: false }));
    }
  }, [user]);

  // Fetch Contact Submissions (only when authenticated)
  useEffect(() => {
    if (!user || !db) return;

    setLoading(prev => ({ ...prev, contacts: true }));
    setErrors(prev => ({ ...prev, contacts: "" }));

    try {
      let q;
      try {
        q = query(
          collection(db, "contacts"),
          orderBy("submittedAt", "desc")
        );
      } catch (orderByError) {
        console.warn("orderBy failed, using simple query:", orderByError);
        q = collection(db, "contacts");
      }

      const unsub = onSnapshot(
        q,
        (snap) => {
          const contactsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          contactsData.sort((a, b) => {
            const aTime = a.submittedAt?.toDate?.()?.getTime() || 0;
            const bTime = b.submittedAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });
          setContacts(contactsData);
          setLoading(prev => ({ ...prev, contacts: false }));
          console.log("Contacts fetched:", contactsData.length, contactsData);
        },
        (error) => {
          console.error("Error fetching contacts:", error);
          setErrors(prev => ({ ...prev, contacts: error.message || "Failed to load contacts" }));
          setLoading(prev => ({ ...prev, contacts: false }));
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up contacts query:", error);
      setErrors(prev => ({ ...prev, contacts: error.message || "Failed to set up contacts query" }));
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  }, [user]);

  // Fetch Coupons (only when authenticated)
  useEffect(() => {
    if (!user || !db) return;

    setLoading(prev => ({ ...prev, coupons: true }));
    setErrors(prev => ({ ...prev, coupons: "" }));

    try {
      const q = collection(db, "coupons");

      const unsub = onSnapshot(
        q,
        (snap) => {
          const couponsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // Sort by code alphabetically
          couponsData.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
          setCoupons(couponsData);
          setLoading(prev => ({ ...prev, coupons: false }));
          console.log("Coupons fetched:", couponsData.length);
        },
        (error) => {
          console.error("Error fetching coupons:", error);
          // Handle permission errors gracefully
          if (error.code === "permission-denied" || error.code === 7) {
            setErrors(prev => ({
              ...prev,
              coupons: "Permission denied. Please update Firestore security rules to allow read access to 'coupons' collection."
            }));
          } else {
            setErrors(prev => ({ ...prev, coupons: error.message || "Failed to load coupons" }));
          }
          setLoading(prev => ({ ...prev, coupons: false }));
          // Set empty array on error so UI doesn't break
          setCoupons([]);
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up coupons query:", error);
      if (error.code === "permission-denied" || error.code === 7) {
        setErrors(prev => ({
          ...prev,
          coupons: "Permission denied. Please update Firestore security rules to allow read access to 'coupons' collection."
        }));
      } else {
        setErrors(prev => ({ ...prev, coupons: error.message || "Failed to set up coupons query" }));
      }
      setLoading(prev => ({ ...prev, coupons: false }));
      setCoupons([]);
    }
  }, [user]);

  // Fetch Blogs (only when authenticated)
  useEffect(() => {
    if (!user || !db) return;

    setLoading(prev => ({ ...prev, blogs: true }));
    setErrors(prev => ({ ...prev, blogs: "" }));

    try {
      let q;
      try {
        q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      } catch (orderByError) {
        console.warn("orderBy failed for blogs, using simple query:", orderByError);
        q = collection(db, "blogs");
      }

      const unsub = onSnapshot(
        q,
        (snap) => {
          const blogsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          blogsData.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
            const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
            return bTime - aTime;
          });
          setBlogs(blogsData);
          setLoading(prev => ({ ...prev, blogs: false }));
          console.log("Blogs fetched:", blogsData.length);
        },
        (error) => {
          console.error("Error fetching blogs:", error);
          if (error.code === "permission-denied" || error.code === 7) {
            setErrors(prev => ({
              ...prev,
              blogs: "Permission denied. Please update Firestore security rules to allow read access to 'blogs' collection."
            }));
          } else {
            setErrors(prev => ({ ...prev, blogs: error.message || "Failed to load blogs" }));
          }
          setLoading(prev => ({ ...prev, blogs: false }));
          setBlogs([]);
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Error setting up blogs query:", error);
      if (error.code === "permission-denied" || error.code === 7) {
        setErrors(prev => ({
          ...prev,
          blogs: "Permission denied. Please update Firestore security rules to allow read access to 'blogs' collection."
        }));
      } else {
        setErrors(prev => ({ ...prev, blogs: error.message || "Failed to set up blogs query" }));
      }
      setLoading(prev => ({ ...prev, blogs: false }));
      setBlogs([]);
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "orders", id), {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    let allIds = [];
    if (activeTab === "orders") {
      allIds = paginatedOrders.map(order => order.id);
    } else if (activeTab === "newsletter") {
      allIds = paginatedNewsletters.map(sub => sub.id);
    } else if (activeTab === "contacts") {
      allIds = paginatedContacts.map(contact => contact.id);
    } else if (activeTab === "coupons") {
      allIds = paginatedCoupons.map(coupon => coupon.id);
    } else if (activeTab === "blogs") {
      allIds = paginatedBlogs.map(blog => blog.id);
    }
    setSelectedItems(allIds);
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      alert("Please select items to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      let collectionName;
      if (activeTab === "newsletter") {
        collectionName = "newsletter";
      } else if (activeTab === "coupons") {
        collectionName = "coupons";
      } else if (activeTab === "blogs") {
        collectionName = "blogs";
      } else {
        collectionName = activeTab;
      }

      if (!db) return;
      await Promise.all(
        selectedItems.map(id => deleteDoc(doc(db, collectionName, id)))
      );

      alert(`Successfully deleted ${selectedItems.length} item(s).`);
      setSelectedItems([]);
      setDeleteMode(false);
    } catch (err) {
      console.error("Error deleting items:", err);
      alert("Failed to delete some items. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Coupon management functions
  const handleCouponFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setIsSavingCoupon(true);

    try {
      const couponData = {
        code: couponForm.code.toUpperCase().trim(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        isActive: couponForm.isActive,
        usedCount: Number(couponForm.usedCount) || 0,
        createdAt: editingCoupon ? undefined : Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Add expiry date if provided
      if (couponForm.expiryDate) {
        couponData.expiryDate = Timestamp.fromDate(new Date(couponForm.expiryDate));
      }

      // Add usage limit if provided
      if (couponForm.usageLimit) {
        couponData.usageLimit = Number(couponForm.usageLimit);
      }

      if (!db) return;
      if (editingCoupon) {
        // Update existing coupon
        await updateDoc(doc(db, "coupons", editingCoupon.id), couponData);
        alert("Coupon updated successfully!");
      } else {
        // Create new coupon
        await addDoc(collection(db, "coupons"), couponData);
        alert("Coupon created successfully!");
      }

      // Reset form
      setCouponForm({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        isActive: true,
        expiryDate: "",
        usageLimit: "",
        usedCount: 0,
      });
      setShowCouponForm(false);
      setEditingCoupon(null);
    } catch (error) {
      console.error("Error saving coupon:", error);
      let errorMessage = "Failed to save coupon. Please try again.";
      if (error.code === "permission-denied" || error.code === 7) {
        errorMessage = "Permission denied. Please update Firestore security rules to allow write access to 'coupons' collection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 0,
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      expiryDate: coupon.expiryDate?.toDate ? coupon.expiryDate.toDate().toISOString().split('T')[0] : "",
      usageLimit: coupon.usageLimit || "",
      usedCount: coupon.usedCount || 0,
    });
    setShowCouponForm(true);
  };

  const handleCancelCouponForm = () => {
    setShowCouponForm(false);
    setEditingCoupon(null);
    setCouponForm({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
      expiryDate: "",
      usageLimit: "",
      usedCount: 0,
    });
  };

  const toggleCouponActive = async (couponId, currentStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "coupons", couponId), {
        isActive: !currentStatus,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error toggling coupon status:", error);
      let errorMessage = "Failed to update coupon status.";
      if (error.code === "permission-denied" || error.code === 7) {
        errorMessage = "Permission denied. Please update Firestore security rules to allow write access to 'coupons' collection.";
      }
      alert(errorMessage);
    }
  };

  // Blog handlers
  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlogContentChange = (content) => {
    setBlogForm(prev => ({ ...prev, content }));
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setIsSavingBlog(true);

    try {
      const blogData = {
        title: blogForm.title.trim(),
        content: blogForm.content,
        excerpt: blogForm.excerpt.trim() || blogForm.content.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
        author: blogForm.author.trim(),
        category: blogForm.category.trim(),
        imageUrl: blogForm.imageUrl.trim(),
        updatedAt: Timestamp.now(),
      };

      if (!db) return;
      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          createdAt: Timestamp.now(),
        });
      }

      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        category: "",
        imageUrl: "",
      });
      setShowBlogForm(false);
      setEditingBlog(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      let errorMessage = "Failed to save blog. Please try again.";
      if (error.code === "permission-denied" || error.code === 7) {
        errorMessage = "Permission denied. Please update Firestore security rules to allow write access to 'blogs' collection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      category: blog.category || "",
      imageUrl: blog.imageUrl || "",
    });
    setShowBlogForm(true);
  };

  const handleCancelBlogForm = () => {
    setShowBlogForm(false);
    setEditingBlog(null);
    setBlogForm({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      imageUrl: "",
    });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    if (!db) return;
    try {
      await deleteDoc(doc(db, "blogs", blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      let errorMessage = "Failed to delete blog.";
      if (error.code === "permission-denied" || error.code === 7) {
        errorMessage = "Permission denied. Please update Firestore security rules to allow delete access to 'blogs' collection.";
      }
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      Packed: "bg-purple-100 text-purple-800 border-purple-300",
      Shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || colors.Pending;
  };

  // Handle tab change - reset page and expanded order
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setExpandedOrder(null);
    setCurrentPage(prev => ({ ...prev, [tabId]: 1 }));
    setDeleteMode(false);
    setSelectedItems([]);
    setShowCouponForm(false);
    setEditingCoupon(null);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(prev => ({ ...prev, [activeTab]: Number(newItemsPerPage) }));
    setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
  };

  // Pagination calculations
  const getPaginatedData = (data, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data, perPage) => Math.max(1, Math.ceil(data.length / perPage));

  const paginatedOrders = getPaginatedData(orders, currentPage.orders, itemsPerPage.orders);
  const paginatedNewsletters = getPaginatedData(newsletters, currentPage.newsletter, itemsPerPage.newsletter);
  const paginatedContacts = getPaginatedData(contacts, currentPage.contacts, itemsPerPage.contacts);
  const paginatedCoupons = getPaginatedData(coupons, currentPage.coupons, itemsPerPage.coupons);
  const paginatedBlogs = getPaginatedData(blogs, currentPage.blogs, itemsPerPage.blogs);

  const totalPagesOrders = getTotalPages(orders, itemsPerPage.orders);
  const totalPagesNewsletters = getTotalPages(newsletters, itemsPerPage.newsletter);
  const totalPagesContacts = getTotalPages(contacts, itemsPerPage.contacts);
  const totalPagesCoupons = getTotalPages(coupons, itemsPerPage.coupons);
  const totalPagesBlogs = getTotalPages(blogs, itemsPerPage.blogs);

  const tabs = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "newsletter", label: "Newsletter", count: newsletters.length },
    { id: "contacts", label: "Contacts", count: contacts.length },
    { id: "coupons", label: "Coupons", count: coupons.length },
    { id: "blogs", label: "Blogs", count: blogs.length },
  ];

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    if (!auth) {
      setLoginError("Authentication service is unavailable.");
      setIsLoggingIn(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setLoginError("Invalid email or password");
      } else if (error.code === "auth/invalid-email") {
        setLoginError("Invalid email address");
      } else if (error.code === "auth/too-many-requests") {
        setLoginError("Too many failed attempts. Please try again later.");
      } else {
        setLoginError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setShowLoginModal(true);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cream to-[#f5e6d3] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee"></div>
          <p className="mt-4 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!user) {
    return (
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-coffee/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cream/50 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-linear-to-br from-coffee to-[#8b6254] rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </motion.div>
                  <h2
                    className="text-3xl font-bold text-coffee mb-2"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Admin Login
                  </h2>
                  <p
                    className="text-coffee/70 text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Please sign in to access the dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                    >
                      <p className="text-sm text-red-700" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        {loginError}
                      </p>
                    </motion.div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-semibold text-coffee mb-2"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-coffee/20 focus:border-coffee focus:outline-none transition-colors"
                      placeholder="admin@example.com"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-coffee mb-2"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-coffee/20 focus:border-coffee focus:outline-none transition-colors [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                        placeholder="••••••••"
                        style={{ fontFamily: '"Poppins", sans-serif', paddingRight: password ? '3rem' : '1rem' }}
                      />
                      {password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee/50 hover:text-coffee transition-colors p-1 focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 px-6 rounded-xl bg-linear-to-r from-coffee to-[#8b6254] text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-coffee/50" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Protected by Firebase Authentication
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cream to-[#f5e6d3] pt-20 pb-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-coffee mb-2"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              Admin Dashboard
            </h1>
            <p
              className="text-sm sm:text-base text-coffee/70"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Manage orders, newsletter subscribers, and contact submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-coffee" style={{ fontFamily: '"Poppins", sans-serif' }}>
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors text-sm"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 border-b border-coffee/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg font-semibold transition-all relative ${activeTab === tab.id
                  ? "bg-coffee text-white"
                  : "bg-white/50 text-coffee hover:bg-white/80"
                }`}
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-coffee/20 text-coffee"
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Delete Mode Controls */}
            {!loading.orders && orders.length > 0 && (
              <div className="p-4 bg-cream/30 border-b border-coffee/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleDeleteMode}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${deleteMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white text-red-500 border-red-300 border-2 hover:border-red-400 hover:bg-white/90"
                      }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {deleteMode ? "Cancel Delete" : "Delete Mode"}
                  </button>
                  {deleteMode && (
                    <>
                      <button
                        onClick={selectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
                {deleteMode && selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {isDeleting ? "Deleting..." : `Delete ${selectedItems.length} item(s)`}
                  </button>
                )}
              </div>
            )}
            {errors.orders && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Error loading orders: {errors.orders}
                </p>
              </div>
            )}
            {loading.orders ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
                <p className="mt-4 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Loading orders...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-coffee text-white">
                    <tr>
                      {deleteMode && (
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                selectAllItems();
                              } else {
                                deselectAllItems();
                              }
                            }}
                            checked={paginatedOrders.length > 0 && paginatedOrders.every(order => selectedItems.includes(order.id))}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </th>
                      )}
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Order ID</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Items</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={deleteMode ? "7" : "6"} className="px-6 py-12 text-center text-coffee/60">
                          <p style={{ fontFamily: '"Poppins", sans-serif' }}>No orders yet.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => (
                        <React.Fragment key={order.id}>
                          <tr
                            className={`hover:bg-cream/30 transition-colors ${!deleteMode ? 'cursor-pointer' : ''} ${selectedItems.includes(order.id) ? 'bg-blue-50' : ''}`}
                            onClick={() => !deleteMode && setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            {deleteMode && (
                              <td className="px-4 py-3 sm:px-6 sm:py-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(order.id)}
                                  onChange={() => toggleSelectItem(order.id)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                            )}
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="text-xs sm:text-sm font-mono text-coffee">
                                {order.id.slice(0, 8)}...
                              </div>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="text-xs sm:text-sm font-semibold text-coffee">
                                {order.deliveryAddress?.name || "N/A"}
                              </div>
                              <div className="text-xs text-coffee/70 mt-1">
                                {order.deliveryAddress?.email || ""}
                              </div>
                              <div className="text-xs text-coffee/70">
                                {order.deliveryAddress?.phone || ""}
                              </div>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="text-xs sm:text-sm text-coffee">
                                {order.totalItems || order.items?.length || 0} item(s)
                              </div>
                              <button
                                className="text-xs text-coffee/60 hover:text-coffee mt-1 underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedOrder(expandedOrder === order.id ? null : order.id);
                                }}
                              >
                                {expandedOrder === order.id ? "Hide" : "View"} details
                              </button>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="text-xs sm:text-sm font-semibold text-coffee">
                                {order.pricing?.currency || "AED"} {order.pricing?.total?.toFixed(2) || order.total?.toFixed(2) || "0.00"}
                              </div>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="text-xs text-coffee/70">
                                {order.createdAt?.toDate
                                  ? order.createdAt.toDate().toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <div className="text-xs text-coffee/60">
                                {order.createdAt?.toDate
                                  ? order.createdAt.toDate().toLocaleTimeString()
                                  : ""}
                              </div>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <select
                                value={order.status || "Pending"}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className={`px-3 py-1.5 rounded-lg border-2 text-xs sm:text-sm font-semibold cursor-pointer transition-all ${getStatusColor(order.status || "Pending")}`}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                          {expandedOrder === order.id && (
                            <tr>
                              <td colSpan={deleteMode ? "7" : "6"} className="px-4 py-4 sm:px-6 sm:py-6 bg-cream/50">
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                  {/* Delivery Address */}
                                  <div>
                                    <h4
                                      className="text-sm sm:text-base font-semibold text-coffee mb-2"
                                      style={{ fontFamily: '"Poppins", sans-serif' }}
                                    >
                                      Delivery Address
                                    </h4>
                                    <div className="text-xs sm:text-sm text-coffee/80 space-y-1">
                                      <p>{order.deliveryAddress?.name}</p>
                                      <p>{order.deliveryAddress?.landmark1}</p>
                                      <p>{order.deliveryAddress?.landmark2}</p>
                                      <p>Phone: {order.deliveryAddress?.phone}</p>
                                      <p>Email: {order.deliveryAddress?.email}</p>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h4
                                      className="text-sm sm:text-base font-semibold text-coffee mb-2"
                                      style={{ fontFamily: '"Poppins", sans-serif' }}
                                    >
                                      Order Items
                                    </h4>
                                    <div className="space-y-2">
                                      {order.items?.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between text-xs sm:text-sm text-coffee/80 bg-white/50 p-2 rounded"
                                        >
                                          <span>
                                            {item.name} × {item.quantity}
                                          </span>
                                          <span className="font-semibold">
                                            {order.pricing?.currency || "AED"} {item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-coffee/20">
                                      <div className="flex justify-between text-xs sm:text-sm text-coffee">
                                        <span>Subtotal:</span>
                                        <span>{order.pricing?.currency || "AED"} {order.pricing?.subtotal?.toFixed(2) || "0.00"}</span>
                                      </div>
                                      {order.pricing?.vatAmount > 0 && (
                                        <div className="flex justify-between text-xs sm:text-sm text-coffee">
                                          <span>VAT (5%):</span>
                                          <span>{order.pricing?.currency || "AED"} {order.pricing?.vatAmount?.toFixed(2) || "0.00"}</span>
                                        </div>
                                      )}
                                      {order.pricing?.discount > 0 && (
                                        <div className="flex justify-between text-xs sm:text-sm text-green-600">
                                          <span>Discount ({order.pricing?.appliedCoupon?.code || ""}):</span>
                                          <span>-{order.pricing?.currency || "AED"} {order.pricing?.discount?.toFixed(2)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between text-sm sm:text-base font-semibold text-coffee mt-1">
                                        <span>Total:</span>
                                        <span>{order.pricing?.currency || "AED"} {order.pricing?.total?.toFixed(2) || "0.00"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls for Orders */}
            {!loading.orders && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  {/* Left: Items per page & showing info */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Show:
                      </label>
                      <select
                        value={itemsPerPage.orders}
                        onChange={(e) => handleItemsPerPageChange(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee/20"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                    <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Showing {orders.length === 0 ? 0 : (currentPage.orders - 1) * itemsPerPage.orders + 1} to {Math.min(currentPage.orders * itemsPerPage.orders, orders.length)} of {orders.length} orders
                    </div>
                  </div>

                  {/* Right: Page navigation */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => ({ ...prev, orders: Math.max(1, prev.orders - 1) }))}
                      disabled={currentPage.orders === 1}
                      className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPagesOrders) }, (_, i) => {
                        let pageNum;
                        if (totalPagesOrders <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage.orders <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage.orders >= totalPagesOrders - 2) {
                          pageNum = totalPagesOrders - 4 + i;
                        } else {
                          pageNum = currentPage.orders - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(prev => ({ ...prev, orders: pageNum }))}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage.orders === pageNum
                                ? "bg-coffee text-white"
                                : "border border-coffee/30 text-coffee hover:bg-coffee/10"
                              }`}
                            style={{ fontFamily: '"Poppins", sans-serif' }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => ({ ...prev, orders: Math.min(totalPagesOrders, prev.orders + 1) }))}
                      disabled={currentPage.orders === totalPagesOrders}
                      className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Newsletter Tab */}
        {activeTab === "newsletter" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Delete Mode Controls */}
            {!loading.newsletter && newsletters.length > 0 && (
              <div className="p-4 bg-cream/30 border-b border-coffee/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleDeleteMode}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${deleteMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-coffee text-white hover:bg-coffee/90"
                      }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {deleteMode ? "Cancel Delete" : "Delete Mode"}
                  </button>
                  {deleteMode && (
                    <>
                      <button
                        onClick={selectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
                {deleteMode && selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {isDeleting ? "Deleting..." : `Delete ${selectedItems.length} item(s)`}
                  </button>
                )}
              </div>
            )}
            <div className="p-4 sm:p-6">
              <h2
                className="text-xl sm:text-2xl font-semibold text-coffee mb-4"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Newsletter Subscribers ({newsletters.length})
              </h2>
              {errors.newsletter && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Error loading newsletters: {errors.newsletter}
                  </p>
                </div>
              )}
              {loading.newsletter ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
                  <p className="mt-4 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Loading subscribers...
                  </p>
                </div>
              ) : paginatedNewsletters.length === 0 ? (
                <p className="text-center py-12 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No newsletter subscribers yet.
                </p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {paginatedNewsletters.map((sub) => (
                      <div
                        key={sub.id}
                        className={`p-3 sm:p-4 bg-cream/50 rounded-lg border border-coffee/20 hover:shadow-md transition-shadow ${selectedItems.includes(sub.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {deleteMode && (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(sub.id)}
                              onChange={() => toggleSelectItem(sub.id)}
                              className="w-4 h-4 cursor-pointer mt-1 shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <div className="text-sm sm:text-base font-semibold text-coffee mb-1">
                              {sub.email}
                            </div>
                            <div className="text-xs text-coffee/60">
                              Subscribed: {sub.subscribedAt?.toDate
                                ? sub.subscribedAt.toDate().toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${sub.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {sub.status || "active"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination Controls for Newsletter */}
              {!loading.newsletter && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Left: Items per page & showing info */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Show:
                        </label>
                        <select
                          value={itemsPerPage.newsletter}
                          onChange={(e) => handleItemsPerPageChange(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee/20"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Showing {newsletters.length === 0 ? 0 : (currentPage.newsletter - 1) * itemsPerPage.newsletter + 1} to {Math.min(currentPage.newsletter * itemsPerPage.newsletter, newsletters.length)} of {newsletters.length} subscribers
                      </div>
                    </div>

                    {/* Right: Page navigation */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, newsletter: Math.max(1, prev.newsletter - 1) }))}
                        disabled={currentPage.newsletter === 1}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPagesNewsletters) }, (_, i) => {
                          let pageNum;
                          if (totalPagesNewsletters <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage.newsletter <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage.newsletter >= totalPagesNewsletters - 2) {
                            pageNum = totalPagesNewsletters - 4 + i;
                          } else {
                            pageNum = currentPage.newsletter - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(prev => ({ ...prev, newsletter: pageNum }))}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage.newsletter === pageNum
                                  ? "bg-coffee text-white"
                                  : "border border-coffee/30 text-coffee hover:bg-coffee/10"
                                }`}
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, newsletter: Math.min(totalPagesNewsletters, prev.newsletter + 1) }))}
                        disabled={currentPage.newsletter === totalPagesNewsletters}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Delete Mode Controls */}
            {!loading.contacts && contacts.length > 0 && (
              <div className="p-4 bg-cream/30 border-b border-coffee/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleDeleteMode}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${deleteMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-coffee text-white hover:bg-coffee/90"
                      }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {deleteMode ? "Cancel Delete" : "Delete Mode"}
                  </button>
                  {deleteMode && (
                    <>
                      <button
                        onClick={selectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
                {deleteMode && selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {isDeleting ? "Deleting..." : `Delete ${selectedItems.length} item(s)`}
                  </button>
                )}
              </div>
            )}
            <div className="p-4 sm:p-6">
              <h2
                className="text-xl sm:text-2xl font-semibold text-coffee mb-4"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Contact Submissions ({contacts.length})
              </h2>
              {errors.contacts && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Error loading contacts: {errors.contacts}
                  </p>
                </div>
              )}
              {loading.contacts ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
                  <p className="mt-4 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Loading contacts...
                  </p>
                </div>
              ) : paginatedContacts.length === 0 ? (
                <p className="text-center py-12 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No contact submissions yet.
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 sm:p-5 bg-cream/50 rounded-lg border border-coffee/20 hover:shadow-md transition-shadow ${selectedItems.includes(contact.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                          {deleteMode && (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(contact.id)}
                              onChange={() => toggleSelectItem(contact.id)}
                              className="w-4 h-4 cursor-pointer mt-1 shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className="text-base sm:text-lg font-semibold text-coffee"
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                              >
                                {contact.name?.full || `${contact.name?.first || ""} ${contact.name?.last || ""}`.trim() || "Anonymous"}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${contact.status === "new"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {contact.status || "new"}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-coffee/80">
                              <p>
                                <span className="font-semibold">Email:</span> {contact.email}
                              </p>
                              <p>
                                <span className="font-semibold">Mobile:</span> {contact.mobile}
                              </p>
                              <p className="mt-2">
                                <span className="font-semibold">Message:</span>
                              </p>
                              <p className="text-coffee/70 bg-white/50 p-2 rounded">
                                {contact.message}
                              </p>
                            </div>
                            <div className="mt-3 text-xs text-coffee/60">
                              Submitted: {contact.submittedAt?.toDate
                                ? contact.submittedAt.toDate().toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination Controls for Contacts */}
              {!loading.contacts && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Left: Items per page & showing info */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Show:
                        </label>
                        <select
                          value={itemsPerPage.contacts}
                          onChange={(e) => handleItemsPerPageChange(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee/20"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Showing {contacts.length === 0 ? 0 : (currentPage.contacts - 1) * itemsPerPage.contacts + 1} to {Math.min(currentPage.contacts * itemsPerPage.contacts, contacts.length)} of {contacts.length} contacts
                      </div>
                    </div>

                    {/* Right: Page navigation */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, contacts: Math.max(1, prev.contacts - 1) }))}
                        disabled={currentPage.contacts === 1}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPagesContacts) }, (_, i) => {
                          let pageNum;
                          if (totalPagesContacts <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage.contacts <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage.contacts >= totalPagesContacts - 2) {
                            pageNum = totalPagesContacts - 4 + i;
                          } else {
                            pageNum = currentPage.contacts - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(prev => ({ ...prev, contacts: pageNum }))}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage.contacts === pageNum
                                  ? "bg-coffee text-white"
                                  : "border border-coffee/30 text-coffee hover:bg-coffee/10"
                                }`}
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, contacts: Math.min(totalPagesContacts, prev.contacts + 1) }))}
                        disabled={currentPage.contacts === totalPagesContacts}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Delete Mode Controls */}
            {!loading.coupons && coupons.length > 0 && (
              <div className="p-4 bg-cream/30 border-b border-coffee/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleDeleteMode}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${deleteMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white text-red-500 border-red-300 border-2 hover:border-red-400 hover:bg-white/90"
                      }`}
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {deleteMode ? "Cancel Delete" : "Delete Mode"}
                  </button>
                  {deleteMode && (
                    <>
                      <button
                        onClick={selectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllItems}
                        className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Deselect All
                      </button>
                    </>
                  )}
                </div>
                {deleteMode && selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {isDeleting ? "Deleting..." : `Delete ${selectedItems.length} item(s)`}
                  </button>
                )}
                {!deleteMode && (
                  <button
                    onClick={() => setShowCouponForm(true)}
                    className="px-4 py-2 rounded-lg bg-coffee text-white font-semibold hover:bg-[#5a3b2f] transition-all"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    + Add Coupon
                  </button>
                )}
              </div>
            )}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl sm:text-2xl font-semibold text-coffee"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Coupons ({coupons.length})
                </h2>
                {!showCouponForm && (
                  <button
                    onClick={() => setShowCouponForm(true)}
                    className="px-4 py-2 rounded-lg bg-coffee text-white font-semibold hover:bg-[#5a3b2f] transition-all text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    + Add Coupon
                  </button>
                )}
              </div>
              {errors.coupons && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p className="text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Error loading coupons: {errors.coupons}
                  </p>
                </div>
              )}

              {/* Coupon Form */}
              {showCouponForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 sm:p-6 bg-cream/30 rounded-lg border-2 border-coffee/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-coffee" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                    </h3>
                    <button
                      onClick={handleCancelCouponForm}
                      className="text-coffee hover:text-[#5a3b2f] text-xl font-light"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleSaveCoupon} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Coupon Code *
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={couponForm.code}
                          onChange={handleCouponFormChange}
                          required
                          placeholder="SAVE10"
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm uppercase"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Discount Type *
                        </label>
                        <select
                          name="discountType"
                          value={couponForm.discountType}
                          onChange={handleCouponFormChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (AED)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Discount Value *
                        </label>
                        <input
                          type="number"
                          name="discountValue"
                          value={couponForm.discountValue}
                          onChange={handleCouponFormChange}
                          required
                          min="0"
                          step="0.01"
                          placeholder={couponForm.discountType === "percentage" ? "10" : "50"}
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Expiry Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={couponForm.expiryDate}
                          onChange={handleCouponFormChange}
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Usage Limit (Optional)
                        </label>
                        <input
                          type="number"
                          name="usageLimit"
                          value={couponForm.usageLimit}
                          onChange={handleCouponFormChange}
                          min="1"
                          placeholder="100"
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Used Count
                        </label>
                        <input
                          type="number"
                          name="usedCount"
                          value={couponForm.usedCount}
                          onChange={handleCouponFormChange}
                          min="0"
                          className="w-full px-4 py-2 rounded-lg border-2 border-coffee/20 focus:border-coffee outline-none text-sm"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={couponForm.isActive}
                        onChange={handleCouponFormChange}
                        className="w-4 h-4"
                        style={{ accentColor: '#6f4a3c' }}
                      />
                      <label className="text-sm font-semibold text-coffee" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Active
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSavingCoupon}
                        className="px-6 py-2 rounded-lg bg-coffee text-white font-semibold hover:bg-[#5a3b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {isSavingCoupon ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelCouponForm}
                        className="px-6 py-2 rounded-lg border-2 border-coffee text-coffee font-semibold hover:bg-coffee/10 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {loading.coupons ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
                  <p className="mt-4 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Loading coupons...
                  </p>
                </div>
              ) : paginatedCoupons.length === 0 ? (
                <p className="text-center py-12 text-coffee/60" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  No coupons yet. Create your first coupon!
                </p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-coffee text-white">
                        <tr>
                          {deleteMode && (
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    selectAllItems();
                                  } else {
                                    deselectAllItems();
                                  }
                                }}
                                checked={paginatedCoupons.length > 0 && paginatedCoupons.every(coupon => selectedItems.includes(coupon.id))}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </th>
                          )}
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Code</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Type</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Value</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Usage</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Expiry</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedCoupons.map((coupon) => (
                          <tr
                            key={coupon.id}
                            className={`hover:bg-cream/30 transition-colors ${selectedItems.includes(coupon.id) ? 'bg-blue-50' : ''}`}
                          >
                            {deleteMode && (
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(coupon.id)}
                                  onChange={() => toggleSelectItem(coupon.id)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <div className="text-sm font-mono font-semibold text-coffee">
                                {coupon.code}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-coffee capitalize">
                                {coupon.discountType || "percentage"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-coffee">
                                {coupon.discountType === "fixed" ? "AED" : ""} {coupon.discountValue || 0}
                                {coupon.discountType === "percentage" ? "%" : ""}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleCouponActive(coupon.id, coupon.isActive)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${coupon.isActive
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                              >
                                {coupon.isActive ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-coffee">
                                {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-coffee/70">
                                {coupon.expiryDate?.toDate
                                  ? coupon.expiryDate.toDate().toLocaleDateString()
                                  : "No expiry"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEditCoupon(coupon)}
                                className="px-3 py-1 rounded-lg bg-coffee text-white text-xs font-semibold hover:bg-[#5a3b2f] transition-colors"
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Pagination Controls for Coupons */}
              {!loading.coupons && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Left: Items per page & showing info */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Show:
                        </label>
                        <select
                          value={itemsPerPage.coupons}
                          onChange={(e) => handleItemsPerPageChange(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee/20"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Showing {coupons.length === 0 ? 0 : (currentPage.coupons - 1) * itemsPerPage.coupons + 1} to {Math.min(currentPage.coupons * itemsPerPage.coupons, coupons.length)} of {coupons.length} coupons
                      </div>
                    </div>

                    {/* Right: Page navigation */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, coupons: Math.max(1, prev.coupons - 1) }))}
                        disabled={currentPage.coupons === 1}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPagesCoupons) }, (_, i) => {
                          let pageNum;
                          if (totalPagesCoupons <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage.coupons <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage.coupons >= totalPagesCoupons - 2) {
                            pageNum = totalPagesCoupons - 4 + i;
                          } else {
                            pageNum = currentPage.coupons - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(prev => ({ ...prev, coupons: pageNum }))}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage.coupons === pageNum
                                  ? "bg-coffee text-white"
                                  : "border border-coffee/30 text-coffee hover:bg-coffee/10"
                                }`}
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, coupons: Math.min(totalPagesCoupons, prev.coupons + 1) }))}
                        disabled={currentPage.coupons === totalPagesCoupons}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <motion.div
            key="blogs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-coffee/10">
              {/* Header */}
              <div className="bg-linear-to-r from-coffee to-[#8b6254] p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Blog Management
                    </h2>
                    <p className="text-sm text-white/80" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      Create and manage your blog posts
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!loading.blogs && blogs.length > 0 && (
                      <button
                        onClick={toggleDeleteMode}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${deleteMode
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white/90 text-coffee hover:bg-white"
                          }`}
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {deleteMode ? "Cancel Delete" : "Delete Mode"}
                      </button>
                    )}
                    <button
                      onClick={() => setShowBlogForm(true)}
                      className="px-6 py-3 bg-white text-coffee rounded-xl font-semibold hover:bg-cream transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      + New Blog Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Mode Controls */}
              {deleteMode && !loading.blogs && blogs.length > 0 && (
                <div className="p-4 bg-cream/30 border-b border-coffee/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={selectAllItems}
                      className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllItems}
                      className="px-3 py-2 rounded-lg text-sm border border-coffee/30 text-coffee hover:bg-coffee/10 transition-colors"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Deselect All
                    </button>
                  </div>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {isDeleting ? "Deleting..." : `Delete ${selectedItems.length} item(s)`}
                    </button>
                  )}
                </div>
              )}

              {/* Blog List */}
              {loading.blogs ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee"></div>
                </div>
              ) : errors.blogs ? (
                <div className="p-6 text-center">
                  <p className="text-red-600 mb-4">{errors.blogs}</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-coffee/70 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    No blogs yet. Create your first blog post!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-coffee/5">
                      <tr>
                        {deleteMode && (
                          <th className="px-4 py-3 text-center" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  selectAllItems();
                                } else {
                                  deselectAllItems();
                                }
                              }}
                              checked={paginatedBlogs.length > 0 && paginatedBlogs.every(blog => selectedItems.includes(blog.id))}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-coffee uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-coffee uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Author
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-coffee uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-coffee uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-coffee uppercase tracking-wider" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-coffee/10">
                      {paginatedBlogs.map((blog) => (
                        <tr
                          key={blog.id}
                          className={`hover:bg-coffee/5 transition-colors ${selectedItems.includes(blog.id) ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                            }`}
                        >
                          {deleteMode && (
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(blog.id)}
                                onChange={() => toggleSelectItem(blog.id)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </td>
                          )}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {blog.imageUrl && (
                                <img
                                  src={blog.imageUrl}
                                  alt={blog.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-coffee line-clamp-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                  {blog.title}
                                </div>
                                <div className="text-xs text-coffee/60 line-clamp-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                  {blog.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-coffee" style={{ fontFamily: '"Poppins", sans-serif' }}>
                              {blog.author || "Anonymous"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-coffee/10 text-coffee text-xs rounded-full font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                              {blog.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                              {blog.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="px-3 py-1 rounded-lg bg-coffee text-white text-xs font-semibold hover:bg-[#5a3b2f] transition-colors"
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading.blogs && blogs.length > 0 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-coffee/70 whitespace-nowrap" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Show:
                        </label>
                        <select
                          value={itemsPerPage.blogs}
                          onChange={(e) => {
                            setItemsPerPage(prev => ({ ...prev, blogs: Number(e.target.value) }));
                            setCurrentPage(prev => ({ ...prev, blogs: 1 }));
                          }}
                          className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee/20"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <div className="text-sm text-coffee/70" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Showing {(currentPage.blogs - 1) * itemsPerPage.blogs + 1} to {Math.min(currentPage.blogs * itemsPerPage.blogs, blogs.length)} of {blogs.length} blogs
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, blogs: Math.max(1, prev.blogs - 1) }))}
                        disabled={currentPage.blogs === 1}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPagesBlogs) }, (_, i) => {
                          let pageNum;
                          if (totalPagesBlogs <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage.blogs <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage.blogs >= totalPagesBlogs - 2) {
                            pageNum = totalPagesBlogs - 4 + i;
                          } else {
                            pageNum = currentPage.blogs - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(prev => ({ ...prev, blogs: pageNum }))}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage.blogs === pageNum
                                  ? "bg-coffee text-white"
                                  : "border border-coffee/30 text-coffee hover:bg-coffee/10"
                                }`}
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => ({ ...prev, blogs: Math.min(totalPagesBlogs, prev.blogs + 1) }))}
                        disabled={currentPage.blogs === totalPagesBlogs}
                        className="px-3 py-1.5 rounded-lg border border-coffee/30 text-coffee hover:bg-coffee hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Blog Form Modal */}
        <AnimatePresence>
          {showBlogForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={handleCancelBlogForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-cream rounded-2xl shadow-2xl max-w-4xl w-full my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-linear-to-r from-coffee to-[#8b6254] p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                    </h3>
                    <button
                      onClick={handleCancelBlogForm}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                  <form onSubmit={handleSaveBlog} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={blogForm.title}
                        onChange={handleBlogFormChange}
                        required
                        className="w-full px-4 py-3 border-2 border-coffee/20 rounded-lg focus:outline-none focus:border-coffee transition-colors text-lg"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                        placeholder="Enter blog title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Content *
                      </label>
                      <div className="border-2 border-coffee/20 rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={blogForm.content}
                          onChange={handleBlogContentChange}
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, 4, 5, 6, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              [{ align: [] }],
                              ['link', 'image'],
                              [{ color: [] }, { background: [] }],
                              ['blockquote', 'code-block'],
                              ['clean'],
                            ],
                          }}
                          formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike',
                            'list',
                            'align',
                            'link', 'image',
                            'color', 'background',
                            'blockquote', 'code-block',
                          ]}
                          style={{ minHeight: '300px', fontFamily: '"Poppins", sans-serif' }}
                          placeholder="Write your blog content here..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Excerpt (Optional)
                      </label>
                      <textarea
                        name="excerpt"
                        value={blogForm.excerpt}
                        onChange={handleBlogFormChange}
                        rows={3}
                        className="w-full px-4 py-2 border-2 border-coffee/20 rounded-lg focus:outline-none focus:border-coffee transition-colors resize-vertical"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                        placeholder="Short description (auto-generated if empty)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Author *
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={blogForm.author}
                          onChange={handleBlogFormChange}
                          required
                          className="w-full px-4 py-2 border-2 border-coffee/20 rounded-lg focus:outline-none focus:border-coffee transition-colors"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                          placeholder="Author name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                          Category *
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={blogForm.category}
                          onChange={handleBlogFormChange}
                          required
                          className="w-full px-4 py-2 border-2 border-coffee/20 rounded-lg focus:outline-none focus:border-coffee transition-colors"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                          placeholder="e.g., Skin Care"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-coffee mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Featured Image URL *
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={blogForm.imageUrl}
                        onChange={handleBlogFormChange}
                        required
                        className="w-full px-4 py-2 border-2 border-coffee/20 rounded-lg focus:outline-none focus:border-coffee transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                        placeholder="https://example.com/image.jpg"
                      />
                      {blogForm.imageUrl && (
                        <img
                          src={blogForm.imageUrl}
                          alt="Preview"
                          className="mt-2 w-full h-48 object-cover rounded-lg"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSavingBlog}
                        className="flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-coffee to-[#8b6254] text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {isSavingBlog ? "Saving..." : editingBlog ? "Update Blog" : "Publish Blog"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelBlogForm}
                        className="px-6 py-3 rounded-xl border-2 border-coffee/30 text-coffee font-semibold hover:bg-coffee/5 transition-colors"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
