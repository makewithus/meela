import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { addDoc, collection, Timestamp, query, where, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const PRICE_PER = 55; // AED (VAT included)
const VAT_PERCENT = 5; // 5% VAT included in price

const Checkout = () => {
  const { cartItems, updateQty, removeFromCart, clearCart, isCheckoutOpen, closeCheckout, getTotalPrice } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    landmark1: "",
    landmark2: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [orderData, setOrderData] = useState(null); // Store order data for PDF

  // Prevent body scroll when checkout is open
  useEffect(() => {
    if (isCheckoutOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Also prevent scroll on html
      document.documentElement.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isCheckoutOpen]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Validate and apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    if (!db) {
      setCouponError("Coupon system is unavailable offline.");
      setCouponLoading(false);
      return;
    }

    try {
      const couponQuery = query(
        collection(db, "coupons"),
        where("code", "==", couponCode.toUpperCase().trim()),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(couponQuery);

      if (querySnapshot.empty) {
        setCouponError("Invalid or expired coupon code");
        setAppliedCoupon(null);
        return;
      }

      const couponDoc = querySnapshot.docs[0];
      const couponData = couponDoc.data();

      // Check if coupon is expired
      const now = new Date();
      if (couponData.expiryDate && couponData.expiryDate.toDate() < now) {
        setCouponError("This coupon has expired");
        setAppliedCoupon(null);
        return;
      }

      // Check if coupon has usage limit
      if (couponData.usageLimit && couponData.usedCount >= couponData.usageLimit) {
        setCouponError("This coupon has reached its usage limit");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(couponData);
      setCouponError("");
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Error validating coupon. Please try again.");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Calculate pricing with VAT included in base price and coupon
  const calculatePricing = () => {
    const total = getTotalPrice(); // Total already includes VAT
    // Calculate VAT amount that's included in the price
    // If price is 55 AED with 5% VAT, base price = 55 / 1.05 = 52.38, VAT = 2.62
    const basePrice = total / (1 + VAT_PERCENT / 100);
    const vatAmount = total - basePrice;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        discount = (total * appliedCoupon.discountValue) / 100;
      } else if (appliedCoupon.discountType === "fixed") {
        discount = appliedCoupon.discountValue;
      }
      // Ensure discount doesn't exceed total
      if (discount > total) {
        discount = total;
      }
    }

    const finalTotal = total - discount;
    return {
      subtotal: basePrice,
      vatAmount,
      subtotalWithVAT: total,
      discount,
      total: finalTotal,
      appliedCoupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue
      } : null
    };
  };

  // Generate PDF Bill
  const generatePDF = (orderInfo) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Company Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("MEELA HAIR OIL", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Invoice / Bill", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Order Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Order ID:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(orderInfo.orderId, margin + 30, yPos);
    yPos += 7;

    doc.setFont("helvetica", "bold");
    doc.text("Date:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), margin + 30, yPos);
    yPos += 10;

    // Delivery Address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Delivery Address:", margin, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${orderInfo.deliveryAddress.name}`, margin, yPos);
    yPos += 6;
    doc.text(`Phone: ${orderInfo.deliveryAddress.phone}`, margin, yPos);
    yPos += 6;
    doc.text(`Email: ${orderInfo.deliveryAddress.email}`, margin, yPos);
    yPos += 6;
    doc.text(`Address: ${orderInfo.deliveryAddress.landmark1}`, margin, yPos);
    yPos += 6;
    doc.text(`${orderInfo.deliveryAddress.landmark2}`, margin, yPos);
    yPos += 10;

    // Items Table Header - Adjusted positions to fit within page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Items", margin, yPos);
    doc.text("Qty", margin + 60, yPos);
    doc.text("Price", margin + 85, yPos);
    doc.text("VAT", margin + 120, yPos);
    doc.text("Total", margin + 150, yPos);
    yPos += 7;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // Items
    doc.setFont("helvetica", "normal");
    orderInfo.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      // Calculate VAT included in price
      const itemBase = itemTotal / (1 + VAT_PERCENT / 100);
      const itemVAT = itemTotal - itemBase;

      // Truncate item name if too long
      const itemName = item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name;
      doc.text(itemName, margin, yPos);
      doc.text(item.quantity.toString(), margin + 60, yPos);
      doc.text(`AED ${item.price.toFixed(2)}`, margin + 85, yPos);
      doc.text(`AED ${itemVAT.toFixed(2)}`, margin + 120, yPos);
      doc.text(`AED ${itemTotal.toFixed(2)}`, margin + 150, yPos);
      yPos += 7;

      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }
    });

    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Pricing Summary - Right aligned
    const summaryStartX = pageWidth - margin - 60; // 60mm from right edge
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal (excl. VAT):", summaryStartX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`AED ${orderInfo.pricing.subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 7;

    doc.setFont("helvetica", "bold");
    doc.text("VAT (5% incl.):", summaryStartX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`AED ${orderInfo.pricing.vatAmount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 7;

    if (orderInfo.pricing.discount > 0) {
      const discountLabel = `Discount (${orderInfo.pricing.appliedCoupon?.code || ""}):`;
      // Truncate if too long
      const shortLabel = discountLabel.length > 25 ? discountLabel.substring(0, 22) + "..." : discountLabel;
      doc.setFont("helvetica", "bold");
      doc.text(shortLabel, summaryStartX, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`-AED ${orderInfo.pricing.discount.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 7;
    }

    doc.line(summaryStartX, yPos, pageWidth - margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total:", summaryStartX, yPos);
    doc.text(`AED ${orderInfo.pricing.total.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 10;

    // Payment Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Payment Mode: ${orderInfo.payment.mode}`, margin, yPos);
    yPos += 10;

    // Footer
    doc.setFontSize(9);
    doc.text("Thank you for shopping with Meela!", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text("For any queries, contact us via WhatsApp or Email", pageWidth / 2, yPos, { align: "center" });

    // Save PDF
    doc.save(`Meela_Invoice_${orderInfo.orderId}.pdf`);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (isAddressComplete) {
      const newAddress = { ...form, id: Date.now() };
      setAddresses([...addresses, newAddress]);
      setSelectedAddressIndex(addresses.length);
      setForm({ name: "", phone: "", email: "", landmark1: "", landmark2: "" });
      setShowForm(false);
    }
  };

  const handleDeleteAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(newAddresses.length > 0 ? 0 : null);
    } else if (selectedAddressIndex > index) {
      setSelectedAddressIndex(selectedAddressIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    setLoading(true);
    try {
      const pricing = calculatePricing();

      // Structure order data properly for Firestore
      const order = {
        // Delivery Address Details
        deliveryAddress: {
          name: selectedAddress.name || "",
          phone: selectedAddress.phone || "",
          email: selectedAddress.email || "",
          landmark1: selectedAddress.landmark1 || "",
          landmark2: selectedAddress.landmark2 || "",
        },
        // Order Items - store complete item details with VAT included
        items: cartItems.map(item => {
          const itemTotal = item.price * item.qty;
          const itemBase = itemTotal / (1 + VAT_PERCENT / 100);
          const itemVAT = itemTotal - itemBase;
          return {
            id: item.id,
            name: item.name || "",
            price: item.price || 0,
            quantity: item.qty || 0,
            subtotal: itemBase,
            vat: itemVAT,
            total: itemTotal,
          };
        }),
        // Pricing Details
        pricing: {
          subtotal: pricing.subtotal,
          vatAmount: pricing.vatAmount,
          subtotalWithVAT: pricing.subtotalWithVAT,
          discount: pricing.discount,
          total: pricing.total,
          currency: "AED",
          appliedCoupon: pricing.appliedCoupon,
        },
        // Payment Information
        payment: {
          mode: "Cash on Delivery",
          status: "Pending",
        },
        // Order Status
        status: "Pending",
        // Timestamps
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Additional metadata
        totalItems: cartItems.reduce((sum, item) => sum + (item.qty || 0), 0),
      };

      // Validate order data before saving
      if (!order.deliveryAddress.name || !order.deliveryAddress.phone || !order.deliveryAddress.email) {
        throw new Error("Delivery address information is incomplete.");
      }

      if (!order.items || order.items.length === 0) {
        throw new Error("Cart is empty. Please add items to cart.");
      }

      if (!db) {
        throw new Error("Order system is unavailable offline. Please contact us via WhatsApp to place your order.");
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "orders"), order);
      console.log("Order placed successfully with ID:", docRef.id);

      // Store order data for PDF generation
      setOrderData({
        orderId: docRef.id,
        deliveryAddress: order.deliveryAddress,
        items: order.items,
        pricing: order.pricing,
        payment: order.payment,
        createdAt: new Date().toLocaleString(),
      });

      setDone(true);
      clearCart();
      // Reset addresses and form after successful order
      setAddresses([]);
      setSelectedAddressIndex(null);
      setForm({ name: "", phone: "", email: "", landmark1: "", landmark2: "" });
      setCouponCode("");
      setAppliedCoupon(null);
    } catch (err) {
      console.error("Error placing order:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);

      // Provide user-friendly error messages
      let errorMessage = "Unable to place order at this time. Please try again later.";

      // Check for permission errors (Firebase uses different error codes)
      if (err.code === "permission-denied" ||
        err.code === 7 ||
        err.message?.toLowerCase().includes("permission") ||
        err.message?.toLowerCase().includes("insufficient")) {
        errorMessage = "Unable to process your order. Please contact support or try again later.";
        // Log detailed error for debugging
        console.error("Firestore permission error detected. Please deploy firestore.rules file to Firebase Console.");
      } else if (err.code === "unavailable" ||
        err.code === 14 ||
        err.message?.toLowerCase().includes("network") ||
        err.message?.toLowerCase().includes("unavailable")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (err.message && !err.message.includes("permission") && !err.message.includes("insufficient")) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isCheckoutOpen) return null;

  // Check if address form is filled
  const isAddressComplete = form.name && form.phone && form.email && form.landmark1 && form.landmark2;

  // Get selected address
  const selectedAddress = selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={closeCheckout}
            onTouchMove={(e) => {
              // Prevent scroll on touch devices when touching backdrop
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] lg:w-[550px] bg-white shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 flex items-center justify-between z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl text-[#4a4a4a]" style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600 }}>
                CART
              </h2>
              <button onClick={closeCheckout} className="text-2xl sm:text-3xl text-[#4a4a4a] hover:text-[#333] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center font-light leading-none active:scale-95">
                ×
              </button>
            </div>

            {done ? (
              <div className="p-4 sm:p-5 md:p-6 flex items-center justify-center min-h-[400px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-br from-[#d4edda] to-[#c3e6cb] border-2 border-[#5cb85c] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center w-full max-w-md shadow-xl"
                >
                  {/* Animated Success Checkmark */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2
                      }}
                      className="relative"
                    >
                      {/* Outer Circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 12,
                          delay: 0.1
                        }}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#5cb85c] rounded-full flex items-center justify-center shadow-lg mx-auto"
                      >
                        {/* Inner Circle Pulse Animation */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 bg-[#5cb85c] rounded-full"
                        />

                        {/* Checkmark */}
                        <motion.svg
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.4,
                            ease: "easeInOut"
                          }}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white relative z-10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            d="M20 6L9 17l-5-5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.5,
                              ease: "easeInOut"
                            }}
                          />
                        </motion.svg>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Success Message */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-xl sm:text-2xl md:text-3xl text-[#155724] mb-2 sm:mb-3 font-bold"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Order Successful!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-xs sm:text-sm md:text-base text-[#155724]/90 mb-4 sm:mb-6 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Thank you for choosing Meela. We've received your order and will confirm it shortly via WhatsApp or email.
                  </motion.p>

                  <div className="space-y-3">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generatePDF(orderData)}
                      className="w-full px-6 sm:px-8 py-3 sm:py-3.5 bg-white border-2 border-[#6f4a3c] text-[#6f4a3c] rounded-lg sm:rounded-xl font-semibold hover:bg-[#6f4a3c]/5 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] shadow-md hover:shadow-lg"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Download Invoice (PDF)
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setDone(false); setOrderData(null); closeCheckout(); }}
                      className="w-full px-6 sm:px-8 py-3 sm:py-3.5 bg-[#5cb85c] text-white rounded-lg sm:rounded-xl font-semibold hover:bg-[#4a9d4a] transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] shadow-md hover:shadow-lg"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="p-4 sm:p-5 md:p-6 text-center py-12 sm:py-14 md:py-16">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
                <h3 className="text-lg sm:text-xl text-[#4a4a4a] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Your cart is empty
                </h3>
                <p className="text-xs sm:text-sm text-[#6a6a6a] mb-5 sm:mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Add some products to get started
                </p>
                <button onClick={closeCheckout} className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#6f4a3c] text-white rounded-lg font-semibold hover:bg-[#5a3b2f] transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] active:scale-95" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => {
                    const itemTotal = item.price * item.qty;
                    return (
                      <div key={item.id} className="flex gap-2 sm:gap-3 md:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#d4b5a0] to-[#c9a88a] flex items-center justify-center flex-shrink-0">
                          <img src="https://res.cloudinary.com/dvaxoo30e/image/upload/v1764617790/cart_tbhbky.webp" alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-[#4a4a4a] mb-1 truncate" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            {item.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-[#6a6a6a] mb-1.5 sm:mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            Price: AED {item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-xs text-[#6a6a6a]" style={{ fontFamily: '"Poppins", sans-serif' }}>Qty:</span>
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 sm:w-7 sm:h-7 border border-gray-300 rounded flex items-center justify-center text-xs sm:text-sm hover:bg-gray-100 transition-colors font-medium active:scale-95 min-h-[32px] sm:min-h-[36px]">−</button>
                            <span className="text-xs sm:text-sm font-medium min-w-[28px] sm:min-w-[35px] text-center" style={{ fontFamily: '"Poppins", sans-serif' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 sm:w-7 sm:h-7 border border-gray-300 rounded flex items-center justify-center text-xs sm:text-sm hover:bg-gray-100 transition-colors font-medium active:scale-95 min-h-[32px] sm:min-h-[36px]">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="ml-auto text-[10px] sm:text-xs text-red-600 hover:text-red-800 font-medium active:scale-95" style={{ fontFamily: '"Poppins", sans-serif' }}>Remove</button>
                          </div>
                          <p className="text-[10px] sm:text-xs text-[#4a4a4a] mt-1.5 sm:mt-2 font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
                            Subtotal: AED {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Section */}
                <div className="pb-4 sm:pb-5 md:pb-6 border-b border-gray-200">
                  <p className="text-xs sm:text-sm text-[#6a6a6a] mb-2 sm:mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Have a coupon code?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      disabled={!!appliedCoupon || couponLoading}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px] uppercase"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-xs sm:text-sm min-h-[44px] sm:min-h-[48px] active:scale-95"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#6f4a3c] text-white rounded-lg font-semibold hover:bg-[#5a3b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-h-[44px] sm:min-h-[48px] active:scale-95"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-[10px] sm:text-xs text-red-600 mt-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {couponError}
                    </p>
                  )}
                  {appliedCoupon && (
                    <p className="text-[10px] sm:text-xs text-green-600 mt-2 font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      ✓ Coupon "{appliedCoupon.code}" applied successfully!
                    </p>
                  )}
                </div>

                {/* Delivery Address Section */}
                <div className="pb-4 sm:pb-5 md:pb-6 border-b border-gray-200">
                  <p className="text-xs sm:text-sm text-[#6a6a6a] mb-2 sm:mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>Please add your delivery address</p>

                  {/* Saved Addresses List */}
                  {addresses.length > 0 && (
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      {addresses.map((address, index) => (
                        <div
                          key={address.id}
                          className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressIndex === index
                              ? "bg-gray-50 border-[#6f4a3c]"
                              : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => setSelectedAddressIndex(index)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                <input
                                  type="radio"
                                  checked={selectedAddressIndex === index}
                                  onChange={() => setSelectedAddressIndex(index)}
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                  style={{ accentColor: '#6f4a3c' }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <p className="text-xs sm:text-sm font-semibold text-[#4a4a4a]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                  {address.name}
                                </p>
                              </div>
                              <p className="text-[10px] sm:text-xs text-[#6a6a6a] mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>{address.landmark1}</p>
                              <p className="text-[10px] sm:text-xs text-[#6a6a6a] mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>{address.landmark2}</p>
                              <p className="text-[10px] sm:text-xs text-[#6a6a6a] mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>Phone: {address.phone}</p>
                              <p className="text-[10px] sm:text-xs text-[#6a6a6a]" style={{ fontFamily: '"Poppins", sans-serif' }}>Email: {address.email}</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(index);
                              }}
                              className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium active:scale-95 flex-shrink-0 ml-2"
                              style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Address Button */}
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full py-2.5 sm:py-3 border-2 border-[#4a4a4a] text-[#4a4a4a] rounded-lg font-semibold hover:bg-gray-50 transition-colors text-xs sm:text-sm min-h-[44px] sm:min-h-[48px] active:scale-95"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    + Add Address
                  </button>

                  {/* Delivery Form - Show below Add Address button when showForm is true */}
                  {showForm && (
                    <form id="delivery-form" onSubmit={handleSaveAddress} className="space-y-2.5 sm:space-y-3 mt-3 sm:mt-4">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-[#4a4a4a]" style={{ fontFamily: '"Poppins", sans-serif' }}>Delivery Details</h3>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="text-[#6a6a6a] hover:text-[#4a4a4a] text-lg sm:text-xl font-light leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px]"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="Mobile No"
                        type="tel"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px]"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      />
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Email"
                        type="email"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px]"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      />
                      <input
                        name="landmark1"
                        value={form.landmark1}
                        onChange={handleChange}
                        required
                        placeholder="Address Landmark 1"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px]"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      />
                      <input
                        name="landmark2"
                        value={form.landmark2}
                        onChange={handleChange}
                        required
                        placeholder="Address Landmark 2"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-[#6f4a3c] outline-none text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[48px]"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      />

                      <button
                        type="submit"
                        disabled={loading || !isAddressComplete}
                        className="w-full py-2.5 sm:py-3 bg-[#6f4a3c] text-white rounded-lg font-semibold hover:bg-[#5a3b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-h-[44px] sm:min-h-[48px] active:scale-95 mt-2"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {loading ? "Processing..." : "Save Address"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pb-4 sm:pb-5 md:pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-xs sm:text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    <span className="text-[#6a6a6a]">Subtotal (excl. VAT):</span>
                    <span className="text-[#4a4a4a] font-semibold">AED {calculatePricing().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    <span className="text-[#6a6a6a]">VAT (5% incl.):</span>
                    <span className="text-[#4a4a4a] font-semibold">AED {calculatePricing().vatAmount.toFixed(2)}</span>
                  </div>
                  {calculatePricing().discount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
                      <span className="text-green-600 font-medium">
                        Discount {appliedCoupon?.discountType === "percentage" ? `(${appliedCoupon.discountValue}%)` : ""} ({appliedCoupon?.code}):
                      </span>
                      <span className="text-green-600 font-semibold">-AED {calculatePricing().discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base sm:text-lg font-bold pt-1.5 sm:pt-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    <span className="text-[#4a4a4a]">Total:</span>
                    <span className="text-[#4a4a4a]">AED {calculatePricing().total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Mode Section */}
                <div className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#4a4a4a] mb-2 sm:mb-3 uppercase" style={{ fontFamily: '"Poppins", sans-serif' }}>Payment Mode</p>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ accentColor: '#6f4a3c' }} />
                    <div style={{ fontFamily: '"Poppins", sans-serif' }}>
                      <p className="text-xs sm:text-sm font-semibold text-[#4a4a4a]">Cash on Delivery</p>
                      <p className="text-[10px] sm:text-xs text-[#6a6a6a]">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>

                {/* Proceed to Pay Button */}
                {selectedAddress && !showForm && (
                  <div className="pt-1.5 sm:pt-2 pb-3 sm:pb-4">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e)}
                      disabled={loading}
                      className="w-full py-3 sm:py-3.5 md:py-4 bg-[#4a4a4a] text-white rounded-lg font-semibold hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-h-[44px] sm:min-h-[48px] active:scale-95"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {loading ? "Processing..." : "Proceed to Pay"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout;
