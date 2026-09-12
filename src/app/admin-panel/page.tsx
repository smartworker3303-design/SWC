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
  Search,
  UploadCloud,
  Star,
  Loader2,
  Link as LinkIcon,
  Image as ImageIcon,
  ShoppingBag,
  MessageSquare,
  Phone,
  MapPin,
  Package,
  ExternalLink,
  CheckCircle,
  Users,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useProducts, getProductGroupKey } from "../../context/ProductsContext";
import { useOrders } from "../../context/OrdersContext";
import { Product } from "../../data";
import { getActiveDiscount } from "../../utils/discount";
import CountdownTimer from "../../components/CountdownTimer";

const COLOR_PRESETS = [
  { name: "Black", bg: "#111111", border: "#444444" },
  { name: "Blue", bg: "#1d4ed8", border: "#3b82f6" },
  { name: "Navy Blue", bg: "#0f172a", border: "#2563eb" },
  { name: "Gold", bg: "#d4af37", border: "#f59e0b" },
  { name: "Silver", bg: "#cbd5e1", border: "#94a3b8" },
  { name: "Rose Gold", bg: "#b76e79", border: "#f43f5e" },
  { name: "Green", bg: "#064e3b", border: "#10b981" },
  { name: "Brown", bg: "#78350f", border: "#d97706" },
  { name: "White", bg: "#ffffff", border: "#cbd5e1" },
  { name: "Two-Tone", bg: "linear-gradient(135deg, #d4af37 50%, #cbd5e1 50%)", border: "#d4af37" }
];

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

  // UI Tabs State: 5 distinct tabs (Dashboard, Watches, Clocks, Orders, Users)
  const [activeTab, setActiveTab] = useState<"dashboard" | "hand-watches" | "wall-clocks" | "orders" | "users">("dashboard");
  const [localProfiles, setLocalProfiles] = useState<any[]>([]);

  // Admin Search & Sort State for Products
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminSortBy, setAdminSortBy] = useState("featured");
  const [adminSubcatFilter, setAdminSubcatFilter] = useState("all");

  // Orders Tab Filter State
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Users Tab Filter State
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Orders Expansion State
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const toggleOrderExpansion = (id: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | "">("");
  const [formDiscount, setFormDiscount] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formImages, setFormImages] = useState<string[]>(["/images/hero_luxury_watch.png"]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formRating, setFormRating] = useState(5.0);
  const [formReviews, setFormReviews] = useState(0);
  const [formTag, setFormTag] = useState("");
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formColors, setFormColors] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState("");
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic max allowed position for sorting based on selected category & subcategory
  const currentMaxPosition = useMemo(() => {
    let groupKey: string;
    if (formCategory === "hand-watches") {
      groupKey = formSubcategory === "womens" ? "hand-watches:womens" : "hand-watches:mens";
    } else {
      groupKey = formCategory;
    }
    const otherItemsInGroup = products.filter(p => {
      const pGroupKey = getProductGroupKey(p);
      return pGroupKey === groupKey && (modalType === "add" || p.id !== formId);
    });
    return otherItemsInGroup.length + 1;
  }, [formCategory, formSubcategory, products, modalType, formId]);

  const handleAddCustomColor = () => {
    if (!customColorInput.trim()) return;
    const parts = customColorInput.split(",").map(s => s.trim()).filter(Boolean);
    const newColors = [...formColors];
    parts.forEach(p => {
      if (!newColors.some(c => c.toLowerCase() === p.toLowerCase())) {
        newColors.push(p);
      }
    });
    setFormColors(newColors);
    setCustomColorInput("");
  };

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

  // Helper to convert/optimize image files to high-resolution crisp WebP (up to 1000px, 82% quality)
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result;
        if (typeof rawDataUrl !== "string") {
          reject(new Error("Could not read file"));
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          const MAX_SIZE = 1000;
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

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const webpData = canvas.toDataURL("image/webp", 0.82);
              if (webpData && webpData.startsWith("data:image/webp")) {
                resolve(webpData);
                return;
              }
            } catch {}
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          } else {
            resolve(rawDataUrl);
          }
        };
        img.onerror = () => reject(new Error("Invalid image format"));
        img.src = rawDataUrl;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Upload handler for Primary/Main Image
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImages(true);
      const dataUrl = await processImageFile(file);
      setFormImage(dataUrl);
      setFormImages(prev => {
        const copy = [...prev];
        copy[0] = dataUrl;
        return copy;
      });
    } catch (err) {
      console.error("Error processing main image:", err);
    } finally {
      setIsProcessingImages(false);
      e.target.value = "";
    }
  };

  // Upload handler for Multiple Gallery Images (allows choosing 1 to 4 images at once!)
  const handleGalleryMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsProcessingImages(true);
      const newUrls: string[] = [];
      const currentValid = formImages.filter(img => img.trim().length > 0);
      const maxSlotsAllowed = 5 - currentValid.length;

      for (const file of files.slice(0, maxSlotsAllowed)) {
        const dataUrl = await processImageFile(file);
        newUrls.push(dataUrl);
      }

      setFormImages(prev => {
        const valid = prev.filter(img => img.trim().length > 0);
        const merged = [...valid, ...newUrls].slice(0, 5);
        if (merged.length > 0) setFormImage(merged[0]);
        return merged;
      });
    } catch (err) {
      console.error("Error processing gallery images:", err);
    } finally {
      setIsProcessingImages(false);
      e.target.value = "";
    }
  };

  // Set any secondary image as the Main Cover Image
  const handleMakeMainImage = (index: number) => {
    if (index <= 0 || index >= formImages.length) return;
    setFormImages(prev => {
      const copy = [...prev];
      const selected = copy[index];
      copy.splice(index, 1);
      copy.unshift(selected); // Put at index 0
      setFormImage(copy[0]);
      return copy;
    });
  };

  // Remove an image from the list
  const handleRemoveImage = (index: number) => {
    setFormImages(prev => {
      const copy = prev.filter((_, i) => i !== index);
      if (copy.length === 0) {
        setFormImage("");
        return [""];
      }
      setFormImage(copy[0]);
      return copy;
    });
  };

  // Add an image URL directly
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    setFormImages(prev => {
      const valid = prev.filter(img => img.trim().length > 0);
      if (valid.length >= 5) return prev;
      const merged = [...valid, url].slice(0, 5);
      if (merged.length > 0) setFormImage(merged[0]);
      return merged;
    });
    setUrlInput("");
    setIsAddingUrl(false);
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

  // Price & Discount Helper Handlers
  const handlePriceChange = (newPrice: number) => {
    setFormPrice(newPrice);
    if (typeof formOriginalPrice === "number" && formOriginalPrice > newPrice && newPrice > 0) {
      const pct = Math.round(((formOriginalPrice - newPrice) / formOriginalPrice) * 100);
      setFormDiscount(`${pct}% OFF`);
    }
  };

  const handleOriginalPriceChange = (newOrigPrice: number | "") => {
    setFormOriginalPrice(newOrigPrice);
    if (typeof newOrigPrice === "number" && newOrigPrice > formPrice && formPrice > 0) {
      const pct = Math.round(((newOrigPrice - formPrice) / newOrigPrice) * 100);
      setFormDiscount(`${pct}% OFF`);
    } else if (newOrigPrice === "" || (typeof newOrigPrice === "number" && newOrigPrice <= formPrice)) {
      setFormDiscount("");
    }
  };

  // Open Add Modal
  const openAddModal = (defaultCategory?: "hand-watches" | "wall-clocks") => {
    const cat = defaultCategory || "hand-watches";
    const subcat: "mens" | "womens" | "" = cat === "hand-watches" ? "mens" : "";
    const groupKey = getProductGroupKey({ category: cat, subcategory: subcat } as any);
    const countInGroup = products.filter(p => getProductGroupKey(p) === groupKey).length;
    const maxPos = countInGroup + 1;

    setModalType("add");
    setFormId("");
    setFormName("");
    setFormCategory(cat);
    setFormSubcategory(subcat);
    setFormBrand("");
    setFormPrice(1000);
    setFormOriginalPrice("");
    setFormDiscount("");
    setFormImage("/images/hero_luxury_watch.png");
    setFormImages(["/images/hero_luxury_watch.png"]);
    setUrlInput("");
    setIsAddingUrl(false);
    setFormDescription("");
    setFormRating(5.0);
    setFormReviews(0);
    setFormTag("New");
    setFormSortOrder(maxPos);
    setFormColors([]);
    setCustomColorInput("");
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
    setFormOriginalPrice(product.originalPrice || "");
    setFormDiscount(product.discount || "");
    setFormImage(product.image);
    const existingImgs = product.images && product.images.length > 0 ? product.images : [product.image];
    setFormImages(existingImgs);
    setUrlInput("");
    setIsAddingUrl(false);
    setFormDescription(product.description);
    setFormRating(product.rating);
    setFormReviews(product.reviews);
    setFormTag(product.tag || "");
    setFormSortOrder(product.sortOrder && product.sortOrder >= 1 ? product.sortOrder : 1);
    setFormColors(product.colors || []);
    setCustomColorInput("");
    
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

    const origPriceNum = typeof formOriginalPrice === "number" && formOriginalPrice > Number(formPrice) ? Number(formOriginalPrice) : undefined;
    const discountVal = formDiscount.trim() 
      ? formDiscount.trim() 
      : (origPriceNum ? `${Math.round(((origPriceNum - Number(formPrice)) / origPriceNum) * 100)}% OFF` : undefined);

    const boundedSortOrder = Math.min(Math.max(1, Number(formSortOrder) || 1), currentMaxPosition);

    const payload: Product = {
      id: finalId,
      name: formName.trim(),
      category: formCategory,
      subcategory: formCategory === "hand-watches" && formSubcategory ? formSubcategory : undefined,
      brand: formCategory === "hand-watches" && formBrand ? formBrand : undefined,
      price: Number(formPrice),
      originalPrice: origPriceNum,
      discount: discountVal,
      rating: Number(formRating),
      reviews: Number(formReviews),
      image: primaryImg,
      images: validImages.length > 0 ? validImages : [primaryImg],
      description: formDescription.trim(),
      specs: specsObject,
      featured: true, // Default to true so it can show in collections and catalog
      tag: formTag.trim() || undefined,
      sortOrder: boundedSortOrder,
      colors: formColors.length > 0 ? formColors : undefined
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
  const mensWatchesCount = products.filter(p => p.category === "hand-watches" && (p.subcategory === "mens" || !p.subcategory)).length;
  const womensWatchesCount = products.filter(p => p.category === "hand-watches" && p.subcategory === "womens").length;
  const wallClocksCount = products.filter(p => p.category === "wall-clocks").length;
  const totalAssetValue = products.reduce((acc, p) => acc + p.price, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  // Filter and sort products for Admin Panel
  const getFilteredAndSortedProducts = (category: "hand-watches" | "wall-clocks") => {
    // 1. Filter
    const filtered = products.filter(product => {
      const matchesCategory = product.category === category;
      const matchesSubcat = category === "hand-watches" && adminSubcatFilter !== "all" 
                            ? (adminSubcatFilter === "mens" ? (product.subcategory === "mens" || !product.subcategory) : product.subcategory === adminSubcatFilter)
                            : true;
      const query = adminSearchQuery.toLowerCase().trim();
      const decodedQuery = decodeURIComponent(adminSearchQuery).toLowerCase().trim();
      const matchesSearch = !query || 
                            product.id.toLowerCase().includes(query) ||
                            product.id.toLowerCase().includes(decodedQuery) ||
                            product.name.toLowerCase().includes(query) ||
                            product.description.toLowerCase().includes(query) ||
                            (product.brand && product.brand.toLowerCase().includes(query)) ||
                            (product.tag && product.tag.toLowerCase().includes(query)) ||
                            (product.colors && product.colors.some(c => c.toLowerCase().includes(query)));
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
      // default / featured: respect custom sortOrder position
      const aOrder = a.sortOrder !== undefined && a.sortOrder > 0 ? a.sortOrder : 999999;
      const bOrder = b.sortOrder !== undefined && b.sortOrder > 0 ? b.sortOrder : 999999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return products.indexOf(a) - products.indexOf(b);
    });
  };

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
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
              SWC Concierge <span className="text-gold-500 font-sans text-sm tracking-widest block uppercase mt-1">Management Portal</span>
            </h1>
            <p className="text-xs text-gray-400">
              Sign in with administrative credentials to access the timepiece curation dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-none flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Concierge Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@saleemwatchcenter.com"
                    className="w-full bg-black/60 border border-gray-800 focus:border-gold-500 rounded-none px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                  <ShieldCheck className="w-4 h-4 text-gray-600 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Security Passkey
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/60 border border-gray-800 focus:border-gold-500 rounded-none px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-600 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-4 shadow-lg hover:opacity-95 transition-opacity cursor-pointer mt-4"
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
              onClick={() => setActiveTab("orders")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all rounded cursor-pointer ${
                activeTab === "orders"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Client Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg animate-pulse flex items-center justify-center min-w-[20px] h-5">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all rounded cursor-pointer ${
                activeTab === "users"
                  ? "gold-gradient-bg text-black font-extrabold shadow-md shadow-gold-500/10"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gold-400 hover:border-gold-500/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Registered Users</span>
              </div>
              <span className="bg-white/10 text-gray-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                {allRegisteredProfiles.length}
              </span>
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
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer ${
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
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer ${
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
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer ${
              activeTab === "wall-clocks"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Clocks
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer relative ${
              activeTab === "orders"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Client Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-grow py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded whitespace-nowrap cursor-pointer ${
              activeTab === "users"
                ? "gold-gradient-bg text-black font-extrabold"
                : "bg-neutral-900 border border-gold-500/5 text-gray-400"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Users</span>
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
                  <Watch className="w-3.5 h-3.5" />
                  View Hand Watches
                </button>
                <button
                  onClick={() => setActiveTab("wall-clocks")}
                  className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-bold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  View Wall Clocks
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="border border-gold-500/40 text-white hover:bg-gold-500 hover:text-black font-bold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Client Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="border border-gold-500/40 text-white hover:bg-gold-500 hover:text-black font-bold text-xs tracking-widest uppercase px-5 py-3 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  Registered Users ({allRegisteredProfiles.length})
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
                <p className="text-xs text-gray-400 font-light">Create, modify details, set custom sort rankings, and prune wristwatches inventory.</p>
              </div>
              
              <div className="flex gap-2">
                <Link href="/admin-panel/product?action=add&category=hand-watches" className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Add Watch
                </Link>
              </div>
            </div>

            {/* Live Count Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Men's Watches Count Card */}
              <div 
                onClick={() => setAdminSubcatFilter(adminSubcatFilter === "mens" ? "all" : "mens")}
                className={`glass-panel p-4 rounded border transition-all cursor-pointer ${
                  adminSubcatFilter === "mens" 
                    ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30" 
                    : "border-gold-500/15 hover:border-gold-500/40 bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                    Men&apos;s Watches
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-mono">
                    Live
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-extrabold text-white">
                    {mensWatchesCount}
                  </span>
                  <span className="text-[10px] text-gray-400 underline decoration-gold-500/30">
                    {adminSubcatFilter === "mens" ? "Active Filter" : "Click to Filter"}
                  </span>
                </div>
              </div>

              {/* Women's Watches Count Card */}
              <div 
                onClick={() => setAdminSubcatFilter(adminSubcatFilter === "womens" ? "all" : "womens")}
                className={`glass-panel p-4 rounded border transition-all cursor-pointer ${
                  adminSubcatFilter === "womens" 
                    ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30" 
                    : "border-gold-500/15 hover:border-gold-500/40 bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                    Women&apos;s Watches
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono">
                    Live
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-extrabold text-white">
                    {womensWatchesCount}
                  </span>
                  <span className="text-[10px] text-gray-400 underline decoration-gold-500/30">
                    {adminSubcatFilter === "womens" ? "Active Filter" : "Click to Filter"}
                  </span>
                </div>
              </div>

              {/* Total Hand Watches Count Card */}
              <div 
                onClick={() => setAdminSubcatFilter("all")}
                className={`glass-panel p-4 rounded border transition-all cursor-pointer ${
                  adminSubcatFilter === "all" 
                    ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30" 
                    : "border-gold-500/15 hover:border-gold-500/40 bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                    Total Hand Watches
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                    All
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-extrabold text-gold-400">
                    {handWatchesCount}
                  </span>
                  <span className="text-[10px] text-gray-400 underline decoration-gold-500/30">
                    {adminSubcatFilter === "all" ? "Showing All" : "Reset Filter"}
                  </span>
                </div>
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
                  <option value="featured">Sort Position (1 to N)</option>
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

                    {/* Position Rank Badge */}
                    <span className="absolute top-3 left-3 bg-black/90 text-gold-400 border border-gold-500/40 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-20 flex items-center gap-1">
                      <span className="text-gold-500 text-[8px]">RANK</span>
                      #{p.sortOrder || 1}
                    </span>

                    {/* Discount Badge */}
                    {getActiveDiscount(p).hasDiscount && (
                      <span className="absolute top-3 left-20 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-md border border-red-400/30 z-10">
                        {getActiveDiscount(p).discountText || `${Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)}% OFF`}
                      </span>
                    )}
                    {/* Overlay Tag */}
                    {p.tag && (
                      <span className={`absolute top-3 ${getActiveDiscount(p).hasDiscount ? "left-40" : "left-20"} bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md z-10`}>
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

                    {/* Colors list if configured */}
                    {p.colors && p.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Colours:</span>
                        {p.colors.map((c, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-gold-300 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

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
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-gold-400 font-sans">
                        Rs. {getActiveDiscount(p).price.toLocaleString()}
                      </span>
                      {getActiveDiscount(p).hasDiscount && p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs text-gray-500 line-through font-mono">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/admin-panel/product?action=edit&id=${p.id}`} className="p-2 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors rounded cursor-pointer inline-flex items-center justify-center" title="Edit Timepiece">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
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
                <Link href="/admin-panel/product?action=add&category=wall-clocks" className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Add Clock
                </Link>
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
                    {/* Position Rank Badge */}
                    <span className="absolute top-3 left-3 bg-black/90 text-gold-400 border border-gold-500/40 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-20 flex items-center gap-1">
                      <span className="text-gold-500 text-[8px]">RANK</span>
                      #{p.sortOrder || 1}
                    </span>

                    {/* Discount Badge */}
                    {getActiveDiscount(p).hasDiscount && (
                      <span className="absolute top-3 left-20 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-md border border-red-400/30 z-10">
                        {getActiveDiscount(p).discountText || `${Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)}% OFF`}
                      </span>
                    )}
                    {/* Overlay Tag */}
                    {p.tag && (
                      <span className={`absolute top-3 ${getActiveDiscount(p).hasDiscount ? "left-40" : "left-20"} bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md z-10`}>
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

                    {/* Colors list if configured */}
                    {p.colors && p.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Colours:</span>
                        {p.colors.map((c, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-gold-300 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

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
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-gold-400 font-sans">
                        Rs. {getActiveDiscount(p).price.toLocaleString()}
                      </span>
                      {getActiveDiscount(p).hasDiscount && p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs text-gray-500 line-through font-mono">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/admin-panel/product?action=edit&id=${p.id}`} className="p-2 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black transition-colors rounded cursor-pointer inline-flex items-center justify-center" title="Edit Timepiece">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
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

        {/* ========================================================================= */}
        {/* TAB 4: CLIENT ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Client Orders Management</h2>
                <p className="text-xs text-gray-400 font-light">
                  Track customer orders, verify delivery addresses & landmarks, view ordered product IDs & colours, and update fulfillment status.
                </p>
              </div>

              <button
                onClick={() => refreshData()}
                className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1.5 cursor-pointer rounded"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Sync
              </button>
            </div>

            {/* Orders Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="glass-panel p-4 rounded border border-gold-500/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Total Orders</span>
                <p className="font-serif text-2xl font-extrabold text-white mt-1">{orders.length}</p>
                <span className="text-[9px] text-gray-500">All-time received</span>
              </div>

              <div className="glass-panel p-4 rounded border border-orange-500/30 bg-orange-500/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-orange-400 uppercase tracking-widest block font-bold">Pending Orders</span>
                  {pendingOrdersCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                  )}
                </div>
                <p className="font-serif text-2xl font-extrabold text-orange-400 mt-1">{pendingOrdersCount}</p>
                <span className="text-[9px] text-orange-300/70">Awaiting confirmation</span>
              </div>

              <div className="glass-panel p-4 rounded border border-blue-500/20 bg-blue-500/5">
                <span className="text-[10px] text-blue-400 uppercase tracking-widest block font-bold">In Transit / Shipped</span>
                <p className="font-serif text-2xl font-extrabold text-blue-400 mt-1">
                  {orders.filter(o => o.status === "Processing" || o.status === "Shipped").length}
                </p>
                <span className="text-[9px] text-blue-300/70">With courier partner</span>
              </div>

              <div className="glass-panel p-4 rounded border border-green-500/20 bg-green-500/5">
                <span className="text-[10px] text-green-400 uppercase tracking-widest block font-bold">Completed / Delivered</span>
                <p className="font-serif text-2xl font-extrabold text-green-400 mt-1">
                  {orders.filter(o => o.status === "Delivered").length}
                </p>
                <span className="text-[9px] text-green-300/70">Fulfilled orders</span>
              </div>
            </div>

            {/* Search & Status Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/40 border border-gold-500/10 p-4 rounded text-left">
              {/* Search input */}
              <div className="relative flex-grow max-w-lg">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Customer Name, Phone, City, Product ID, Watch Name..."
                  className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-10 py-2.5 focus:outline-none focus:border-gold-500 text-xs transition-all rounded"
                />
                {orderSearchQuery && (
                  <button 
                    onClick={() => setOrderSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gold-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative w-full sm:w-56">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-xs transition-all cursor-pointer appearance-none rounded"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="Pending">Pending ({orders.filter(o => o.status === "Pending").length})</option>
                  <option value="Processing">Processing ({orders.filter(o => o.status === "Processing").length})</option>
                  <option value="Shipped">Shipped ({orders.filter(o => o.status === "Shipped").length})</option>
                  <option value="Delivered">Delivered ({orders.filter(o => o.status === "Delivered").length})</option>
                  <option value="Cancelled">Cancelled ({orders.filter(o => o.status === "Cancelled").length})</option>
                </select>
              </div>
            </div>

            {/* Orders Cards Feed */}
            {(() => {
              const q = orderSearchQuery.toLowerCase().trim();
              const filteredOrders = orders.filter(o => {
                const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
                const matchesSearch = !q ||
                  o.id.toLowerCase().includes(q) ||
                  (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
                  (o.shipping_details?.recipient_name && o.shipping_details.recipient_name.toLowerCase().includes(q)) ||
                  o.phone.toLowerCase().includes(q) ||
                  o.shipping_address.toLowerCase().includes(q) ||
                  (o.shipping_details?.city && o.shipping_details.city.toLowerCase().includes(q)) ||
                  (o.shipping_details?.landmark && o.shipping_details.landmark.toLowerCase().includes(q)) ||
                  o.items.some(it => 
                    it.name.toLowerCase().includes(q) ||
                    it.product_id.toLowerCase().includes(q) ||
                    (it.color && it.color.toLowerCase().includes(q))
                  );
                return matchesStatus && matchesSearch;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="text-center py-16 border border-dashed border-gold-500/10 rounded-xl bg-black/20 space-y-3">
                    <ShoppingBag className="w-10 h-10 text-gold-500/40 mx-auto" />
                    <p className="text-gold-500 text-sm font-bold font-serif uppercase tracking-wider">No Orders Match Your Query</p>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto">
                      {orderSearchQuery ? `No records match "${orderSearchQuery}". Try clearing filters.` : "No customer orders recorded in the database."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const recipientName = order.shipping_details?.recipient_name || order.customer_name || "Valued Customer";
                    const cleanPhone = order.phone.replace(/\D/g, "");
                    const whatsappText = encodeURIComponent(
                      `Hi ${recipientName}, this is Saleem Watch Center regarding your Order #${order.id}.\n\n` +
                      `Items: ${order.items.map(i => `${i.quantity}x ${i.name} (ID: ${i.product_id}${i.color ? `, Color: ${i.color}` : ''})`).join(", ")}\n` +
                      `Total: Rs. ${order.total_amount.toLocaleString()}\n` +
                      `Delivery: ${order.shipping_address}\n\n` +
                      `Please confirm your availability for delivery.`
                    );

                    return (
                      <div 
                        key={order.id} 
                        className={`glass-panel border border-gold-500/15 rounded-xl ${expandedOrders.has(order.id) ? 'p-5 sm:p-6 space-y-5' : 'p-3 sm:p-4'} relative overflow-hidden transition-all hover:border-gold-500/30`}
                      >
                        {/* Top Header Strip: Order ID, Date, Payment & Status Updater */}
                        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${expandedOrders.has(order.id) ? 'border-b border-gold-500/10 pb-3.5' : ''}`}>
                          <div className="flex items-center gap-3 flex-wrap">
                            <button 
                              onClick={() => toggleOrderExpansion(order.id)} 
                              className="p-1.5 bg-black/40 hover:bg-gold-500/20 text-gold-400 rounded border border-gold-500/30 transition-colors"
                              title={expandedOrders.has(order.id) ? "Hide Details" : "View Details"}
                            >
                              {expandedOrders.has(order.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <span className="font-mono text-sm font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 rounded">
                              #{order.id}
                            </span>
                            <span className="font-bold text-white text-sm">
                              {recipientName}
                            </span>
                            <span className="text-gold-400 font-serif text-sm font-bold">
                              Rs. {order.total_amount.toLocaleString()}
                            </span>
                            {expandedOrders.has(order.id) && (
                              <span className="text-xs text-gray-400 hidden sm:inline-block">
                                🕒 {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 justify-between lg:justify-end w-full lg:w-auto">
                            {!expandedOrders.has(order.id) && (
                              <span className="text-xs text-gray-400 sm:hidden">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            )}
                            {expandedOrders.has(order.id) && (
                              <span className="bg-black/60 border border-gold-500/20 text-gold-300 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded hidden lg:inline-block">
                                {order.payment_method === "bank_transfer" ? "Bank Transfer" : "Cash on Delivery (COD)"}
                              </span>
                            )}
                            {/* Fulfillment Status Dropdown */}
                            <div className="flex items-center gap-2 ml-auto">
                              <span className="text-[10px] text-gray-400 uppercase font-semibold hidden sm:inline-block">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id, e.target.value as any)}
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded outline-none border cursor-pointer transition-colors ${
                                  order.status === 'Pending' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 hover:border-orange-500' :
                                  order.status === 'Processing' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:border-blue-500' :
                                  order.status === 'Shipped' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:border-purple-500' :
                                  order.status === 'Delivered' ? 'bg-green-500/15 text-green-400 border-green-500/30 hover:border-green-500' :
                                  'bg-red-500/15 text-red-400 border-red-500/30 hover:border-red-500'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {expandedOrders.has(order.id) && (
                          <div className="space-y-5 animate-fade-in-up mt-4">

                        {/* Main Grid: Customer Contact, Detailed Address, Ordered Items */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                          
                          {/* Col 1: Customer Contact & WhatsApp Button */}
                          <div className="lg:col-span-3 space-y-2 text-xs bg-black/40 border border-gold-500/10 p-3.5 rounded-lg">
                            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block border-b border-gray-900 pb-1 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gold-500" />
                              Customer Info
                            </span>
                            <div className="space-y-1">
                              <p className="font-bold text-white text-sm">{recipientName}</p>
                              <p className="text-gray-300 font-mono flex items-center gap-1">
                                📱 {order.phone}
                              </p>
                              {order.shipping_details?.alt_phone && (
                                <p className="text-gray-400 font-mono text-[11px]">
                                  Alt: {order.shipping_details.alt_phone}
                                </p>
                              )}
                              {order.email && (
                                <p className="text-gray-400 truncate" title={order.email}>
                                  ✉️ {order.email}
                                </p>
                              )}
                            </div>

                            {/* 1-Click WhatsApp Concierge Chat Button */}
                            {cleanPhone && (
                              <div className="pt-1.5">
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${whatsappText}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center gap-1.5 bg-green-600/20 hover:bg-green-600 border border-green-500/40 text-green-300 hover:text-white py-1.5 px-2 rounded font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Chat on WhatsApp
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Col 2: Detailed Multi-Field Shipping Address */}
                          <div className="lg:col-span-4 space-y-2 text-xs bg-black/40 border border-gold-500/10 p-3.5 rounded-lg">
                            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block border-b border-gray-900 pb-1 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gold-500" />
                              Shipping Address & Landmark
                            </span>
                            <div className="space-y-1 text-gray-300 leading-relaxed">
                              <p className="font-medium text-white">
                                {order.shipping_details?.street_address || order.shipping_address}
                              </p>
                              {order.shipping_details?.apartment_suite && (
                                <p className="text-gray-400 text-[11px]">
                                  🏢 Apt/Floor: {order.shipping_details.apartment_suite}
                                </p>
                              )}
                              {order.shipping_details?.landmark && (
                                <p className="text-gold-400 font-semibold text-[11px] bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20 inline-block">
                                  📍 Landmark: {order.shipping_details.landmark}
                                </p>
                              )}
                              <p className="text-white font-bold pt-0.5">
                                🏙️ {order.shipping_details?.city || 'Pakistan'}, {order.shipping_details?.province || ''}
                              </p>
                              {order.shipping_details?.order_notes && (
                                <p className="text-gray-400 text-[11px] italic bg-black/50 p-1.5 rounded border border-gray-900 mt-1">
                                  📝 &ldquo;{order.shipping_details.order_notes}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Col 3: Ordered Items Detail (Product ID, Title, Colour, Qty, Unit Price) */}
                          <div className="lg:col-span-5 space-y-2 text-xs bg-black/40 border border-gold-500/10 p-3.5 rounded-lg">
                            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block border-b border-gray-900 pb-1 flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-gold-500" />
                              Ordered Timepieces ({order.items.length})
                            </span>
                            
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-black/60 p-2.5 rounded border border-gold-500/10">
                                  {it.image && (
                                    <div className="relative w-12 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-gold-500/20">
                                      <Image src={it.image} alt={it.name} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div className="flex-grow space-y-0.5 min-w-0">
                                    <div className="flex justify-between items-start gap-1">
                                      <p className="font-serif font-bold text-white text-xs truncate" title={it.name}>
                                        {it.name}
                                      </p>
                                      <span className="font-mono text-gold-400 font-bold text-xs flex-shrink-0">
                                        Rs. {(it.price * it.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                                      {/* Product ID Badge with Link */}
                                      <Link
                                        href={`/product/${encodeURIComponent(it.product_id)}`}
                                        target="_blank"
                                        className="font-mono text-gold-400 hover:underline font-bold bg-gold-500/10 px-1.5 py-0.2 rounded flex items-center gap-0.5"
                                      >
                                        ID: {it.product_id}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </Link>

                                      {/* Color Variant Badge */}
                                      {it.color && (
                                        <span className="bg-neutral-800 text-gold-300 border border-gold-500/20 px-1.5 py-0.2 rounded font-medium">
                                          Colour: {it.color}
                                        </span>
                                      )}

                                      {/* Quantity */}
                                      <span className="text-gray-400">
                                        Qty: <strong className="text-white">{it.quantity}</strong> (Rs. {it.price.toLocaleString()} ea)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Card Footer: Amount Breakdown */}
                        <div className="border-t border-gold-500/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] text-gray-500 font-mono">
                            Client Identifier: {order.user_id}
                          </span>

                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-400 uppercase text-[10px] tracking-wider">Total Payable:</span>
                            <span className="font-serif text-lg font-extrabold text-gold-400">
                              Rs. {order.total_amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REGISTERED USERS & PROFILES */}
        {/* ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Registered Users Directory</h2>
                <p className="text-xs text-gray-400 font-light">
                  Browse customer account profiles, registration timestamps, and cross-reference total order activity.
                </p>
              </div>

              <button
                onClick={() => refreshData()}
                className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-4 py-2.5 hover:opacity-90 flex items-center gap-1.5 cursor-pointer rounded"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Sync
              </button>
            </div>

            {/* Users Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded border border-gold-500/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Registered Accounts</span>
                <p className="font-serif text-3xl font-extrabold text-white mt-1">{allRegisteredProfiles.length}</p>
                <span className="text-[9px] text-gray-500">Total customer profiles</span>
              </div>

              <div className="glass-panel p-4 rounded border border-gold-500/10">
                <span className="text-[10px] text-gold-400 uppercase tracking-widest block font-bold">Active Buyers</span>
                <p className="font-serif text-3xl font-extrabold text-gold-400 mt-1">
                  {new Set(orders.map(o => o.user_id)).size}
                </p>
                <span className="text-[9px] text-gray-500">Users who have placed orders</span>
              </div>

              <div className="glass-panel p-4 rounded border border-gold-500/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Cloud Sync Status</span>
                <p className="font-serif text-xl font-bold text-green-400 mt-1">✓ Real-time Sync</p>
                <span className="text-[9px] text-gray-500">Supabase Profiles Connected</span>
              </div>
            </div>

            {/* Search Controls */}
            <div className="bg-neutral-900/40 border border-gold-500/10 p-4 rounded text-left">
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search user by Name, Email, or Phone..."
                  className="w-full bg-black border border-gold-500/15 text-white pl-10 pr-10 py-2.5 focus:outline-none focus:border-gold-500 text-xs transition-all rounded"
                />
                {userSearchQuery && (
                  <button 
                    onClick={() => setUserSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gold-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Users Cards Grid */}
            {(() => {
              const uQuery = userSearchQuery.toLowerCase().trim();
              const filteredProfiles = allRegisteredProfiles.filter(p => {
                if (!uQuery) return true;
                return (
                  (p.full_name && p.full_name.toLowerCase().includes(uQuery)) ||
                  (p.email && p.email.toLowerCase().includes(uQuery)) ||
                  (p.phone && p.phone.toLowerCase().includes(uQuery))
                );
              });

              if (filteredProfiles.length === 0) {
                return (
                  <div className="text-center py-16 border border-dashed border-gold-500/10 rounded-xl bg-black/20 space-y-3">
                    <Users className="w-10 h-10 text-gold-500/40 mx-auto" />
                    <p className="text-gold-500 text-sm font-bold font-serif uppercase tracking-wider">No User Profiles Found</p>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto">
                      {userSearchQuery ? `No profiles match "${userSearchQuery}".` : "No registered accounts recorded."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((p) => {
                    const userOrders = orders.filter(o => 
                      o.user_id === p.id || 
                      o.user_id === p.email || 
                      (p.phone && o.phone === p.phone)
                    );
                    const cleanPhone = p.phone ? p.phone.replace(/\D/g, "") : "";

                    return (
                      <div 
                        key={p.id || p.email} 
                        className="glass-panel border border-gold-500/10 p-5 rounded-xl flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:border-gold-500/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-serif font-extrabold text-base flex-shrink-0">
                              {(p.full_name || p.email)?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-serif font-bold text-white text-sm truncate">{p.full_name || 'Customer'}</h4>
                              <p className="text-xs text-gray-400 truncate">{p.email}</p>
                            </div>
                          </div>

                          <span className="bg-gold-500/10 border border-gold-500/20 text-gold-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold flex-shrink-0">
                            {userOrders.length} {userOrders.length === 1 ? "order" : "orders"}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs border-t border-gold-500/10 pt-3">
                          {p.phone && (
                            <p className="text-gray-300 font-mono flex items-center gap-1">
                              📱 {p.phone}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-500 font-mono">
                            Joined: {p.created_at ? new Date(p.created_at).toLocaleDateString() : "Recent"}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        {cleanPhone && (
                          <div className="border-t border-gray-900 pt-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${p.full_name || 'Customer'}, Saleem Watch Center concierge here!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 bg-green-600/10 hover:bg-green-600 border border-green-500/30 text-green-300 hover:text-white py-1.5 px-3 rounded font-bold text-[10px] uppercase tracking-wider transition-all"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp Customer
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

      </main>

    </div>
  );
}
