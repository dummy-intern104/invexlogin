import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BillingHeader from "@/components/billing/BillingHeader";
import BillForm from "@/components/billing/BillForm";
import BillHistory from "@/components/billing/BillHistory";
import { BillHistoryItem, BillItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";

const Billing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [billHistory, setBillHistory] = useState<BillHistoryItem[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleBillSubmit = (billNumber: string, email: string, items: BillItem[], total: number) => {
    toast({
      title: "Invoice generated",
      description: `Invoice ${billNumber} has been successfully generated and sent to ${email}`,
    });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Create New Invoice
                </h2>
                <BillForm onSubmit={handleBillSubmit} />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-5">
            <BillHistory billHistory={billHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
