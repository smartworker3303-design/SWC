"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Heart, 
  Star, 
  MessageSquare, 
  ChevronLeft, 
  Smartphone, 
  Clock, 
  Award,
  ShieldCheck,
  Truck,
  Sparkles,
  Eye,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react";
import { useProducts } from "../../../context/ProductsContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { useOrders } from "../../../context/OrdersContext";
import { Order } from "../../../supabase";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id: rawId } = use(params);
  const { products, isLoading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const router = useRouter();

  // Order Placement Modal States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (user) {
      setContactPhone(user.phone || "");
      setCustomerName(user.full_name || "");
    }
  }, [user]);

  // Decode URI component so spaces/special characters match correctly
  const decodedId = decodeURIComponent(rawId).trim();

  // Find the product by exact id, decoded id, or case-insensitive match
  const product = products.find(p => 
    p.id === rawId || 
    p.id === decodedId || 
    p.id.toLowerCase() === decodedId.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Timepiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-gold-500">Timepiece Not Found</h1>
        <p className="text-gray-400 text-sm max-w-md">
          The requested timepiece model ID &quot;{decodedId || rawId}&quot; could not be located in Saleem Watch Center&apos;s catalog.
        </p>
        <Link 
          href="/" 
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3.5"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isHandWatch = product.category === "hand-watches";
  const favorite = isInWishlist(product.id);

  // Extract gallery images (up to 5)
  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  // Get up to 3 related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const getWhatsAppLink = (productName: string) => {
    const text = encodeURIComponent(`Hi Saleem Watch Center, I am highly interested in purchasing the "${productName}" from swc.com. Please share availability details!`);
    return `https://wa.me/923212200321?text=${text}`;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !contactPhone.trim()) {
      setOrderError("Please enter your complete delivery address and active mobile number.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setOrderError(null);
      
      const newOrderId = 'ord_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-4);
      const orderPayload: Order = {
        id: newOrderId,
        user_id: user?.id || user?.email || 'guest_client',
        items: [
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: orderQuantity
          }
        ],
        total_amount: product.price * orderQuantity,
        status: 'Pending',
        shipping_address: shippingAddress.trim(),
        phone: contactPhone.trim(),
        created_at: new Date().toISOString()
      };

      await addOrder(orderPayload);
      setOrderSuccess(newOrderId);
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-sans py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
      
      {/* Navigation breadcrumbs */}
      <div>
        <Link 
          href={
            product.category === "wall-clocks" 
              ? "/wall-clock" 
              : product.subcategory === "womens" 
                ? "/women-watch" 
                : "/"
          } 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {
            product.category === "wall-clocks" 
              ? "Wall Clocks" 
              : product.subcategory === "womens" 
                ? "Women's Watches" 
                : "Men's Watches"
          }
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Image & Thumbnail Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Large Image Display */}
          <div className="relative h-[320px] sm:h-[480px] lg:h-[550px] w-full bg-black border border-gold-500/15 overflow-hidden flex items-center justify-center group shadow-2xl rounded-sm">
            <Image 
              src={galleryImages[selectedImageIndex] || product.image}
              alt={product.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-gold-600 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 z-10 shadow-lg">
                {product.tag}
              </span>
            )}
            {galleryImages.length > 1 && (
              <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow">
                {selectedImageIndex + 1} / {galleryImages.length}
              </span>
            )}
          </div>

          {/* Multiple Images Thumbnail Strip (Max 5 Images) */}
          {galleryImages.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                  Timepiece Gallery ({galleryImages.length} Views)
                </span>
                <span className="text-[9px] text-gray-500 font-light">Click to switch view</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-20 sm:h-24 bg-black rounded border transition-all cursor-pointer overflow-hidden group ${
                        isActive
                          ? "border-gold-500 ring-2 ring-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]"
                          : "border-gold-500/15 hover:border-gold-500/40 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="120px"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gold-500/10 pointer-events-none" />
                      )}
                      <span className={`absolute top-1 left-1 text-[8px] font-bold px-1 rounded ${
                        isActive ? "bg-gold-500 text-black font-black" : "bg-black/70 text-gray-400"
                      }`}>
                        #{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-[10px] text-gold-400 uppercase tracking-widest font-black">
              {isHandWatch ? <Smartphone className="w-3.5 h-3.5 text-gold-500" /> : <Clock className="w-3.5 h-3.5 text-gold-500" />}
              {isHandWatch ? "Executive Wristwatch" : "Luxury Wall Clock"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 text-xs text-gold-500 pt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-gold-500 text-gold-500" : "text-gray-700"}`} 
                  />
                ))}
              </div>
              <span className="font-bold text-white pl-1">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="border-y border-gray-900 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Price</span>
              <span className="font-serif text-3xl font-bold text-gold-400">Rs. {product.price.toLocaleString()}</span>
            </div>
            
            {/* Wishlist Button */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex items-center gap-2 border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${favorite ? "bg-gold-500/10 border-gold-500 text-gold-500" : "border-gray-800 text-gray-400 hover:border-gold-500/50 hover:text-gold-400"}`}
            >
              <Heart className={`w-4 h-4 ${favorite ? "fill-gold-500" : ""}`} />
              {favorite ? "Saved in Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            {product.description}
          </p>

          {/* Luxury badges check */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-900 pb-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>100% Genuine Caliber</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>SWC Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>Secure Shipping Insured</span>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest border-b border-gray-900 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-500" />
              Technical Specifications
            </h3>
            <div className="border border-gold-500/10 divide-y divide-gray-900">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div key={specKey} className="grid grid-cols-2 p-3 text-xs bg-luxury-charcoal/20">
                  <span className="text-gray-500 font-light">{specKey}</span>
                  <span className="text-gray-300 font-medium text-right">{specVal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={getWhatsAppLink(product.name)}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-grow gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-4 text-center flex items-center justify-center gap-2 hover:opacity-90 shadow-[0_4px_25px_rgba(212,175,55,0.25)]"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              Inquire on WhatsApp
            </a>
            <button 
              onClick={() => {
                if (!user) {
                  router.push(`/login?redirect=/product/${encodeURIComponent(product.id)}`);
                } else {
                  setIsOrderModalOpen(true);
                  setOrderSuccess(null);
                  setOrderError(null);
                }
              }}
              className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </button>
          </div>

        </div>

      </div>

      {/* ORDER PLACEMENT MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-luxury-black border border-gold-500/30 w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-fade-in-up text-left space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => { setIsOrderModalOpen(false); setOrderSuccess(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gold-500 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            {!orderSuccess ? (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] text-gold-500 uppercase tracking-widest font-semibold">SWC Direct Checkout</span>
                  <h3 className="font-serif text-2xl font-bold text-white">Confirm Your Order</h3>
                </div>

                {orderError && (
                  <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs">
                    {orderError}
                  </div>
                )}

                {/* Product Summary Card */}
                <div className="flex items-center gap-4 bg-black/40 border border-gold-500/15 p-3 rounded">
                  <div className="relative w-16 h-16 bg-black flex-shrink-0 overflow-hidden border border-gold-500/10">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow space-y-0.5">
                    <p className="text-xs font-bold text-white font-serif">{product.name}</p>
                    <p className="text-[10px] text-gold-400">Rs. {product.price.toLocaleString()} each</p>
                  </div>
                  {/* Quantity Control */}
                  <div className="flex items-center border border-gold-500/20 bg-black">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="px-2.5 py-1 text-gray-400 hover:text-gold-500 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-mono text-white">{orderQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="px-2.5 py-1 text-gray-400 hover:text-gold-500 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Client Delivery Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Recipient Name</label>
                      <input 
                        type="text" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-black border border-gray-800 text-white p-2.5 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Contact Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="03XX XXXXXXX"
                        className="w-full bg-black border border-gray-800 text-white p-2.5 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Complete Delivery Address</label>
                    <textarea 
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="House / Apartment No, Street, Area, City (e.g. Model Colony, Karachi)"
                      className="w-full bg-black border border-gray-800 text-white p-2.5 text-xs focus:border-gold-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Payment Method Badge */}
                  <div className="bg-gold-500/5 border border-gold-500/20 p-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Payment on Delivery (COD)</p>
                      <p className="text-[10px] text-gray-400">Pay cash upon secure doorstep delivery inspection.</p>
                    </div>
                    <span className="text-[10px] font-bold text-gold-400 uppercase px-2 py-0.5 border border-gold-500/30 bg-gold-500/10">
                      Standard COD
                    </span>
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="border-t border-gray-900 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Total Payable</span>
                    <span className="text-xs text-gold-500">Free Express Insured Shipping</span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-gold-400">
                    Rs. {(product.price * orderQuantity).toLocaleString()}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full py-4 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success confirmation */
              <div className="text-center py-6 space-y-6">
                <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-white">Order Confirmed!</h3>
                  <p className="text-xs text-gold-400 font-mono">Order ID: #{orderSuccess.toUpperCase()}</p>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                    Thank you for ordering with Saleem Watch Center. Our concierge is preparing your timepiece for express delivery.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/my-orders"
                    className="flex-1 gold-gradient-bg text-black font-bold text-xs uppercase tracking-widest py-3 text-center"
                  >
                    View My Orders
                  </Link>
                  <button
                    onClick={() => { setIsOrderModalOpen(false); setOrderSuccess(null); }}
                    className="flex-1 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest py-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-900 pt-16 space-y-8">
          <div className="text-left space-y-2">
            <p className="text-gold-500 text-xs tracking-widest uppercase font-semibold">Carefully Curated</p>
            <h2 className="font-serif text-2xl font-bold">Related Masterpieces</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => {
              const relFavorite = isInWishlist(relProduct.id);
              return (
                <div 
                  key={relProduct.id}
                  className="glass-panel glass-panel-hover overflow-hidden flex flex-col group relative"
                >
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(relProduct.id); }}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-gold-500/20 text-gold-500 shadow-sm"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${relFavorite ? "fill-gold-500" : ""}`} />
                  </button>

                  <Link href={`/product/${relProduct.id}`} className="relative h-60 w-full overflow-hidden bg-black flex items-center justify-center border-b border-gold-500/10">
                    <Image 
                      src={relProduct.image}
                      alt={relProduct.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 250px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-gold-500 text-black px-4 py-2 font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3 flex flex-col justify-between flex-grow">
                    <div className="space-y-1">
                      <h4 className="font-serif text-md font-bold text-white group-hover:text-gold-400 transition-colors">
                        {relProduct.name}
                      </h4>
                      <p className="text-gold-400 text-xs font-serif font-semibold">
                        Rs. {relProduct.price.toLocaleString()}
                      </p>
                    </div>

                    <Link 
                      href={`/product/${relProduct.id}`}
                      className="text-[10px] font-extrabold text-gray-400 group-hover:text-gold-400 transition-all uppercase tracking-widest flex items-center gap-1 pt-2 border-t border-gray-900"
                    >
                      View Timepiece
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
