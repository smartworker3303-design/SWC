"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, Plus, Trash2, Link as LinkIcon, 
  UploadCloud, Star, Save, X, Loader2, CheckCircle2
} from "lucide-react";
import { useProducts, getProductGroupKey } from "../../../context/ProductsContext";
import { Product, CustomerReview } from "../../../data";

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

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "add"; // "add" or "edit"
  const editId = searchParams.get("id");

  const { products, addProduct, updateProduct, isLoading } = useProducts();

  // Form Field States
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"hand-watches" | "wall-clocks">("hand-watches");
  const [formSubcategory, setFormSubcategory] = useState<"mens" | "womens" | "">("");
  const [formBrand, setFormBrand] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | "">("");
  const [formDiscount, setFormDiscount] = useState("");
  const [formDiscountExpiry, setFormDiscountExpiry] = useState<number | "">(""); // hours
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
  const [formCustomerReviews, setFormCustomerReviews] = useState<CustomerReview[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState<Partial<CustomerReview>>({ rating: 5, verified: true, date: new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) });

  const handleAddReview = () => {
    if (!newReview.name || !newReview.text) {
      setFormError("Please provide reviewer name and text");
      return;
    }
    const r: CustomerReview = {
      id: Date.now().toString(),
      name: newReview.name || '',
      rating: Number(newReview.rating) || 5,
      date: newReview.date || new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}),
      title: newReview.title || '',
      text: newReview.text || '',
      verified: Boolean(newReview.verified),
      images: newReview.images || []
    };
    setFormCustomerReviews([...formCustomerReviews, r]);
    setNewReview({ rating: 5, verified: true, date: new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) });
    setIsAddingReview(false);
  };
  
  const handleRemoveReview = (id: string) => {
    setFormCustomerReviews(formCustomerReviews.filter(r => r.id !== id));
  };
  
  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingImages(true);
        const dataUrl = await processImageFile(file);
        setNewReview(prev => ({ ...prev, images: [...(prev.images || []), dataUrl] }));
      } catch (err) {
        setFormError("Failed to process review image.");
      } finally {
        setIsProcessingImages(false);
      }
    }
  };

  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Movement", value: "Quartz" },
    { key: "Water Resistance", value: "50m (5 ATM)" }
  ]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Dynamic max allowed position
  const currentMaxPosition = useMemo(() => {
    let groupKey: string;
    if (formCategory === "hand-watches") {
      groupKey = formSubcategory === "womens" ? "hand-watches:womens" : "hand-watches:mens";
    } else {
      groupKey = formCategory;
    }
    const otherItemsInGroup = products.filter(p => {
      const pGroupKey = getProductGroupKey(p);
      return pGroupKey === groupKey && (action === "add" || p.id !== editId);
    });
    return otherItemsInGroup.length + 1;
  }, [formCategory, formSubcategory, products, action, editId]);

  // Initialize Form
  useEffect(() => {
    if (isLoading || hasInitialized) return;

    if (action === "edit" && editId) {
      const prod = products.find((p) => p.id === editId);
      if (prod) {
        setFormId(prod.id);
        setFormName(prod.name);
        setFormCategory(prod.category);
        setFormSubcategory(prod.subcategory || "");
        setFormBrand(prod.brand || "");
        setFormPrice(prod.price);
        setFormOriginalPrice(prod.originalPrice || "");
        setFormDiscount(prod.discount || "");
        
        // Calculate remaining hours if timer is active
        if (prod.discountExpiresAt) {
           const diffMs = new Date(prod.discountExpiresAt).getTime() - Date.now();
           if (diffMs > 0) {
              setFormDiscountExpiry(Math.ceil(diffMs / (1000 * 60 * 60)));
           } else {
              setFormDiscountExpiry(""); // expired
           }
        } else {
           setFormDiscountExpiry("");
        }

        setFormImage(prod.image);
        setFormImages(prod.images && prod.images.length > 0 ? prod.images : [prod.image]);
        setFormDescription(prod.description);
        setFormRating(prod.rating);
        setFormReviews(prod.reviews);
        setFormTag(prod.tag || "");
        setFormSortOrder(prod.sortOrder && prod.sortOrder >= 1 ? prod.sortOrder : 1);
        setFormColors(prod.colors || []);
        setFormCustomerReviews(prod.customerReviews || []);
        
        const mappedSpecs = Object.entries(prod.specs).map(([key, value]) => ({ key, value }));
        setFormSpecs(mappedSpecs.length > 0 ? mappedSpecs : [
          { key: "Movement", value: "Quartz" },
          { key: "Water Resistance", value: "50m (5 ATM)" }
        ]);
      } else {
        setFormError("Product not found");
      }
    } else {
       // Add mode defaults
       const cat = searchParams.get("category") as "hand-watches" | "wall-clocks" || "hand-watches";
       setFormCategory(cat);
       setFormSubcategory(cat === "hand-watches" ? "mens" : "");
    }
    
    setHasInitialized(true);
  }, [action, editId, isLoading, products, hasInitialized, searchParams]);


  const generateUniqueProductId = (category: "hand-watches" | "wall-clocks", name?: string) => {
    const prefix = category === "wall-clocks" ? "wc" : "hw";
    const slug = name 
      ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) 
      : "";
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    let candidate = slug ? `${slug}-${randomSuffix}` : `${prefix}-${Date.now().toString(36)}-${randomSuffix}`;
    let counter = 1;
    while (products.some(p => p.id.toLowerCase() === candidate.toLowerCase())) {
      candidate = `${candidate}-${counter++}`;
    }
    return candidate;
  };

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

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...formSpecs];
    updated[index][field] = val;
    setFormSpecs(updated);
  };
  const addSpecRow = () => setFormSpecs([...formSpecs, { key: "", value: "" }]);
  const removeSpecRow = (index: number) => setFormSpecs(formSpecs.filter((_, i) => i !== index));

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
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL("image/webp", 0.82);
          resolve(optimizedDataUrl);
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingImages(true);
        const dataUrl = await processImageFile(file);
        const newImages = [...formImages];
        newImages[0] = dataUrl;
        setFormImages(newImages);
      } catch (err) {
        setFormError("Failed to process main image.");
      } finally {
        setIsProcessingImages(false);
      }
    }
  };

  const handleGalleryMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setIsProcessingImages(true);
      const currentImages = formImages.filter(img => img && img.trim());
      const availableSlots = 5 - currentImages.length;
      
      const filesToProcess = Array.from(files).slice(0, availableSlots);
      const optimizedDataUrls = await Promise.all(filesToProcess.map(processImageFile));
      
      setFormImages([...currentImages, ...optimizedDataUrls]);
    } catch (err) {
      setFormError("Failed to process one or more gallery images.");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const currentImages = formImages.filter(img => img && img.trim());
      if (currentImages.length < 5) {
        setFormImages([...currentImages, urlInput.trim()]);
      }
      setUrlInput("");
      setIsAddingUrl(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formImages];
    if (index === 0) {
      newImages[0] = newImages[1] || "";
      newImages.splice(1, 1);
    } else {
      newImages.splice(index, 1);
    }
    setFormImages(newImages);
  };

  const handleMakeMainImage = (index: number) => {
    if (index === 0 || !formImages[index]) return;
    const newImages = [...formImages];
    const temp = newImages[0];
    newImages[0] = newImages[index];
    newImages[index] = temp;
    setFormImages(newImages);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = formImages.map(img => img.trim()).filter(img => img.length > 0);
    const primaryImg = validImages[0];

    if (!formName.trim() || !primaryImg || !formDescription.trim()) {
      setFormError("Please fill in all required fields (Timepiece Name, at least 1 Image, Description).");
      window.scrollTo(0, 0);
      return;
    }
    
    if (formCategory === "hand-watches" && !formSubcategory) {
      setFormError("Please select a subcategory (Men's or Women's) for hand watches.");
      window.scrollTo(0, 0);
      return;
    }

    const specsObject: { [key: string]: string } = {};
    formSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });

    let finalId: string;
    if (action === "add") {
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

    let calculatedExpiry: string | undefined = undefined;
    if (typeof formDiscountExpiry === "number" && formDiscountExpiry > 0 && discountVal) {
      calculatedExpiry = new Date(Date.now() + formDiscountExpiry * 60 * 60 * 1000).toISOString();
    }

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
      discountExpiresAt: calculatedExpiry,
      rating: Number(formRating),
      reviews: Number(formReviews),
      image: primaryImg,
      images: validImages.length > 0 ? validImages : [primaryImg],
      description: formDescription.trim(),
      specs: specsObject,
      featured: true,
      tag: formTag.trim() || undefined,
      sortOrder: boundedSortOrder,
      colors: formColors.length > 0 ? formColors : undefined,
      customerReviews: formCustomerReviews.length > 0 ? formCustomerReviews : undefined
    };

    try {
      setIsSaving(true);
      if (action === "add") {
        if (products.some(p => p.id.toLowerCase() === payload.id.toLowerCase())) {
          payload.id = generateUniqueProductId(formCategory, formName);
        }
        await addProduct(payload);
        window.scrollTo(0, 0);
        setFormSuccess("Product added successfully! Returning to dashboard...");
      } else {
        await updateProduct(payload);
        window.scrollTo(0, 0);
        setFormSuccess("Product updated successfully! Returning to dashboard...");
      }
      
      // Navigate back to admin panel after a brief delay
      setTimeout(() => {
        router.push('/admin-panel');
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product. Please try again.";
      setFormError(msg);
      window.scrollTo(0, 0);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/admin-panel')}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Admin Panel
          </button>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {action === "add" ? "Create New Timepiece" : `Modify Timepiece: ${formName}`}
          </h1>
          <p className="text-sm text-gray-400 font-light mt-1">Specify layout elements and pricing coefficients.</p>
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6 rounded text-sm text-red-400 font-medium flex items-center gap-2">
            <span className="font-bold text-lg leading-none shrink-0">!</span>
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 p-4 mb-6 rounded text-sm text-green-400 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-8 glass-panel border border-gold-500/15 p-6 sm:p-8 rounded-xl shadow-2xl">
          
          {/* General Information */}
          <div className="space-y-5">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/20 pb-2">General Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {action === "edit" ? (
                <div className="space-y-1">
                  <label htmlFor="form-id" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Product ID (Read-Only)</label>
                  <input
                    id="form-id"
                    type="text"
                    disabled
                    value={formId}
                    className="w-full bg-neutral-900 border border-gold-500/15 text-gold-400 py-2.5 px-3 text-sm opacity-75 cursor-not-allowed font-mono rounded"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Product ID</label>
                  <div className="w-full bg-neutral-900/80 border border-gold-500/20 text-gold-400 py-2.5 px-3 text-sm italic flex items-center gap-1.5 rounded">
                    <span className="font-mono text-gold-500 text-xs">✨ Auto-assigned upon save</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="form-name" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Timepiece Name <span className="text-red-500">*</span></label>
                <input
                  id="form-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Navigator Chronograph"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label htmlFor="form-category" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Category</label>
                <select
                  id="form-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as "hand-watches" | "wall-clocks")}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                >
                  <option value="hand-watches">Hand Watch</option>
                  <option value="wall-clocks">Wall Clock</option>
                </select>
              </div>

              {formCategory === "hand-watches" && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="form-subcategory" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Subcategory</label>
                    <select
                      id="form-subcategory"
                      value={formSubcategory}
                      onChange={(e) => setFormSubcategory(e.target.value as "mens" | "womens" | "")}
                      className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                    >
                      <option value="">None / Unisex</option>
                      <option value="mens">Men&apos;s Watches</option>
                      <option value="womens">Women&apos;s Watches</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="form-brand" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Brand</label>
                    <select
                      id="form-brand"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                    >
                      <option value="">None / Unbranded</option>
                      <option value="Rolex">Rolex</option>
                      <option value="Patek-phillip">Patek-phillip</option>
                      <option value="Tissot">Tissot</option>
                      <option value="Hublot">Hublot</option>
                      <option value="Tag Heuer">Tag Heuer</option>
                      <option value="skmei">skmei</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pricing & Deals */}
          <div className="space-y-5">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/20 pb-2 flex items-center gap-2">
              Pricing & Discounts
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="form-price" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                  Selling Price (PKR Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-price"
                  type="number"
                  required
                  min={0}
                  value={formPrice}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm font-bold"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="form-orig-price" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                  Original Price (Strike-through)
                </label>
                <input
                  id="form-orig-price"
                  type="number"
                  min={0}
                  value={formOriginalPrice}
                  onChange={(e) => handleOriginalPriceChange(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 1500"
                  className="w-full bg-black border border-gold-500/15 text-gray-300 py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="form-discount" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                  Discount Badge Text
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    id="form-discount"
                    type="text"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    placeholder="e.g. 33% OFF, BUY 1 GET 1 FREE"
                    className="w-full bg-black border border-gold-500/15 text-gold-400 py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm font-semibold uppercase"
                  />
                  <label className="flex items-center gap-2 cursor-pointer w-fit group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formDiscount.toUpperCase() === "BUY 1 GET 1 FREE" ? "bg-gold-500 border-gold-500" : "bg-black border-gold-500/30 group-hover:border-gold-500/60"}`}>
                      {formDiscount.toUpperCase() === "BUY 1 GET 1 FREE" && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formDiscount.toUpperCase() === "BUY 1 GET 1 FREE"}
                      onChange={(e) => setFormDiscount(e.target.checked ? "BUY 1 GET 1 FREE" : "")}
                    />
                    <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold group-hover:text-gold-300">Offer: Buy 1 Get 1 Free</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="form-discount-expiry" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex justify-between">
                  <span>Discount Expiration Timer</span>
                  <span className="text-gold-500 lowercase font-normal">(Optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="form-discount-expiry"
                    type="number"
                    min={1}
                    value={formDiscountExpiry}
                    onChange={(e) => setFormDiscountExpiry(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Duration"
                    className="flex-1 bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                  />
                  <div className="bg-neutral-900 border border-gold-500/15 text-gray-400 px-4 py-2.5 rounded text-sm font-mono flex items-center">
                    Hours
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">If set, a countdown timer will appear on the website. The discount auto-hides when expired.</p>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setFormDiscountExpiry(12)} className="text-[10px] bg-black border border-gold-500/20 text-gold-400 px-2 py-1 rounded hover:bg-gold-500/10">12h</button>
                  <button type="button" onClick={() => setFormDiscountExpiry(24)} className="text-[10px] bg-black border border-gold-500/20 text-gold-400 px-2 py-1 rounded hover:bg-gold-500/10">24h</button>
                  <button type="button" onClick={() => setFormDiscountExpiry(48)} className="text-[10px] bg-black border border-gold-500/20 text-gold-400 px-2 py-1 rounded hover:bg-gold-500/10">48h</button>
                  <button type="button" onClick={() => setFormDiscountExpiry("")} className="text-[10px] bg-black border border-gray-500/20 text-gray-400 px-2 py-1 rounded hover:bg-gray-800">Clear</button>
                </div>
              </div>

            </div>
          </div>

          {/* Visibility & Organization */}
          <div className="space-y-5">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/20 pb-2">Visibility & Organization</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="form-tag" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Catalog Overlay Tag</label>
                <input
                  id="form-tag"
                  type="text"
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  placeholder="e.g. Signature, Bestseller"
                  className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="form-sort-order" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                    Display Position (Rank) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-gold-400">1 to {currentMaxPosition}</span>
                </div>
                <select
                  id="form-sort-order"
                  value={Math.min(Math.max(1, formSortOrder), currentMaxPosition)}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="w-full bg-black border border-gold-500/20 text-gold-300 py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm font-mono appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '14px'
                  }}
                >
                  {Array.from({ length: currentMaxPosition }, (_, i) => i + 1).map((pos) => (
                    <option key={pos} value={pos}>
                      Position #{pos} {pos === 1 ? "(Top / First in List)" : pos === currentMaxPosition ? `(Position ${pos} - End of List)` : `(Position ${pos})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Images Manager */}
          <div className="space-y-4 border border-gold-500/20 bg-black/40 p-5 rounded-lg text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-500/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400 font-serif">
                    Product Images ({formImages.filter(img => img && img.trim()).length}/5 Total)
                  </h4>
                  {isProcessingImages && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gold-300 font-mono animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Optimizing...
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">The 1st image is the Main Cover. Additional images appear in the gallery.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUrl(!isAddingUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-300 hover:text-gold-400 border border-gold-500/20 hover:border-gold-500/50 bg-black/60 rounded transition-colors self-start sm:self-auto"
              >
                <LinkIcon className="w-3 h-3 text-gold-500" />
                {isAddingUrl ? "Hide URL Input" : "Paste Web URL"}
              </button>
            </div>

            {isAddingUrl && (
              <div className="bg-neutral-900/95 border border-gold-500/25 p-4 rounded space-y-2">
                <label className="text-[10px] text-gold-400 uppercase tracking-wider font-bold block">
                  Add Image via Local Path or Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-black border border-gold-500/30 text-white px-3 py-2 text-xs font-mono rounded focus:outline-none focus:border-gold-500"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim() || formImages.filter(img => img && img.trim()).length >= 5}
                    className="px-4 py-2 gold-gradient-bg text-black text-xs font-extrabold uppercase rounded disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Main Cover */}
              <div className="md:col-span-4 bg-neutral-950 border-2 border-gold-500/40 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-gold-500 text-black px-2 py-0.5 rounded-sm">★ Main Cover</span>
                </div>
                <div className="relative h-48 w-full bg-black rounded border border-gold-500/20 overflow-hidden group">
                  {formImages[0] && formImages[0].trim() ? (
                    <>
                      <Image src={formImages[0]} alt="Main" fill className="object-contain p-2" />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button type="button" onClick={() => document.getElementById("main-image-input")?.click()} className="px-3 py-1.5 bg-gold-500 text-black font-bold text-[10px] uppercase rounded hover:bg-gold-400">Change</button>
                        {formImages.length > 1 && (
                          <button type="button" onClick={() => handleRemoveImage(0)} className="p-1.5 bg-red-950 text-red-300 border border-red-500/40 rounded hover:bg-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div onClick={() => document.getElementById("main-image-input")?.click()} className="text-center p-4 cursor-pointer hover:text-gold-400 h-full flex flex-col items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-gold-500/70 mb-2 animate-bounce" />
                      <p className="text-[11px] font-bold text-gray-300 uppercase">Click to Upload</p>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => document.getElementById("main-image-input")?.click()} className="w-full py-2 px-3 border border-gold-500/40 bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-black font-bold text-[10px] uppercase rounded transition-all flex items-center justify-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Change Cover
                </button>
                <input type="file" id="main-image-input" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
              </div>

              {/* Gallery */}
              <div className="md:col-span-8 bg-neutral-950 border border-gold-500/15 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Gallery Views (Images 2-5)</span>
                  {formImages.filter(img => img && img.trim()).length < 5 && (
                    <button type="button" onClick={() => document.getElementById("gallery-multi-input")?.click()} className="inline-flex items-center gap-1 px-3 py-1.5 gold-gradient-bg text-black font-extrabold text-[10px] uppercase rounded">
                      <Plus className="w-3 h-3" /> Add Images
                    </button>
                  )}
                </div>
                <input type="file" id="gallery-multi-input" accept="image/*" multiple onChange={handleGalleryMultipleUpload} className="hidden" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formImages.slice(1).map((imgUrl, sliceIdx) => {
                    const actualIdx = sliceIdx + 1;
                    if (!imgUrl || !imgUrl.trim()) return null;
                    return (
                      <div key={actualIdx} className="relative h-32 bg-black rounded-lg border border-gold-500/20 overflow-hidden flex flex-col group">
                        <div className="relative w-full h-full">
                          <Image src={imgUrl} alt={`Gallery #${actualIdx + 1}`} fill className="object-contain p-1.5" />
                        </div>
                        <span className="absolute top-1.5 left-1.5 text-[8px] font-bold bg-black/80 text-gold-400 px-1.5 py-0.5 rounded">#{actualIdx + 1}</span>
                        <button type="button" onClick={() => handleRemoveImage(actualIdx)} className="absolute top-1.5 right-1.5 p-1 bg-red-950 text-red-300 rounded-full hover:bg-red-600">
                          <X className="w-2.5 h-2.5" />
                        </button>
                        <button type="button" onClick={() => handleMakeMainImage(actualIdx)} className="w-full py-1.5 bg-neutral-900 hover:bg-gold-500 text-gray-300 hover:text-black text-[9px] font-bold uppercase border-t border-gold-500/20 flex items-center justify-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Make Main
                        </button>
                      </div>
                    );
                  })}
                  {formImages.filter(img => img && img.trim()).length < 5 && (
                    <div onClick={() => document.getElementById("gallery-multi-input")?.click()} className="h-32 border-2 border-dashed border-gold-500/25 hover:border-gold-500/60 bg-gold-500/5 hover:bg-gold-500/10 rounded-lg flex flex-col items-center justify-center cursor-pointer group">
                      <Plus className="w-6 h-6 text-gold-500/70 group-hover:text-gold-400 mb-1" />
                      <span className="text-[10px] font-bold text-gray-300 uppercase">+ Add Image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-5">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/20 pb-2 flex items-center justify-between">
              <span>Customer Reviews (Admin Override)</span>
              <button 
                type="button" 
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="px-2.5 py-1 bg-gold-500 text-black text-[9px] uppercase font-extrabold rounded hover:bg-gold-400"
              >
                + Add Review
              </button>
            </h2>

            {isAddingReview && (
              <div className="bg-neutral-900 border border-gold-500/20 p-4 rounded space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Reviewer Name</label>
                    <input 
                      type="text" 
                      value={newReview.name || ''} 
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})} 
                      className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Date (MM/DD/YYYY)</label>
                    <input 
                      type="text" 
                      value={newReview.date || ''} 
                      onChange={(e) => setNewReview({...newReview, date: e.target.value})} 
                      className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                      placeholder="e.g. 09/02/2025"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Rating (1-5)</label>
                    <select 
                      value={newReview.rating || 5} 
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})} 
                      className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input 
                        type="checkbox" 
                        checked={newReview.verified || false} 
                        onChange={(e) => setNewReview({...newReview, verified: e.target.checked})} 
                        className="accent-gold-500 w-4 h-4"
                      />
                      <span className="text-sm text-white font-medium">Verified Buyer</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Review Title (Optional)</label>
                    <input 
                      type="text" 
                      value={newReview.title || ''} 
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})} 
                      className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 rounded focus:outline-none focus:border-gold-500 text-sm uppercase"
                      placeholder="e.g. GOOD QUALITY WATCH"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Review Text</label>
                    <textarea 
                      value={newReview.text || ''} 
                      onChange={(e) => setNewReview({...newReview, text: e.target.value})} 
                      className="w-full bg-black border border-gold-500/15 text-white py-2 px-3 rounded focus:outline-none focus:border-gold-500 text-sm min-h-[80px]"
                      placeholder="Write review text here..."
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block flex justify-between">
                      <span>Review Images (Optional)</span>
                      <button type="button" onClick={() => document.getElementById("review-img-upload")?.click()} className="text-gold-400 hover:text-gold-300 font-bold underline decoration-gold-500/30">+ Upload Photo</button>
                    </label>
                    <input type="file" id="review-img-upload" accept="image/*" onChange={handleReviewImageUpload} className="hidden" />
                    {newReview.images && newReview.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {newReview.images.map((img, i) => (
                          <div key={i} className="relative w-16 h-16 border border-gold-500/20 bg-black">
                            <Image src={img} alt="Review img" fill className="object-cover" />
                            <button type="button" onClick={() => setNewReview({...newReview, images: newReview.images?.filter((_, idx) => idx !== i)})} className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddingReview(false)} className="px-4 py-2 border border-gray-500/30 text-gray-400 rounded text-xs font-bold">Cancel</button>
                  <button type="button" onClick={handleAddReview} className="px-4 py-2 bg-gold-500 text-black rounded text-xs font-bold uppercase tracking-wide hover:bg-gold-400">Save Review</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {formCustomerReviews.map(review => (
                <div key={review.id} className="flex items-start justify-between border border-gold-500/10 bg-black/20 p-4 rounded">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-600'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white uppercase">{review.name}</span>
                      {review.verified && <span className="px-1.5 py-0.5 bg-gold-500/20 text-gold-500 text-[9px] rounded font-bold">Verified</span>}
                    </div>
                    {review.title && <p className="text-sm font-bold text-gray-300 uppercase mt-1">{review.title}</p>}
                    <p className="text-sm text-gray-400 italic">"{review.text}"</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {review.images.map((img, i) => (
                           <div key={i} className="relative w-12 h-12 border border-gold-500/20 bg-black">
                            <Image src={img} alt="Review img" fill className="object-cover" />
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => handleRemoveReview(review.id)} className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formCustomerReviews.length === 0 && !isAddingReview && (
                <div className="text-center py-6 border border-dashed border-gray-600/30 rounded text-gray-500 text-sm">
                  No reviews yet. Click "Add Review" to create one.
                </div>
              )}
            </div>
          </div>

          {/* Details & Colors */}
          <div className="space-y-5">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-widest border-b border-gold-500/20 pb-2">Details & Specifications</h2>
            
            <div className="space-y-3 border border-gold-500/15 bg-black/30 p-5 rounded-lg">
              <label className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block font-serif">Available Colours / Variations</label>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = formColors.some(c => c.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormColors(formColors.filter(c => c.toLowerCase() !== preset.name.toLowerCase()));
                        } else {
                          setFormColors([...formColors, preset.name]);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-full border ${isSelected ? "bg-gold-500 text-black border-gold-400 font-bold" : "bg-black/60 text-gray-300 border-gold-500/20"}`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ background: preset.bg }} />
                      {preset.name}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  placeholder="Type custom color and click + Add"
                  className="flex-1 bg-black border border-gold-500/20 text-white py-2 px-3 rounded text-sm focus:border-gold-500"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomColor())}
                />
                <button type="button" onClick={handleAddCustomColor} disabled={!customColorInput.trim()} className="px-4 bg-gold-500 text-black font-bold text-[10px] uppercase rounded">
                  + Add
                </button>
              </div>

              {formColors.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-900">
                  {formColors.map((colorName, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-gold-500/30 text-white text-xs">
                      {colorName}
                      <button type="button" onClick={() => setFormColors(formColors.filter((_, i) => i !== idx))} className="text-gray-500 hover:text-red-400 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="form-description" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Item Description <span className="text-red-500">*</span></label>
              <textarea
                id="form-description"
                required
                rows={4}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Detail timepiece caliber complications..."
                className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded focus:outline-none focus:border-gold-500 text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Technical Specifications</label>
                <button type="button" onClick={addSpecRow} className="text-[9px] text-gold-400 font-bold uppercase flex items-center gap-1 border border-gold-500/20 px-2.5 py-1.5 rounded bg-gold-500/5 hover:bg-gold-500/10">
                  <Plus className="w-3 h-3" /> Add Spec Row
                </button>
              </div>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {formSpecs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input type="text" placeholder="Key" value={spec.key} onChange={(e) => handleSpecChange(idx, "key", e.target.value)} className="flex-grow bg-black border border-gold-500/10 text-white py-2 px-3 rounded text-sm" />
                    <input type="text" placeholder="Value" value={spec.value} onChange={(e) => handleSpecChange(idx, "value", e.target.value)} className="flex-grow bg-black border border-gold-500/10 text-white py-2 px-3 rounded text-sm" />
                    <button type="button" onClick={() => removeSpecRow(idx)} className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <div className="space-y-1">
                <label htmlFor="form-rating" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Initial Rating</label>
                <input id="form-rating" type="number" step="0.1" min="1" max="5" required value={formRating} onChange={(e) => setFormRating(Number(e.target.value))} className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded text-sm" />
              </div>
              <div className="space-y-1">
                <label htmlFor="form-reviews" className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Reviews Count</label>
                <input id="form-reviews" type="number" required min={0} value={formReviews} onChange={(e) => setFormReviews(Number(e.target.value))} className="w-full bg-black border border-gold-500/15 text-white py-2.5 px-3 rounded text-sm" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-gold-500/20 pt-6 mt-8">
            <button
              type="button"
              onClick={() => router.push('/admin-panel')}
              className="px-6 py-3 border border-gold-500/20 text-gray-300 hover:border-gold-500/50 hover:text-white text-xs font-bold uppercase tracking-widest rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-8 py-3 rounded hover:opacity-90 flex justify-center items-center gap-2 shadow-lg disabled:opacity-60"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> {action === "add" ? "Create Product" : "Save Changes"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex justify-center items-center"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}>
      <ProductFormContent />
    </Suspense>
  );
}
