"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAgree = () => {
    const from = searchParams.get("from");

    if (from) {
      router.push(from); // exact page jaha se aaya
    } else {
      router.back(); // fallback (history)
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center p-6">
      
      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-purple-700">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your Agreement
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[400px] overflow-y-auto p-6 text-gray-700 space-y-4">

          <p className="font-semibold">
            Welcome to our website. This site is provided as a service to our
            visitors and may be used for informational purposes only.
          </p>

          <h2 className="font-semibold text-gray-800">1. Your Agreement</h2>
          <p>
            By using this site, you agree to be bound by these Terms and
            Conditions. If you do not agree, please do not use this site.
          </p>

          <h2 className="font-semibold text-gray-800">2. Privacy</h2>
          <p>
            Please review our Privacy Policy to understand our practices.
          </p>

          <h2 className="font-semibold text-gray-800">3. Linked Sites</h2>
          <p>
            This site may contain links to third-party websites. We are not
            responsible for their content or policies.
          </p>
            <h2 className="font-semibold text-gray-800">4. Our Commitment</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti nobis natus laudantium reiciendis eos adipisci vel perferendis, neque harum sapiente amet vero animi non deserunt, pariatur esse, tempora aspernatur cumque. Nemo incidunt ut error quae a vel iusto amet assumenda temporibus, totam facilis, nisi placeat natus! Molestiae neque dolores harum?</p>
            <h2 className="font-semibold text-gray-800">3. Security</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem ducimus eum voluptatum ipsa. Tempora, accusamus et eaque veritatis, natus debitis ratione deleniti facilis quae possimus earum, quo dolore architecto repellendus molestias exercitationem eveniet impedit ab quaerat! Eaque ipsam ut quasi animi non perferendis autem, sequi dolor placeat libero deleniti ipsa aut iusto aperiam culpa perspiciatis ea pariatur ab sunt suscipit voluptatem esse? Corporis id dolor porro eveniet expedita quas nulla fugiat laudantium. In, saepe deleniti quibusdam rerum ad nesciunt dolores blanditiis harum quod veritatis voluptate nisi perferendis aliquid aperiam temporibus repudiandae earum nihil eaque nostrum tempore. Mollitia quia accusantium ex?</p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-4">
          {/* <button
            onClick={handleCancel}
            className="text-purple-600 font-medium hover:underline"
          >
            Cancel
          </button> */}

          <button
            onClick={handleAgree}
            className="bg-purple-700 text-white px-5 cursor-pointer py-2 rounded-lg hover:bg-purple-800 transition"
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;