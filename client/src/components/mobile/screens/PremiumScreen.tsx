import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { ChevronLeft, Crown, Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { MOCK_VIP_PLANS } from "../../../data/mockData";

export const PremiumScreen: React.FC = () => {
  const { user, upgradeToPlan, setCurrentScreen } = useMobileApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("gold");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = () => {
    upgradeToPlan(selectedPlanId);
    setShowCheckoutModal(false);
    alert("🎉 Payment Successful! Congratulations on your VIP Membership upgrade. All premium features are unlocked!");
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-[#FFFDF9] overflow-y-auto no-scrollbar select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <button
          onClick={() => setCurrentScreen("feed")}
          className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-orange-600" />
          <span>Back</span>
        </button>

        <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>VIP Membership</span>
        </h2>

        <span className="text-xs text-orange-600 font-bold">Safe & Secure</span>
      </div>

      <div className="p-4 space-y-5 pb-28">
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 text-white text-center shadow-saffron relative overflow-hidden">
          <Crown className="w-10 h-10 text-amber-200 mx-auto mb-2 animate-bounce" />
          <h3 className="font-serif-royal text-xl font-bold">Unlock 5X Faster Matches</h3>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            View verified direct phone numbers, initiate unlimited chats, and get dedicated Kundli matching.
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <div>
              <p className="font-bold text-gray-800">Your Current Plan</p>
              <p className="text-gray-500 text-[10px]">{user.planName}</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-amber-200 text-amber-900 rounded-md text-[10px] font-bold">
            Active
          </span>
        </div>

        {/* Plan Cards */}
        <div className="space-y-4">
          {MOCK_VIP_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer bg-white shadow-card-elevated ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-500/20 shadow-saffron"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 right-5">
                    <span className="px-3 py-1 rounded-full bg-saffron-gradient text-white text-[10px] font-bold shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{plan.name}</h4>
                    <p className="text-xs text-gray-500">{plan.duration} Validity</p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-orange-600">{plan.price}</span>
                      <span className="text-xs text-gray-400 line-through">{plan.originalPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {plan.discount}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Upgrade Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  className={`w-full mt-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-saffron-gradient text-white shadow-saffron-sm"
                      : "bg-gray-100 text-gray-800 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 text-gray-900 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-lg text-gray-900">Confirm Subscription</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">
              Select your preferred Indian payment method to activate VIP membership.
            </p>

            <div className="space-y-2 mb-6">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Plan: {selectedPlanId.toUpperCase()} VIP</p>
                  <p className="text-[11px] text-gray-500">100% Money-back verification guarantee</p>
                </div>
                <span className="text-sm font-extrabold text-orange-600">
                  {MOCK_VIP_PLANS.find((p) => p.id === selectedPlanId)?.price}
                </span>
              </div>

              {/* UPI Options */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 border rounded-xl font-medium bg-gray-50">Google Pay</div>
                <div className="p-2.5 border rounded-xl font-medium bg-gray-50">PhonePe / UPI</div>
                <div className="p-2.5 border rounded-xl font-medium bg-gray-50">Credit / Debit</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 rounded-full border border-gray-300 text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 rounded-full bg-saffron-gradient text-white text-xs font-bold shadow-saffron"
              >
                Pay & Unlock Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumScreen;
