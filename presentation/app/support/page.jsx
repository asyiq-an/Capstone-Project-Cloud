"use client";

import React, { useState } from "react";

// No NavBar or BottomBar imports anymore

const faqsFood = [
  {
    question: "How do I order food?",
    answer:
      "Hungry? Just open the app, enter your delivery address, browse restaurants and menus, add items to your cart, and tap 'Place Order'. It's that easy to get your cravings satisfied!",
  },
  {
    question: "What if my order is late or wrong?",
    answer:
      "Oh no! If your order isn't quite right or running late, please use the 'Help' section within your active order in the app. Our support team can assist you immediately with refunds or re-deliveries.",
  },
  {
    question: "What payment methods can I use?",
    answer:
      "We accept a variety of convenient payment options: major credit/debit cards, popular mobile wallets (like Apple Pay, Google Pay), and cash on delivery (where available). Choose what's easiest for you!",
  },
  {
    question: "Can I schedule a food order for later?",
    answer:
      "Yes, absolutely! You can schedule your cravings in advance. Just select 'Schedule Order' before checkout and pick your desired delivery time and date. Perfect for planning meals!",
  },
  {
    question: "How do I find promotions or discounts?",
    answer:
      "Keep an eye on our 'Promotions' or 'Offers' tab in the app! We frequently have exciting deals from your favorite restaurants. Make sure your notifications are on so you don't miss out!",
  },
  {
    question: "Is there a minimum order value?",
    answer:
      "Some restaurants might have a small minimum order value, which you'll see clearly displayed before you confirm your order. This helps them offer the best service possible!",
  },
];

const HorizontalFAQCard = ({ faq }) => {
  return (
    <div className="flex-none w-full sm:w-72 md:w-80 p-5 mr-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <h3 className="font-semibold text-lg text-orange-600 mb-3">{faq.question}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
    </div>
  );
};

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("ordering");

  return (
    <div className="pt-24 max-w-screen-2xl mx-auto p-4 sm:p-6 font-sans bg-gray-50">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-green-500 to-lime-600 text-white rounded-xl mb-8 sm:mb-12 shadow-xl px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4">
          Deliciously Simple Support, Just For You!
        </h1>
        <p className="text-base sm:text-lg opacity-90 max-w-3xl mx-auto">
          Got questions about your next meal? We're here to help you savor every moment of your food delivery experience.
        </p>
      </div>

      {/* Featured FAQs (Horizontal Scroll) */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          <span className="text-orange-500">Quick Bites</span> of Information
        </h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 px-2">
          Swipe through our most common questions for instant answers!
        </p>
        <div className="flex overflow-x-auto pb-4 custom-scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-x-4 md:gap-x-0 md:gap-y-4 w-full">
            {faqsFood.map((faq, index) => (
              <HorizontalFAQCard key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Browse by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
          <button
            onClick={() => setActiveTab("ordering")}
            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ${
              activeTab === "ordering"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
            }`}
          >
            Ordering & Delivery
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ${
              activeTab === "payments"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
            }`}
          >
            Payments & Promos
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ${
              activeTab === "account"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
            }`}
          >
            Account & Security
          </button>
        </div>
        {activeTab === "ordering" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
            {faqsFood.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100"
              >
                <h3 className="font-semibold text-lg text-orange-600 mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Still Need Help Section */}
      <section className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-6 sm:p-8 shadow-xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          Can't Find Your Dish? Let Us Help!
        </h2>
        <p className="text-base sm:text-lg opacity-95 mb-5 sm:mb-6">
          If your question isn't answered, our dedicated support team is ready to serve you.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-6">
          <a
            href="mailto:support@yourapp.com"
            className="w-full md:w-auto bg-white text-red-700 font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            Email Us
          </a>
          <a
            href="tel:+6561234567"
            className="w-full md:w-auto bg-white text-red-700 font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            Call Hotline: +65 6123 4567
          </a>
        </div>
        <p className="text-sm sm:text-base opacity-90 mt-5">
          For instant help with an active order, use our in-app chat!
        </p>
      </section>
    </div>
  );
};

export default SupportPage;

