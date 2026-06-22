"use client";

import { useState, useEffect } from "react";
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
import { Product } from "../../data";

export default function AdminPanelPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProducts, 
    isLoading,
    isSupabaseConnected 
  } = useProducts();

  // Authentication State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // UI Tabs State
  const [activeTab, setActiveTab] = useState<"dashboard" | "hand-watches" | "wall-clocks">("dashboard");

  // Admin Search & Sort State
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminSortBy, setAdminSortBy] = useState("featured");

  // Reset search and sort when active tab changes
  useEffect(() => {
    setAdminSearchQuery("");
    setAdminSortBy("featured");
  }, [activeTab]);

  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form Field States
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"hand-watches" | "wall-clocks">("hand-watches");
  const [formPrice, setFormPrice] = useState(0);
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRating, setFormRating] = useState(5.0);
  const [formReviews, setFormReviews] = useState(0);
  const [formTag, setFormTag] = useState("");
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([]);
  const [formError, setFormError] = useState("");

  // Check login session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("swc-admin-authenticated");
    if (session === "true") {
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
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Modal
  const openAddModal = (defaultCategory?: "hand-watches" | "wall-clocks") => {
    setModalType("add");
    setFormId("");
    setFormName("");
    setFormCategory(defaultCategory || "hand-watches");
    setFormPrice(1000);
    setFormImage("/images/hero_luxury_watch.png");
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
    setFormPrice(product.price);
    setFormImage(product.image);
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
    if (!formId || !formName || !formImage || !formDescription) {
      setFormError("Please fill in all required fields (ID, Name, Image Path, Description).");
      return;
    }

    // Convert specs key-value back to object
    const specsObject: { [key: string]: string } = {};
    formSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload: Product = {
      id: formId.trim(),
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      rating: Number(formRating),
      reviews: Number(formReviews),
      image: formImage.trim(),
      description: formDescription.trim(),
      specs: specsObject,
      featured: true, // Default to true so it can show in collections and catalog
      tag: formTag.trim() || undefined
    };

    try {
      if (modalType === "add") {
        // Check for duplicate ID
        if (products.some(p => p.id === payload.id)) {
          setFormError(`Product with ID "${payload.id}" already exists.`);
          return;
        }
        await addProduct(payload);
      } else {
        await updateProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError("Failed to persist data. Please check connection.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete the product with ID: "${id}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleResetCatalog = async () => {
    if (confirm("This will reset the catalog to Saleem Watch Center's original seed data, discarding all custom edits. Proceed?")) {
      await resetProducts();
    }
  };

  // Metric Calculation
  const totalProducts = products.length;
  const handWatchesCount = products.filter(p => p.category === "hand-watches").length;
  const wallClocksCount = products.filter(p => p.category === "wall-clocks").length;
  const totalAssetValue = products.reduce((acc, p) => acc + p.price, 0);

  // Filter and sort products for Admin Panel
  const getFilteredAndSortedProducts = (category: "hand-watches" | "wall-clocks") => {
    // 1. Filter
    const filtered = products.filter(product => {
      const matchesCategory = product.category === category;
      const matchesSearch = !adminSearchQuery.trim() || 
                            product.id.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                            product.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                            (product.tag && product.tag.toLowerCase().includes(adminSearchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading SWC Admin Console...</p>
      </div>
    );
  }

  // 1. LOGIN GATE VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
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
    <div className="min-h-screen bg-luxury-black text-white font-sans text-left flex flex-col lg:flex-row">
      
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
              <p className="text-[9px] text-gray-500 font-light">Control Center • EST. 2001</p>
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
              <p className="text-[8px] text-gray-500 font-light">EST. 2001</p>
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
                  onClick={() => openAddModal()}
                  className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-5 py-3 hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Insert New Product
                </button>
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
                <button
                  onClick={handleResetCatalog}
                  className="border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white font-semibold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Data Catalog
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
                <button
                  onClick={handleResetCatalog}
                  className="border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Catalog
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
                <button
                  onClick={handleResetCatalog}
                  className="border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Catalog
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
                {/* ID input */}
                <div className="space-y-1">
                  <label htmlFor="form-id" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Product ID (Required)</label>
                  <input
                    id="form-id"
                    type="text"
                    required
                    disabled={modalType === "edit"}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. hw-navigator"
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

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
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  >
                    <option value="hand-watches">Hand Watch</option>
                    <option value="wall-clocks">Wall Clock</option>
                  </select>
                </div>

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

              {/* Clickable Image Preview Box */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Product Image (Click to browse files)</label>
                <div 
                  onClick={triggerFileSelect}
                  className="relative h-48 w-full bg-black border border-dashed border-gold-500/20 hover:border-gold-500/40 rounded flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_70%)]"
                >
                  {formImage ? (
                    <>
                      <Image
                        src={formImage}
                        alt="Timepiece image preview"
                        fill
                        className="object-contain p-4 group-hover:scale-102 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                        <Plus className="w-8 h-8 text-gold-500 mb-1" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change Image File</span>
                        <span className="text-[8px] text-gray-500 mt-1 font-mono">Supports local storage / camera</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-10 h-10 rounded-full border border-gold-500/20 flex items-center justify-center mx-auto bg-gold-500/5 group-hover:border-gold-500/60 transition-colors">
                        <Plus className="w-5 h-5 text-gold-500/70" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Choose Timepiece Image</span>
                        <span className="text-[8px] text-gray-600 block mt-0.5">Click to browse native files</span>
                      </div>
                    </div>
                  )}
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

              {/* Grid for Image URL path and metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Image Path input */}
                <div className="sm:col-span-1 space-y-1">
                  <label htmlFor="form-image" className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold block">Image Path / URL (Required)</label>
                  <input
                    id="form-image"
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/images/hero_luxury_watch.png"
                    className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

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
                  className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-5 py-2.5 hover:opacity-90 flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
