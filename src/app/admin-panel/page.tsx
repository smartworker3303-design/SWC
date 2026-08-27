"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Clock, 
  Smartphone, 
  Layers, 
  DollarSign,
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Database, 
  X, 
  Save, 
  Settings,
  ChevronLeft,
  Watch,
  Search
} from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import { useOrders } from "../../context/OrdersContext";
import { Product } from "../../data";

export default function AdminPanelPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    isLoading: isProductsLoading,
    isSupabaseConnected 
  } = useProducts();

  const {
    orders,
    profiles,
    updateStatus,
    isLoading: isOrdersLoading,
    refreshData
  } = useOrders();

  // Authentication State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // UI Tabs State
  const [activeTab, setActiveTab] = useState<"dashboard" | "hand-watches" | "wall-clocks" | "users-orders">("dashboard");
  const [localProfiles, setLocalProfiles] = useState<any[]>([]);

  // Admin Search & Sort State
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminSortBy, setAdminSortBy] = useState("featured");
  const [adminSubcatFilter, setAdminSubcatFilter] = useState("all");

  // Reset search and sort when active tab changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminSearchQuery("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminSortBy("featured");
    
    // Fetch mock users for admin view
    const stored = localStorage.getItem("mock_users_db_v2");
    if (stored) {
      setLocalProfiles(JSON.parse(stored));
    }
  }, [activeTab]);

  // Combined Registered Profiles from Supabase & Local DB
  const allRegisteredProfiles = useMemo(() => {
    const map = new Map<string, any>();
    profiles.forEach(p => {
      const key = p.email?.toLowerCase() || p.id;
      map.set(key, p);
    });
    localProfiles.forEach(p => {
      const key = p.email?.toLowerCase() || p.id;
      if (!map.has(key)) {
        map.set(key, p);
      }
    });
    return Array.from(map.values());
  }, [profiles, localProfiles]);

  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form Field States
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"hand-watches" | "wall-clocks">("hand-watches");
  const [formSubcategory, setFormSubcategory] = useState<"mens" | "womens" | "">("");
  const [formBrand, setFormBrand] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formImage, setFormImage] = useState("");
  const [formImages, setFormImages] = useState<string[]>(["/images/hero_luxury_watch.png"]);
  const [activeImageSlot, setActiveImageSlot] = useState<number>(0);
  const [formDescription, setFormDescription] = useState("");
  const [formRating, setFormRating] = useState(5.0);
  const [formReviews, setFormReviews] = useState(0);
  const [formTag, setFormTag] = useState("");
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check login session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("swc-admin-authenticated");
    if (session === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "basit@gmail.com" && password === "AFSafs@123") {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem("swc-admin-authenticated", "true");
    } else {
      setLoginError("Invalid concierge credentials. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    sessionStorage.removeItem("swc-admin-authenticated");
  };

  // Image Upload File Pickers
  const triggerFileSelect = () => {
    document.getElementById("image-file-input")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          // Keep images small to stay within Supabase's request size limit.
          // 400px max dimension at 60% webp quality ≈ 50-100KB base64 — safe for DB storage.
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          // Use actual image dimensions for the canvas (no padding/letterboxing)
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/webp", 0.6);
            setFormImage(dataUrl);
            setFormImages(prev => {
              const copy = [...prev];
              if (activeImageSlot < copy.length) {
                copy[activeImageSlot] = dataUrl;
              } else if (copy.length < 5) {
                copy.push(dataUrl);
              }
              return copy;
            });
          }
        };
        if (event.target?.result && typeof event.target.result === "string") {
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageSlot = () => {
    if (formImages.length < 5) {
      const nextIndex = formImages.length;
      setFormImages([...formImages, ""]);
      setActiveImageSlot(nextIndex);
    }
  };

  const handleRemoveImageSlot = (index: number) => {
    if (formImages.length <= 1) {
      setFormImages([""]);
      setFormImage("");
      return;
    }
    const updated = formImages.filter((_, i) => i !== index);
    setFormImages(updated);
    if (activeImageSlot >= updated.length) {
      setActiveImageSlot(Math.max(0, updated.length - 1));
    }
    setFormImage(updated[0] || "");
  };

  const handleImageSlotChange = (index: number, val: string) => {
    const updated = [...formImages];
    updated[index] = val;
    setFormImages(updated);
    if (index === 0) {
      setFormImage(val);
    }
  };

  // Helper function to auto-generate clean, URL-safe unique product IDs
  const generateUniqueProductId = (category: "hand-watches" | "wall-clocks", name?: string) => {
    const prefix = category === "wall-clocks" ? "wc" : "hw";
    const slug = name 
      ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) 
      : "";
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    let candidate = slug ? `${slug}-${randomSuffix}` : `${prefix}-${Date.now().toString(36)}-${randomSuffix}`;
    
    // Ensure absolute uniqueness against existing products
    let counter = 1;
    while (products.some(p => p.id.toLowerCase() === candidate.toLowerCase())) {
      candidate = `${candidate}-${counter++}`;
    }
    return candidate;
  };

  // Open Add Modal
  const openAddModal = (defaultCategory?: "hand-watches" | "wall-clocks") => {
    setModalType("add");
    setFormId("");
    setFormName("");
    setFormCategory(defaultCategory || "hand-watches");
    setFormSubcategory("");
    setFormBrand("");
    setFormPrice(1000);
    setFormImage("/images/hero_luxury_watch.png");
    setFormImages(["/images/hero_luxury_watch.png"]);
    setActiveImageSlot(0);
    setFormDescription("");
    setFormRating(5.0);
    setFormReviews(0);
    setFormTag("New");
    setFormSpecs([
      { key: "Movement", value: "Quartz" },
      { key: "Water Resistance", value: "50m (5 ATM)" }
    ]);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setModalType("edit");
    setCurrentProduct(product);
    setFormId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormSubcategory(product.subcategory || "");
    setFormBrand(product.brand || "");
    setFormPrice(product.price);
    setFormImage(product.image);
    const existingImgs = product.images && product.images.length > 0 ? product.images : [product.image];
    setFormImages(existingImgs);
    setActiveImageSlot(0);
    setFormDescription(product.description);
    setFormRating(product.rating);
    setFormReviews(product.reviews);
    setFormTag(product.tag || "");
    
    // Map specifications object to key-value array
    const mappedSpecs = Object.entries(product.specs).map(([key, value]) => ({
      key,
      value
    }));
    setFormSpecs(mappedSpecs);
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle Spec changes
  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...formSpecs];
    updated[index][field] = val;
    setFormSpecs(updated);
  };

  const addSpecRow = () => {
    setFormSpecs([...formSpecs, { key: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== index));
  };

  // Submit CRUD Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = formImages.map(img => img.trim()).filter(img => img.length > 0);
    const primaryImg = validImages[0] || formImage.trim();

    if (!formName.trim() || !primaryImg || !formDescription.trim()) {
      setFormError("Please fill in all required fields (Timepiece Name, at least 1 Image, Description).");
      return;
    }
    
    if (formCategory === "hand-watches" && !formSubcategory) {
      setFormError("Please select a subcategory (Men's or Women's) for hand watches.");
      return;
    }

    // Convert specs key-value back to object
    const specsObject: { [key: string]: string } = {};
    formSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });

    // Determine clean URL-safe unique ID
    let finalId: string;
    if (modalType === "add") {
      finalId = formId ? formId.toLowerCase().trim().replace(/[^a-z0-9-_]+/g, '-') : "";
      if (!finalId || finalId === "-") {
        finalId = generateUniqueProductId(formCategory, formName);
      }
    } else {
      finalId = formId.trim();
    }

    const payload: Product = {
      id: finalId,
      name: formName.trim(),
      category: formCategory,
      subcategory: formCategory === "hand-watches" && formSubcategory ? formSubcategory : undefined,
      brand: formCategory === "hand-watches" && formBrand ? formBrand : undefined,
      price: Number(formPrice),
      rating: Number(formRating),
      reviews: Number(formReviews),
      image: primaryImg,
      images: validImages.length > 0 ? validImages : [primaryImg],
      description: formDescription.trim(),
      specs: specsObject,
      featured: true, // Default to true so it can show in collections and catalog
      tag: formTag.trim() || undefined
    };

    try {
      setIsSaving(true);
      if (modalType === "add") {
        // Check for duplicate ID
        if (products.some(p => p.id.toLowerCase() === payload.id.toLowerCase())) {
          payload.id = generateUniqueProductId(formCategory, formName);
        }
        await addProduct(payload);
        setSuccessMessage(`✅ Product added with ID: "${payload.id}"`);
      } else {
        await updateProduct(payload);
        setSuccessMessage("✅ Product updated and saved to database!");
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product. Please try again.";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete the product with ID: "${id}"?`)) {
      try {
        await deleteProduct(id);
        setSuccessMessage("✅ Product deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete product.";
        alert(`Error: ${msg}`);
      }
    }
  };

  // Metric Calculation
  const totalProducts = products.length;
  const handWatchesCount = products.filter(p => p.category === "hand-watches").length;
  const wallClocksCount = products.filter(p => p.category === "wall-clocks").length;
  const totalAssetValue = products.reduce((acc, p) => acc + p.price, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  // Filter and sort products for Admin Panel
  const getFilteredAndSortedProducts = (category: "hand-watches" | "wall-clocks") => {
    // 1. Filter
    const filtered = products.filter(product => {
      const matchesCategory = product.category === category;
      const matchesSubcat = category === "hand-watches" && adminSubcatFilter !== "all" 
                            ? product.subcategory === adminSubcatFilter 
                            : true;
      const query = adminSearchQuery.toLowerCase().trim();
      const decodedQuery = decodeURIComponent(adminSearchQuery).toLowerCase().trim();
      const matchesSearch = !query || 
                            product.id.toLowerCase().includes(query) ||
                            product.id.toLowerCase().includes(decodedQuery) ||
                            product.name.toLowerCase().includes(query) ||
                            product.description.toLowerCase().includes(query) ||
                            (product.brand && product.brand.toLowerCase().includes(query)) ||
                            (product.tag && product.tag.toLowerCase().includes(query));
      return matchesCategory && matchesSubcat && matchesSearch;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (adminSortBy === "price-asc") {
        return a.price - b.price;
      }
      if (adminSortBy === "price-desc") {
        return b.price - a.price;
      }
      if (adminSortBy === "rating") {
        return b.rating - a.rating;
      }
      if (adminSortBy === "newest") {
        const aIsNew = a.tag && /new/i.test(a.tag);
        const bIsNew = b.tag && /new/i.test(b.tag);
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;

        const aIndex = products.indexOf(a);
        const bIndex = products.indexOf(b);
        return bIndex - aIndex;
      }
      return 0; // default / featured
    });
  };

  if (isProductsLoading || isOrdersLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading SWC Admin Console...</p>
      </div>
    );
  }

  // 1. LOGIN GATE VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
        {/* Decorative backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full space-y-8 glass-panel border border-gold-500/10 p-8 sm:p-10 shadow-2xl relative z-10">
          
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors mb-2">
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Storefront
            </Link>
            <div className="w-14 h-14 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(212,175,55,0.15)] mx-auto">
              <Lock className="w-6 h-6 text-gold-500" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-wider text-white">
              SWC Concierge Portal
            </h2>
            <p className="text-gray-400 text-xs font-light max-w-xs mx-auto leading-relaxed">
              Enter admin credentials to configure inventory tables, recalibrate pricing, and sync cloud databases.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="login-email" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/70">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@swc.com"
                    className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-gold-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="login-password" className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/70">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-gold-500 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 text-center text-xs text-red-400 font-medium font-mono animate-shake">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-4 shadow-lg hover:opacity-95 transition-opacity"
            >
              Sign In Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ADMIN PANEL CONSOLE VIEW
  return (
    <div className="min-h-screen bg-transparent text-white font-sans text-left flex flex-col lg:flex-row">

      {/* ===== GLOBAL TOAST NOTIFICATION (fixed, always visible on all tabs) ===== */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-green-950 border border-green-500 text-green-300 text-sm font-semibold px-6 py-4 rounded-lg shadow-2xl shadow-green-900/40 animate-fade-in-up max-w-[90vw]">
          <span className="text-green-400 text-lg">✅</span>
          <span>{successMessage.replace('✅ ', '')}</span>
          <button onClick={() => setSuccessMessage("")} className="ml-2 text-green-500 hover:text-green-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===== SUPABASE DISCONNECTED BANNER ===== */}
      {!isSupabaseConnected && (
        <div className="fixed top-0 left-0 right-0 z-[9998] bg-red-900 border-b-2 border-red-500 text-red-100 text-xs font-bold px-4 py-2.5 text-center tracking-wide">
          ⚠️ DATABASE NOT CONNECTED — Products will NOT be saved. Supabase environment variables are missing from this deployment.
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-80 bg-neutral-950 border-r border-gold-500/10 flex-col justify-between p-8 sticky top-0 h-screen flex-shrink-0">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <span className="font-serif text-base font-bold text-gold-500 tracking-wider">SWC</span>
            </div>
            <div>
              <h1 className="font-serif text-sm font-bold uppercase text-white tracking-widest flex items-center gap-1.5">
                SWC Admin
              </h1>
              <p className="text-[9px] text-gray-500 font-light">Control Center • EST. 1984</p>
            </div>
          </div>



          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all rounded cursor-pointer ${
                activeTab === "dashboard"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview Stats
            </button>
            
            <button
              onClick={() => setActiveTab("hand-watches")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all rounded cursor-pointer ${
                activeTab === "hand-watches"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <Watch className="w-4 h-4" />
              Hand Watches
            </button>

            <button
              onClick={() => setActiveTab("wall-clocks")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all rounded cursor-pointer ${
                activeTab === "wall-clocks"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <Clock className="w-4 h-4" />
              Wall Clocks
            </button>

            <button
              onClick={() => setActiveTab("users-orders")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all rounded cursor-pointer ${
                activeTab === "users-orders"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>Users & Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg animate-pulse flex items-center justify-center min-w-[20px] h-5">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer (Active session + Logout) */}
        <div className="space-y-6 pt-6 border-t border-gold-500/10">
          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 flex-shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Active Staff</p>
              <p className="text-xs font-bold text-white font-mono truncate">{email || "basit@gmail.com"}</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-2">
            <Link 
              href="/" 
              className="w-full py-2 px-3 border border-gold-500/10 hover:border-gold-500/30 text-gray-400 hover:text-gold-400 text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Live Storefront
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full py-2 px-3 border border-red-500/20 hover:border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out Session
            </button>
          </div>
        </div>
      </aside>

      {/* Header / Nav for Mobile */}
      <header className="lg:hidden bg-neutral-950 border-b border-gold-500/10 px-4 py-4 flex flex-col gap-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
              <span className="font-serif text-xs font-bold text-gold-500 tracking-wider">SWC</span>
            </div>
            <div>
              <h1 className="font-serif text-xs font-bold uppercase text-white tracking-widest">
                SWC Admin
              </h1>
              <p className="text-[8px] text-gray-500 font-light">EST. 1984</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="p-2 border border-gold-500/10 text-gray-400 hover:text-gold-400 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Store
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Scrollable Navigation for Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded whitespace-nowrap cursor-pointer ${
              activeTab === "dashboard"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("hand-watches")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded whitespace-nowrap cursor-pointer ${
              activeTab === "hand-watches"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <Watch className="w-3.5 h-3.5" />
            Watches
          </button>
          <button
            onClick={() => setActiveTab("wall-clocks")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded whitespace-nowrap cursor-pointer ${
              activeTab === "wall-clocks"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Clocks
          </button>
          <button
            onClick={() => setActiveTab("users-orders")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer relative ${
              activeTab === "users-orders"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Small Active Session Text for Mobile */}
        <div className="flex items-center justify-between text-[9px] bg-black/40 px-3 py-1.5 rounded border border-gold-500/5">
          <span className="text-gray-500 font-mono">Session: {email || "basit@gmail.com"}</span>
          <span className="text-gold-500 font-bold uppercase tracking-wider">SWC Staff Portal</span>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <main className="flex-grow p-4 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto lg:h-screen space-y-8">
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Header */}
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold">Catalog Overview</h2>
              <p className="text-xs text-gray-400 font-light">Inventory valuation, database connection flags, and collection statistics.</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="glass-panel p-5 border border-gold-500/10 space-y-3">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Total Timepieces</span>
                  <Layers className="w-4 h-4 text-gold-500" />
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-extrabold text-white">{totalProducts}</p>
                <p className="text-[9px] text-gray-500">Active models listed in store</p>
              </div>

              <div className="glass-panel p-5 border border-gold-500/10 space-y-3">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Hand Watches</span>
                  <Smartphone className="w-4 h-4 text-gold-500" />
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-extrabold text-white">{handWatchesCount}</p>
                <p className="text-[9px] text-gray-500">Wristwatch series collection</p>
              </div>

              <div className="glass-panel p-5 border border-gold-500/10 space-y-3">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Wall Clocks</span>
                  <Clock className="w-4 h-4 text-gold-500" />
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-extrabold text-white">{wallClocksCount}</p>
                <p className="text-[9px] text-gray-500">Living room statement clocks</p>
              </div>

              <div className="glass-panel p-5 border border-gold-500/10 space-y-3">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Catalog Value</span>
                  <DollarSign className="w-4 h-4 text-gold-500" />
                </div>
                <p className="font-serif text-xl sm:text-2xl font-extrabold text-gold-400">Rs. {totalAssetValue.toLocaleString()}</p>
                <p className="text-[9px] text-gray-500">Combined starting prices value</p>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="glass-panel p-6 border border-gold-500/10 space-y-4">
              <h3 className="font-serif text-md font-bold text-white uppercase tracking-wider border-b border-gray-900 pb-2">
                Quick Management Operations
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("hand-watches")}
                  className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-bold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  View Hand Watches
                </button>
                <button
                  onClick={() => setActiveTab("wall-clocks")}
                  className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-bold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  View Wall Clocks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HAND WATCHES CRUD CATALOG */}
        {activeTab === "hand-watches" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Manage Hand Watches</h2>
                <p className="text-xs text-gray-400 font-light">Create, modify details, and prune wristwatches inventory.</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openAddModal("hand-watches")}
                  className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Watch
                </button>
              </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/40 border border-gold-500/10 p-4 rounded mb-6 text-left">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Search by ID, name, description, or tag..."
                  className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-10 py-2.5 focus:outline-none focus:border-gold-500 text-xs transition-all"
                />
                {adminSearchQuery && (
                  <button 
                    onClick={() => setAdminSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gold-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Subcategory Dropdown */}
              <div className="relative w-full sm:w-48">
                <select
                  value={adminSubcatFilter}
                  onChange={(e) => setAdminSubcatFilter(e.target.value)}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-xs transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all">All Subcategories</option>
                  <option value="mens">Men&apos;s Watches</option>
                  <option value="womens">Women&apos;s Watches</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-48">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-xs transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="featured">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newly Listed</option>
                </select>
              </div>
            </div>

            {/* Products Card Box Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Fallback empty message */}
              {getFilteredAndSortedProducts("hand-watches").length === 0 && (
                <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-12 border border-dashed border-gold-500/10 rounded bg-black/20">
                  <p className="text-gold-500 text-sm font-bold font-serif uppercase tracking-wider">No timepieces match your query</p>
                  <p className="text-gray-500 text-xs mt-1">Try adjusting your search criteria or filters.</p>
                </div>
              )}

              {/* Product Cards */}
              {getFilteredAndSortedProducts("hand-watches").map(p => (
                <div 
                  key={p.id} 
                  className="glass-panel glass-panel-hover rounded overflow-hidden flex flex-col justify-between border border-gold-500/10 min-h-[380px]"
                >
                  {/* Image section with overlay tag */}
                  <div className="relative h-48 w-full bg-black flex items-center justify-center border-b border-gold-500/10 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Overlay Tag */}
                    {p.tag && (
                      <span className="absolute top-3 left-3 bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md">
                        {p.tag}
                      </span>
                    )}
                    {/* Category Tag */}
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Watch
                    </span>
                  </div>

                  {/* Info body */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono text-gold-500 tracking-wider uppercase">ID: {p.id}</span>
                        <div className="flex items-center gap-1 text-gold-500 text-[11px] font-bold">
                          <span>★</span>
                          <span>{p.rating}</span>
                          <span className="text-gray-500 text-[9px] font-normal font-sans">({p.reviews})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-serif text-base font-bold text-white tracking-wide line-clamp-1">
                        {p.name}
                      </h3>
                      
                      <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed h-8">
                        {p.description}
                      </p>
                    </div>

                    {/* Specs */}
                    {p.specs && Object.keys(p.specs).length > 0 && (
                      <div className="border-t border-gold-500/10 pt-3 flex flex-wrap gap-1.5">
                        {Object.entries(p.specs).slice(0, 3).map(([key, val]) => (
                          <span key={key} className="bg-black/50 px-2 py-0.5 rounded-[3px] border border-gold-500/5 text-[9px] text-gray-400 font-mono">
                            <span className="text-gray-600 font-sans mr-0.5">{key}:</span> {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="px-5 pb-5 pt-3.5 flex justify-between items-center gap-3 border-t border-gold-500/5 bg-black/10">
                    <span className="text-sm font-extrabold text-gold-400 font-sans">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors rounded cursor-pointer"
                        title="Edit Timepiece"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded cursor-pointer"
                        title="Delete Timepiece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: WALL CLOCKS CRUD CATALOG */}
        {activeTab === "wall-clocks" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Manage Wall Clocks</h2>
                <p className="text-xs text-gray-400 font-light">Create, modify details, and prune wall clocks inventory.</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openAddModal("wall-clocks")}
                  className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Clock
                </button>
              </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/40 border border-gold-500/10 p-4 rounded mb-6 text-left">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Search by ID, name, description, or tag..."
                  className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-10 py-2.5 focus:outline-none focus:border-gold-500 text-xs transition-all"
                />
                {adminSearchQuery && (
                  <button 
                    onClick={() => setAdminSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gold-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-48">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-xs transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="featured">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newly Listed</option>
                </select>
              </div>
            </div>

            {/* Products Card Box Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Fallback empty message */}
              {getFilteredAndSortedProducts("wall-clocks").length === 0 && (
                <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-12 border border-dashed border-gold-500/10 rounded bg-black/20">
                  <p className="text-gold-500 text-sm font-bold font-serif uppercase tracking-wider">No timepieces match your query</p>
                  <p className="text-gray-500 text-xs mt-1">Try adjusting your search criteria or filters.</p>
                </div>
              )}

              {/* Product Cards */}
              {getFilteredAndSortedProducts("wall-clocks").map(p => (
                <div 
                  key={p.id} 
                  className="glass-panel glass-panel-hover rounded overflow-hidden flex flex-col justify-between border border-gold-500/10 min-h-[380px]"
                >
                  {/* Image section with overlay tag */}
                  <div className="relative h-48 w-full bg-black flex items-center justify-center border-b border-gold-500/10 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Overlay Tag */}
                    {p.tag && (
                      <span className="absolute top-3 left-3 bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md">
                        {p.tag}
                      </span>
                    )}
                    {/* Category Tag */}
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-purple-500/20 text-purple-300 border-purple-500/30">
                      Clock
                    </span>
                  </div>

                  {/* Info body */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono text-gold-500 tracking-wider uppercase">ID: {p.id}</span>
                        <div className="flex items-center gap-1 text-gold-500 text-[11px] font-bold">
                          <span>★</span>
                          <span>{p.rating}</span>
                          <span className="text-gray-500 text-[9px] font-normal font-sans">({p.reviews})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-serif text-base font-bold text-white tracking-wide line-clamp-1">
                        {p.name}
                      </h3>
                      
                      <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed h-8">
                        {p.description}
                      </p>
                    </div>

                    {/* Specs */}
                    {p.specs && Object.keys(p.specs).length > 0 && (
                      <div className="border-t border-gold-500/10 pt-3 flex flex-wrap gap-1.5">
                        {Object.entries(p.specs).slice(0, 3).map(([key, val]) => (
                          <span key={key} className="bg-black/50 px-2 py-0.5 rounded-[3px] border border-gold-500/5 text-[9px] text-gray-400 font-mono">
                            <span className="text-gray-600 font-sans mr-0.5">{key}:</span> {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="px-5 pb-5 pt-3.5 flex justify-between items-center gap-3 border-t border-gold-500/5 bg-black/10">
                    <span className="text-sm font-extrabold text-gold-400 font-sans">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors rounded cursor-pointer"
                        title="Edit Timepiece"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded cursor-pointer"
                        title="Delete Timepiece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: USERS & ORDERS */}
        {activeTab === "users-orders" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Header row */}
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold">Users & Orders Management</h2>
              <p className="text-xs text-gray-400 font-light">Monitor registered customers, track order status, and update fulfillments.</p>
            </div>

            {/* Orders Data Grid */}
            <div className="glass-panel border border-gold-500/10 p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                <h3 className="font-serif text-lg font-bold">Recent Orders ({orders.length})</h3>
                <button
                  onClick={() => refreshData()}
                  className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-gold-500 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Sync
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gold-500/10 rounded bg-black/20">
                  <p className="text-gold-500 text-sm font-bold font-serif uppercase tracking-wider">No Orders Found</p>
                  <p className="text-gray-500 text-xs mt-1">Customers have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-black/40 text-gray-400 uppercase tracking-widest text-[9px]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order ID / Date</th>
                        <th className="px-4 py-3 font-semibold">Customer Details</th>
                        <th className="px-4 py-3 font-semibold">Items</th>
                        <th className="px-4 py-3 font-semibold">Total Amount</th>
                        <th className="px-4 py-3 font-semibold text-right">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/50">
                      {orders.map((order) => {
                        const profile = allRegisteredProfiles.find(p => p.id === order.user_id || p.email === order.user_id);
                        return (
                          <tr key={order.id} className="hover:bg-gold-500/5 transition-colors group">
                            <td className="px-4 py-4">
                              <div className="font-mono text-gold-500">{order.id.slice(0, 8).toUpperCase()}</div>
                              <div className="text-[9px] text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-bold text-white">{profile?.full_name || 'Customer Client'}</div>
                              <div className="text-[9px] text-gray-500">{profile?.email || 'N/A'}</div>
                              <div className="text-[9px] text-gray-500">{order.phone}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-1 max-w-[200px] overflow-hidden">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between gap-4 text-[10px] bg-black/30 px-2 py-1 rounded border border-gold-500/10">
                                    <span className="truncate" title={item.name}>{item.quantity}x {item.name}</span>
                                    <span className="text-gold-400">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-bold text-gold-400 font-sans">
                              Rs. {order.total_amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id, e.target.value as any)}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded outline-none border cursor-pointer transition-colors ${
                                  order.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/50' :
                                  order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/50' :
                                  order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/50' :
                                  order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:border-green-500/50' :
                                  'bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/50'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Registered Profiles Grid */}
            <div className="glass-panel border border-gold-500/10 p-6 space-y-4">
              <div className="border-b border-gray-900 pb-2">
                <h3 className="font-serif text-lg font-bold">Registered Profiles ({allRegisteredProfiles.length})</h3>
              </div>
              
              {allRegisteredProfiles.length === 0 ? (
                <p className="text-gray-500 text-xs italic">No user profiles synced yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allRegisteredProfiles.map(p => (
                    <div key={p.id} className="bg-black/30 border border-gold-500/5 p-4 rounded flex flex-col gap-2 relative">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center font-serif font-bold text-sm absolute top-4 right-4">
                        {(p.full_name || p.email)?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-white">{p.full_name || 'Customer'}</p>
                        <p className="text-xs text-gray-400">Email: {p.email}</p>
                        {p.phone && <p className="text-[10px] text-gray-500 font-mono">Phone: {p.phone}</p>}
                        {p.password && <p className="text-[10px] text-red-400 font-mono mt-1">Pass: {p.password}</p>}
                      </div>
                      <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest">
                        Joined {p.created_at ? new Date(p.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* CRUD MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-gold-500/15 max-w-2xl w-full bg-neutral-950 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gold-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <h3 className="font-serif text-xl font-bold">
                {modalType === "add" ? "Insert New Timepiece" : `Modify Timepiece: ${formName}`}
              </h3>
              <p className="text-[10px] text-gray-500 font-light mt-0.5">Specify layout elements and pricing coefficients.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modalType === "edit" ? (
                  /* ID input (Read-only on edit) */
                  <div className="space-y-1">
                    <label htmlFor="form-id" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Product ID (Read-Only)</label>
                    <input
                      id="form-id"
                      type="text"
                      disabled
                      value={formId}
                      className="w-full bg-neutral-900 border border-gold-500/15 text-gold-400 py-2 px-3 text-xs opacity-75 cursor-not-allowed font-mono"
                    />
                  </div>
                ) : (
                  /* Auto-generated ID Info badge for Add mode */
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Product ID</label>
                    <div className="w-full bg-neutral-900/80 border border-gold-500/20 text-gold-400 py-2 px-3 text-xs italic flex items-center gap-1.5 rounded-sm">
                      <span className="font-mono text-[10px] text-gold-500">✨ Auto-assigned upon save</span>
                    </div>
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-1">
                  <label htmlFor="form-name" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Timepiece Name (Required)</label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Navigator Chronograph"
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category select */}
                <div className="space-y-1">
                  <label htmlFor="form-category" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Category</label>
                  <select
                    id="form-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as "hand-watches" | "wall-clocks")}
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  >
                    <option value="hand-watches">Hand Watch</option>
                    <option value="wall-clocks">Wall Clock</option>
                  </select>
                </div>

                {/* Subcategory select (only for hand-watches) */}
                {formCategory === "hand-watches" && (
                  <>
                    <div className="space-y-1">
                      <label htmlFor="form-subcategory" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Subcategory</label>
                      <select
                        id="form-subcategory"
                        value={formSubcategory}
                        onChange={(e) => setFormSubcategory(e.target.value as "mens" | "womens" | "")}
                        className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                      >
                        <option value="">None / Unisex</option>
                        <option value="mens">Men&apos;s Watches</option>
                        <option value="womens">Women&apos;s Watches</option>
                      </select>
                    </div>

                    {/* Brand select (only for hand-watches) */}
                    <div className="space-y-1">
                      <label htmlFor="form-brand" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Brand</label>
                      <select
                        id="form-brand"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                      >
                        <option value="">None / Unbranded</option>
                        <option value="Rolex">Rolex</option>
                        <option value="Patek Philippe">Patek Philippe</option>
                        <option value="Cartier">Cartier</option>
                        <option value="Audemars Piguet">Audemars Piguet</option>
                        <option value="Omega">Omega</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Price input */}
                <div className="space-y-1">
                  <label htmlFor="form-price" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Price (PKR Rs.)</label>
                  <input
                    id="form-price"
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                {/* Tag Input */}
                <div className="space-y-1">
                  <label htmlFor="form-tag" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Catalog Overlay Tag</label>
                  <input
                    id="form-tag"
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. Signature, Bestseller"
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              {/* Multiple Images Gallery Manager (Maximum 5 Images) */}
              <div className="space-y-3 border border-gold-500/20 bg-black/40 p-4 rounded">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-900 pb-2.5">
                  <div>
                    <label className="text-[10px] text-gold-400 uppercase tracking-widest font-bold block">
                      Product Images ({formImages.length}/5 max)
                    </label>
                    <p className="text-[9px] text-gray-500 font-light">
                      Image #1 is the Primary Thumbnail shown in catalogs. Images #2-5 display on the Product Details page.
                    </p>
                  </div>
                  {formImages.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddImageSlot}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Gallery Image ({formImages.length}/5)
                    </button>
                  )}
                </div>

                {/* Thumbnail Preview Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  {formImages.map((imgUrl, idx) => {
                    const isSelected = activeImageSlot === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveImageSlot(idx)}
                        className={`relative h-28 bg-black rounded border cursor-pointer overflow-hidden transition-all flex flex-col items-center justify-center group ${
                          isSelected
                            ? "border-gold-500 ring-2 ring-gold-500/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            : "border-gold-500/15 hover:border-gold-500/40 opacity-80 hover:opacity-100"
                        }`}
                      >
                        {imgUrl ? (
                          <>
                            <Image
                              src={imgUrl}
                              alt={`Slot ${idx + 1}`}
                              fill
                              className="object-contain p-2"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[8px] text-gold-400 font-bold uppercase tracking-widest">Select</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <Plus className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                            <span className="text-[8px] text-gray-500 uppercase block">Empty</span>
                          </div>
                        )}

                        {/* Badge */}
                        <span className={`absolute top-1 left-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${
                          idx === 0 
                            ? "bg-gold-500 text-black font-extrabold" 
                            : "bg-black/80 text-gray-300 border border-gold-500/20"
                        }`}>
                          {idx === 0 ? "★ Main" : `#${idx + 1}`}
                        </span>

                        {/* Remove button (if more than 1 image slot) */}
                        {formImages.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImageSlot(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-950/80 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                            title="Remove this image slot"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Slot Controls */}
                <div className="pt-2 space-y-3 bg-black/60 p-3 rounded border border-gold-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[10px] text-gold-400 uppercase tracking-wider font-bold">
                      Editing Image #{activeImageSlot + 1} {activeImageSlot === 0 ? "(Primary Storefront)" : "(Product Gallery)"}
                    </span>
                    <button
                      type="button"
                      onClick={triggerFileSelect}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-300 hover:text-gold-400 border border-gray-700 hover:border-gold-500 px-2 py-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-gold-500" />
                      Browse Local Image File for Slot #{activeImageSlot + 1}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-400 uppercase tracking-widest block">Image URL / Path</label>
                    <input
                      type="text"
                      required={activeImageSlot === 0}
                      value={formImages[activeImageSlot] || ""}
                      onChange={(e) => handleImageSlotChange(activeImageSlot, e.target.value)}
                      placeholder="/images/hero_luxury_watch.png or https://..."
                      className="w-full bg-black border border-gold-500/20 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="image-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Grid for Rating and Reviews metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Rating input */}
                <div className="space-y-1">
                  <label htmlFor="form-rating" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Rating (1.0 - 5.0)</label>
                  <input
                    id="form-rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                {/* Reviews input */}
                <div className="space-y-1">
                  <label htmlFor="form-reviews" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Reviews Count</label>
                  <input
                    id="form-reviews"
                    type="number"
                    required
                    min={0}
                    value={formReviews}
                    onChange={(e) => setFormReviews(Number(e.target.value))}
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label htmlFor="form-description" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Item Description (Required)</label>
                <textarea
                  id="form-description"
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail timepiece caliber complications..."
                  className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              {/* Specs Editor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-gray-900 pb-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Technical Specifications</label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-[9px] text-gold-400 hover:text-gold-500 font-extrabold uppercase flex items-center gap-1 border border-gold-500/20 px-2 py-1 bg-gold-500/5 hover:bg-gold-500/10"
                  >
                    <Plus className="w-3 h-3" /> Add Spec Row
                  </button>
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Spec Key (e.g. Movement)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                        className="flex-grow bg-black border border-gold-500/10 text-white py-1.5 px-3 focus:outline-none focus:border-gold-500 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Spec Value (e.g. Automatic)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        className="flex-grow bg-black border border-gold-500/10 text-white py-1.5 px-3 focus:outline-none focus:border-gold-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formSpecs.length === 0 && (
                    <p className="text-[10px] text-gray-600 italic text-center py-2">No custom specs added. Default specs are empty.</p>
                  )}
                </div>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 text-center text-xs text-red-400 font-medium font-mono">
                  {formError}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-2 justify-end border-t border-gray-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-gold-500/20 text-gray-400 hover:border-gold-500/50 hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-5 py-2.5 hover:opacity-90 flex items-center gap-1.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
