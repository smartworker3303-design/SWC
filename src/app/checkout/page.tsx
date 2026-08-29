"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  Package, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  MapPin, 
  Phone, 
  User, 
  Building, 
  Home, 
  Compass, 
  FileText,
  AlertCircle
} from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import { Order, OrderItem, ShippingDetails } from "../../supabase";

const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Peshawar",
  "Multan",
  "Gujranwala",
  "Sialkot",
  "Hyderabad",
  "Quetta",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Mardan",
  "Gujrat",
  "Rahim Yar Khan",
  "Sahiwal",
  "Wah Cantt",
  "Kasur",
  "Dera Ghazi Khan",
  "Mirpur (AJK)",
  "Muzaffarabad",
  "Gilgit",
  "Skardu",
  "Other"
];

const PROVINCES = [
  "Sindh",
  "Punjab",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan"
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const rawProductId = searchParams.get("productId") || "";
  const initialColor = searchParams.get("color") || "";
  const initialQty = parseInt(searchParams.get("qty") || "1", 10);

  // Selected Product State
  const decodedProductId = decodeURIComponent(rawProductId).trim();
  const product = products.find(p => 
    p.id === rawProductId || 
    p.id === decodedProductId || 
    p.id.toLowerCase() === decodedProductId.toLowerCase()
  ) || products[0];

  const [quantity, setQuantity] = useState(Math.max(1, isNaN(initialQty) ? 1 : initialQty));
  const [selectedColor, setSelectedColor] = useState(initialColor);

  // Address & Contact Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartmentSuite, setApartmentSuite] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Karachi");
  const [customCity, setCustomCity] = useState("");
  const [province, setProvince] = useState("Sindh");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");

  // Discount code state
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; description: string } | null>(null);
  const [discountError, setDiscountError] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Auto-fill logged in user information
  useEffect(() => {
    if (user) {
      if (user.full_name && !fullName) setFullName(user.full_name);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Sync color if product has colors
  useEffect(() => {
    if (product) {
      if (initialColor && product.colors?.some(c => c.toLowerCase() === initialColor.toLowerCase())) {
        setSelectedColor(initialColor);
      } else if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product, initialColor]);

  // Calculate pricing
  const unitPrice = product ? product.price : 0;
  const subtotal = unitPrice * quantity;
  const deliveryFee = 0; // Free delivery nationwide
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Handle discount code application
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    setDiscountError("");

    if (!code) {
      setDiscountError("Please enter a discount code.");
      return;
    }

    if (code === "SWC10" || code === "WELCOME10") {
      const discount = Math.round(subtotal * 0.10);
      setAppliedDiscount({
        code,
        amount: discount,
        description: "10% Special Privilege Discount"
      });
    } else if (code === "SALEEM" || code === "VIP500") {
      const discount = Math.min(500, subtotal);
      setAppliedDiscount({
        code,
        amount: discount,
        description: "Rs. 500 VIP Voucher Applied"
      });
    } else {
      setDiscountError("Invalid discount code. Try 'SWC10' or 'SALEEM'.");
    }
  };

  // Handle Order Submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (!product) {
      setOrderError("No product selected for order.");
      return;
    }

    if (!fullName.trim()) {
      setOrderError("Please enter your full recipient name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setOrderError("Please enter an active 11-digit mobile/WhatsApp phone number.");
      return;
    }

    if (!streetAddress.trim()) {
      setOrderError("Please enter your complete street address / house or building number.");
      return;
    }

    if (!landmark.trim()) {
      setOrderError("Please enter a nearby landmark or famous place to help the courier deliver accurately.");
      return;
    }

    const finalCity = city === "Other" ? (customCity.trim() || "Pakistan") : city;

    const finalFullAddress = [
      streetAddress.trim(),
      apartmentSuite.trim() ? `Apt/Floor: ${apartmentSuite.trim()}` : "",
      landmark.trim() ? `(Near: ${landmark.trim()})` : "",
      finalCity,
      province,
      postalCode.trim() ? `Postal Code: ${postalCode.trim()}` : ""
    ].filter(Boolean).join(", ");

    const shippingDetails: ShippingDetails = {
      recipient_name: fullName.trim(),
      phone: phone.trim(),
      alt_phone: altPhone.trim() || undefined,
      email: email.trim() || user?.email || undefined,
      street_address: streetAddress.trim(),
      apartment_suite: apartmentSuite.trim() || undefined,
      landmark: landmark.trim(),
      city: finalCity,
      province,
      postal_code: postalCode.trim() || undefined,
      order_notes: orderNotes.trim() || undefined
    };

    const orderItem: OrderItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor || undefined,
      image: product.image,
      category: product.category
    };

    const newOrderId = "SWC-" + Math.random().toString(36).substring(2, 7).toUpperCase() + Date.now().toString().slice(-4);

    const orderPayload: Order = {
      id: newOrderId,
      user_id: user?.id || user?.email || "guest_" + phone.trim().replace(/\D/g, ""),
      customer_name: fullName.trim(),
      items: [orderItem],
      total_amount: totalAmount,
      discount_amount: discountAmount > 0 ? discountAmount : undefined,
      delivery_fee: deliveryFee,
      payment_method: paymentMethod,
      status: "Pending",
      shipping_address: finalFullAddress,
      shipping_details: shippingDetails,
      phone: phone.trim(),
      email: email.trim() || user?.email || undefined,
      created_at: new Date().toISOString()
    };

    try {
      setIsSubmitting(true);
      await addOrder(orderPayload);
      setCompletedOrder(orderPayload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProductsLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Checkout...</p>
      </div>
    );
  }

  // =========================================================================
  // SUCCESS SCREEN AFTER ORDER PLACEMENT
  // =========================================================================
  if (completedOrder) {
    const item = completedOrder.items[0];
    const details = completedOrder.shipping_details;
    const whatsappMsg = encodeURIComponent(
      `*Saleem Watch Center - Order Confirmation*\n\n` +
      `*Order ID:* ${completedOrder.id}\n` +
      `*Item:* ${item?.name} (ID: ${item?.product_id})\n` +
      (item?.color ? `*Colour:* ${item.color}\n` : "") +
      `*Quantity:* ${item?.quantity}\n` +
      `*Total Amount:* Rs. ${completedOrder.total_amount.toLocaleString()}\n` +
      `*Payment:* Cash on Delivery (COD)\n\n` +
      `*Customer:* ${details?.recipient_name || completedOrder.customer_name}\n` +
      `*Phone:* ${completedOrder.phone}\n` +
      `*Address:* ${completedOrder.shipping_address}\n\n` +
      `Please confirm my order dispatch. Thank you!`
    );

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-screen text-left">
        {/* Success Header */}
        <div className="glass-panel border border-gold-500/30 p-8 sm:p-10 rounded-xl text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600" />
          
          <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.3)]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-gold-400">Order Placed Successfully</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Your order has been received by Saleem Watch Center. Our team will verify and dispatch your timepiece with insured nationwide delivery.
            </p>
          </div>

          <div className="inline-block bg-black/60 border border-gold-500/30 px-4 py-2 rounded font-mono text-sm font-bold text-gold-300">
            Order Reference: <span className="text-white">{completedOrder.id}</span>
          </div>

          {/* Quick WhatsApp Concierge Button */}
          <div className="pt-2">
            <a
              href={`https://wa.me/923212200321?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-6 py-3.5 rounded shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              Confirm Instantly on WhatsApp (+92 321 2200321)
            </a>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="glass-panel border border-gold-500/15 p-6 sm:p-8 rounded-lg space-y-6">
          <h3 className="font-serif text-lg font-bold text-white border-b border-gold-500/10 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-gold-500" />
            Order Summary & Delivery Details
          </h3>

          {/* Ordered Item Row */}
          <div className="flex items-center gap-4 bg-black/40 border border-gold-500/10 p-4 rounded-md">
            {item?.image && (
              <div className="relative w-20 h-20 bg-black rounded overflow-hidden flex-shrink-0 border border-gold-500/20">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-grow space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-serif text-sm font-bold text-white">{item?.name}</h4>
                <span className="font-serif text-sm font-bold text-gold-400">Rs. {(item?.price * item?.quantity).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
                <span className="font-mono text-gold-500 font-bold">ID: {item?.product_id}</span>
                {item?.color && (
                  <span className="bg-gold-500/10 border border-gold-500/20 text-gold-300 px-2 py-0.5 rounded text-[10px]">
                    Colour: {item.color}
                  </span>
                )}
                <span>Qty: {item?.quantity}</span>
              </div>
            </div>
          </div>

          {/* Detailed Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gold-500/10 pt-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recipient Contact</span>
              <p className="font-bold text-white">{details?.recipient_name || completedOrder.customer_name}</p>
              <p className="text-gray-300 font-mono">📱 {completedOrder.phone}</p>
              {details?.alt_phone && <p className="text-gray-400 font-mono">Alt: {details.alt_phone}</p>}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Destination</span>
              <p className="text-gray-300 leading-relaxed">{completedOrder.shipping_address}</p>
              {details?.landmark && (
                <p className="text-gold-400 font-medium text-[11px]">📍 Landmark: {details.landmark}</p>
              )}
            </div>
          </div>

          {/* Payment & Amount */}
          <div className="bg-black/50 p-4 rounded border border-gold-500/10 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400">Payment Mode:</span>
              <span className="ml-2 font-bold text-gold-300 uppercase tracking-wider">Cash on Delivery (COD)</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px]">Total Payable</span>
              <span className="font-serif text-lg font-bold text-gold-400">Rs. {completedOrder.total_amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/my-orders"
              className="flex-1 text-center py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-wider rounded"
            >
              View in My Orders
            </Link>
            <Link
              href="/"
              className="flex-1 text-center py-3 bg-neutral-900 border border-gray-800 text-white hover:border-gold-500/50 transition-colors font-bold text-xs uppercase tracking-wider rounded"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CHECKOUT FORM (Order > Address > Payment)
  // =========================================================================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen text-left">
      
      {/* Top Header & Breadcrumb Bar */}
      <div className="space-y-3">
        <Link 
          href={product ? `/product/${product.id}` : "/"} 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {product ? product.name : "Store"}
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/10 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-gold-500">Saleem Watch Center</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Secure Checkout
            </h1>
          </div>

          {/* Modern Step Indicator (Order > Address > Payment) */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-gold-400 font-bold">1. Order</span>
            <span className="text-gray-600">&gt;</span>
            <span className="text-gold-400 font-bold">2. Address</span>
            <span className="text-gray-600">&gt;</span>
            <span className="text-gray-400">3. Confirmation</span>
          </div>
        </div>
      </div>

      {orderError && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-lg flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      {/* Main 2-Column Checkout Layout */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Customer & Detailed Multi-Field Address Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Customer Contact Info */}
          <div className="glass-panel border border-gold-500/15 p-6 sm:p-7 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-gold-500/10 pb-3">
              <User className="w-4 h-4 text-gold-500" />
              <h2 className="font-serif text-base font-bold text-white">
                Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  Recipient Full Name <span className="text-gold-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                />
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  WhatsApp / Mobile Number <span className="text-gold-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs font-mono rounded-sm"
                />
              </div>

              {/* Alternate Phone */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  Alternate Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="Secondary mobile or PTCL"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs font-mono rounded-sm"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  Email Address (For Order Tracking Receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com (Optional)"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Detailed Multi-Field Shipping Address */}
          <div className="glass-panel border border-gold-500/15 p-6 sm:p-7 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-gold-500/10 pb-3">
              <MapPin className="w-4 h-4 text-gold-500" />
              <div>
                <h2 className="font-serif text-base font-bold text-white">
                  Detailed Delivery Address
                </h2>
                <p className="text-[10px] text-gray-400 font-light">
                  Please provide complete details so the courier rider can reach your doorstep smoothly.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Street Address / House / Flat */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                  House / Flat / Building / Street Address <span className="text-gold-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. House # 14-B, Street 7, Block 4"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                />
              </div>

              {/* Apartment / Suite / Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    Apartment / Suite / Floor (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartmentSuite}
                    onChange={(e) => setApartmentSuite(e.target.value)}
                    placeholder="e.g. 2nd Floor, Apt 302"
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    Nearby Famous Landmark <span className="text-gold-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Clock Tower, Opposite Bank Alfalah"
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                  />
                </div>
              </div>

              {/* City and Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    City <span className="text-gold-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 focus:outline-none focus:border-gold-500 text-xs rounded-sm cursor-pointer"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom City input if "Other" */}
                {city === "Other" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                      Type Your City Name <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter city name"
                      className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                    />
                  </div>
                )}

                {/* Province */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    Province / State <span className="text-gold-500">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 focus:outline-none focus:border-gold-500 text-xs rounded-sm cursor-pointer"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Postal code & Order notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 74400"
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs font-mono rounded-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Please call before arriving"
                    className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3.5 focus:outline-none focus:border-gold-500 text-xs rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Payment Method */}
          <div className="glass-panel border border-gold-500/15 p-6 sm:p-7 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-gold-500/10 pb-3">
              <Award className="w-4 h-4 text-gold-500" />
              <h2 className="font-serif text-base font-bold text-white">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery Option */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  paymentMethod === "cod" 
                    ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500/30" 
                    : "bg-black/40 border-gold-500/15 hover:border-gold-500/40"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-[#d4af37]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white uppercase tracking-wider">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-gold-500/20 text-gold-300 font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                    Pay securely with cash at your doorstep upon parcel arrival. Open-box inspection supported with our courier partner.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer Option */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  paymentMethod === "bank_transfer" 
                    ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500/30" 
                    : "bg-black/40 border-gold-500/15 hover:border-gold-500/40"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 accent-[#d4af37]"
                />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-white uppercase tracking-wider">
                    Online Bank Transfer / Raast (Advance Payment)
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                    Account details will be provided immediately after order placement for direct mobile banking transfer.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card (Matching user's mobile screenshot) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="glass-panel border border-gold-500/20 p-6 sm:p-7 rounded-xl space-y-6 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gold-500" />
                Order summary
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">
                {quantity} {quantity === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Product Item Card */}
            {product ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-black rounded-md overflow-hidden flex-shrink-0 border border-gold-500/20">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex-grow space-y-1">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-white leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs font-mono text-gold-500 font-bold">
                      ID: {product.id}
                    </p>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-serif text-sm font-extrabold text-gold-400">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through text-[11px] font-mono">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Selection if available */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-gold-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        Selected Colour:
                      </span>
                      <span className="text-xs text-gold-400 font-bold">{selectedColor || product.colors[0]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.colors.map((c) => {
                        const isChosen = (selectedColor || product.colors![0]).toLowerCase() === c.toLowerCase();
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`px-2.5 py-1 text-[10px] rounded border transition-all cursor-pointer ${
                              isChosen
                                ? "bg-gold-500 text-black border-gold-400 font-bold"
                                : "bg-black/60 text-gray-300 border-gold-500/20 hover:border-gold-500/50"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper (Matching screenshot) */}
                <div className="flex items-center justify-between pt-2 border-t border-gold-500/10">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Quantity:
                  </span>
                  
                  <div className="flex items-center border border-gold-500/30 bg-black rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-300 hover:text-gold-400 hover:bg-gold-500/10 text-xs font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-300 hover:text-gold-400 hover:bg-gold-500/10 text-xs font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-xs">
                No timepiece selected. <Link href="/" className="text-gold-400 underline">Browse watches</Link>
              </div>
            )}

            {/* Voucher / Discount Code Input (Matching screenshot) */}
            <div className="space-y-2 border-t border-gold-500/10 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code (e.g. SWC10)..."
                  className="flex-grow bg-black border border-gold-500/20 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-500 rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-neutral-900 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {discountError && (
                <p className="text-[10px] text-red-400">{discountError}</p>
              )}
              {appliedDiscount && (
                <div className="flex justify-between items-center bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded text-[11px] text-gold-300">
                  <span>{appliedDiscount.description}</span>
                  <button 
                    type="button" 
                    onClick={() => setAppliedDiscount(null)}
                    className="text-red-400 hover:text-red-300 ml-2 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations (Matching screenshot) */}
            <div className="space-y-2 border-t border-gold-500/10 pt-4 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-400 font-bold uppercase text-[11px]">Free Nationwide</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount Applied</span>
                  <span className="font-mono font-bold">- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-gold-500/20 pt-3 text-sm">
                <span className="font-bold text-white uppercase tracking-wider">Total</span>
                <span className="font-serif text-xl font-extrabold text-gold-400">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Big Place Order Button (Matching screenshot) */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !product}
                className="w-full gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-4 rounded shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Placing Your Order...
                  </>
                ) : (
                  <>
                    Place Cash on Delivery Order &gt;
                  </>
                )}
              </button>

              <Link
                href="/"
                className="block text-center text-xs text-gray-400 hover:text-gold-400 transition-colors pt-1"
              >
                &lt; Continue shopping
              </Link>
            </div>

            {/* Trust Assurance Strip */}
            <div className="grid grid-cols-3 gap-2 border-t border-gold-500/10 pt-4 text-center text-[9px] text-gray-400">
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 text-gold-500 mx-auto" />
                <span>100% Genuine</span>
              </div>
              <div className="space-y-1">
                <Award className="w-4 h-4 text-gold-500 mx-auto" />
                <span>SWC Warranty</span>
              </div>
              <div className="space-y-1">
                <Truck className="w-4 h-4 text-gold-500 mx-auto" />
                <span>Insured Courier</span>
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
