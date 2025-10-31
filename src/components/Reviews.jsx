"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Mother of 2",
    rating: 5,
    text: "Absolutely love the quality! My kids look adorable and the clothes are super comfortable.",
  },
  {
    name: "David Kim",
    role: "Father",
    rating: 4,
    text: "Fast delivery and great customer service. My son loves his new jacket!",
  },
  {
    name: "Emma Williams",
    role: "Mom Blogger",
    rating: 5,
    text: "Stylish designs with amazing fabric quality. Highly recommended for parents who care about comfort!",
  },
];

export default function ParentReviews() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-gray-800">
          What Parents Say
        </h2>

        <div className="relative max-w-3xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="absolute w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === current ? 1 : 0,
                x: index === current ? 0 : index < current ? -100 : 100,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="text-2xl text-blue-500">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 italic font-serif mb-6">
                  “{review.text}”
                </p>
                <h4 className="font-serif font-semibold text-gray-800">
                  {review.name}
                </h4>
                <p className="text-sm text-gray-500 font-serif">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-blue-600 scale-125" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
