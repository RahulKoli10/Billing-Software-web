import React from "react";
import Link from "next/link";
function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-10">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
          Terms and Conditions
        </h1>

        {/* Intro */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          This service is operated by BBC Studios Distribution Limited (we, us or our).
          We are registered in England and Wales under company number 1420028 and have
          our registered office at 1 Television Centre, 101 Wood Lane, London W12 7FA.
          Our VAT number is 333289454.
        </p>

        {/* Section 1 */}
        <ol className="list-decimal pl-5 space-y-4 text-gray-700 leading-relaxed">
          <li>
            Please read these terms and conditions carefully. By accessing and
            using our website and services, you indicate your acceptance of these terms.
          </li>
          <li>
            If you do not accept these terms please do not access or use our services.
          </li>
          <li>
            We may update these terms at any time. Continued use of our services
            means you agree to the updated terms.
          </li>
        </ol>

        {/* Divider */}
        <div className="border-t my-8"></div>

        {/* Use of Services */}
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">
          Use of our Services
        </h2>

        <ol className="list-decimal pl-5 space-y-4 text-gray-700 leading-relaxed">
          <li>
            You agree to use our services only for lawful purposes and in a way
            that does not infringe the rights of others.
          </li>
          <li>
            You may only use the content for personal and non-commercial use.
            You cannot copy, sell, or modify content without permission.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">
          Privacy Policy
        </h2>

        <ol className="list-decimal pl-5 space-y-4 text-gray-700 leading-relaxed">
          <li>
            You agree to use our services only for lawful purposes and in a way
            that does not infringe the rights of others.
          </li>
          <li>
            You may only use the content for personal and non-commercial use.
            You cannot copy, sell, or modify content without permission.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">
          The Agreement
        </h2>

        <ol className="list-decimal pl-5 space-y-4 text-gray-700 leading-relaxed">
          <li>
            You agree to use our services only for lawful purposes and in a way
            that does not infringe the rights of others.
          </li>
          <li>
            You may only use the content for personal and non-commercial use.
            You cannot copy, sell, or modify content without permission.
          </li>
        </ol>
        <div className="flex justify-end mt-5">
          <Link href="/checkout"
              ><button className="bg-blue-600 text-white font-semibold cursor-pointer py-2 px-10 rounded-sm">Agree</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Page;