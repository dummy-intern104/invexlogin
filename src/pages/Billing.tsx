
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
import MobileNavbar from "@/components/layout/MobileNavbar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Billing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [billHistory, setBillHistory] = useState<BillHistoryItem[]>([]);
  const [showBillForm, setShowBillForm] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch bills created by the current user
    const fetchBillHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', user.id) // Filter by the user who created the bill
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching bill history:", error);
          return;
        }
        
        if (data) {
          setBillHistory(data as BillHistoryItem[]);
        }
      } catch (error) {
        console.error("Error in bill history fetch:", error);
      }
    };
    
    fetchBillHistory();
    
    // Subscribe to realtime changes for bills created by the current user
    const channel = supabase
      .channel('billing-page-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bills',
          filter: `created_by=eq.${user.id}` // Only listen for changes to bills created by this user
        },
        () => {
          // Refresh bill history when a new bill is added
          fetchBillHistory();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const handleBillSubmit = async (billNumber: string, email: string, items: BillItem[], total: number) => {
    toast({
      title: "Invoice generated",
      description: `Invoice ${billNumber} has been successfully generated and sent to ${email}`,
    });
    
    // Close the bill form dialog
    setShowBillForm(false);
    
    // Force refresh bill history after a new bill is submitted
    if (user) {
      const { data } = await supabase
        .from('bills')
        .select('*')
        .eq('created_by', user.id) // Filter by the user who created the bill
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (data) {
        setBillHistory(data as BillHistoryItem[]);
      }
    }
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Recent Invoices
          </h2>
          <Button 
            onClick={() => setShowBillForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Invoice
          </Button>
        </div>
        
        <div className="w-full">
          <BillHistory billHistory={billHistory} />
        </div>
      </main>
      
      <Dialog open={showBillForm} onOpenChange={setShowBillForm}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-semibold mb-4">Create New Invoice</DialogTitle>
          <BillForm onSubmit={handleBillSubmit} />
        </DialogContent>
      </Dialog>
      
      <MobileNavbar />
    </div>
  );
};

export default Billing;
