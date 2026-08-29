"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { orders: allOrders, isLoading } = useOrders();

  const orders = allOrders.filter(o => 
    user && (
      o.user_id === user.id || 
      o.user_id === user.email || 
      (user.phone && o.phone === user.phone)
    )
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending': return <Clock className="w-5 h-5 text-orange-400" />;
      case 'Processing': return <Package className="w-5 h-5 text-blue-400" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-purple-400" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Shipped': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-gold-500 text-lg font-serif">Sign in to view your orders</p>
        <Link href="/login" className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black uppercase tracking-widest text-xs font-bold transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-screen">
      
      <div className="space-y-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
          My Orders
        </h1>
        <p className="text-gray-400 text-sm">Track your recent purchases and shipping status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gold-500/20 rounded-lg bg-black/20 space-y-4">
          <Package className="w-12 h-12 text-gold-500/40 mx-auto" />
          <p className="text-gold-500 text-lg font-serif">No Orders Yet</p>
          <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
            You haven&apos;t placed any orders yet. Once you make a purchase, your tracking details will appear here.
          </p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black uppercase tracking-widest text-xs font-bold transition-colors">
            Browse Watches
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel p-6 sm:p-8 border border-gold-500/15 relative overflow-hidden space-y-6">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/30" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className={`px-4 py-2 flex items-center gap-2 border rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="text-xs font-bold uppercase tracking-widest">{order.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Purchased Timepieces</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm bg-black/40 p-2.5 rounded border border-gold-500/10">
                        <div className="space-y-1">
                          <p className="text-gray-200 font-bold">
                            <span className="text-gold-500 font-mono text-xs mr-1.5">{item.quantity}x</span> 
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-mono text-gold-400">ID: {item.product_id}</span>
                            {item.color && (
                              <span className="bg-gold-500/10 text-gold-300 border border-gold-500/20 px-1.5 py-0.2 rounded font-medium">
                                Colour: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-gold-400 font-mono text-xs font-bold flex-shrink-0">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-900 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <span className="text-lg font-serif font-bold text-gold-400">Rs. {order.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-black/30 p-4 border border-gold-500/5 rounded space-y-4">
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Delivery Destination</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div>
                      <span className="text-gray-600 block text-[10px] uppercase">Shipping Address</span> 
                      <p className="text-gray-200 leading-relaxed mt-0.5">{order.shipping_address}</p>
                    </div>
                    {order.shipping_details?.landmark && (
                      <p className="text-gold-400 font-semibold text-[11px]">📍 Landmark: {order.shipping_details.landmark}</p>
                    )}
                    <div>
                      <span className="text-gray-600 block text-[10px] uppercase">Contact Phone</span> 
                      <p className="text-gray-200 font-mono mt-0.5">{order.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
