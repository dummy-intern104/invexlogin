
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import BillingHeader from "@/components/billing/BillingHeader";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import ProductsDashboard from "@/components/dashboard/ProductsDashboard";
import ClientsDashboard from "@/components/dashboard/ClientsDashboard";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <BillingHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Business Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <SalesDashboard />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <ProductsDashboard />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <ClientsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
