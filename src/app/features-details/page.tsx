import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
export default function SigninPage() {
  const features = [
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
    {
      title: "Auto-Discount Engine",
      description:
        "Automatically suggests the best discount for a customer based on their purchase history and loyalty level.",
    },
  ];
  return (
    <main className="font-dm">
      <Navbar />
      {/* feaure deatails */}
      <section className="py-10 ">
        <div className="max-w-7xl mx-auto px-5 py-8 rounded-xl  ">
          <div className="flex flex-col-reverse md:flex-row items-center ">
            {/* Left Content */}    
            <div className="flex-1">
              <h2 className="text-2xl md:text-4xl font-bold text-black">
                Auto-Discount Engine
              </h2>

              <p className="mt-4 text-black leading-relaxed max-w-xl">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry{`'`}s standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic
              </p>
              <p className="mt-4 text-black leading-relaxed max-w-xl">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry{`'`}s standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic
              </p>

             
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/feature-details.png"
                alt="Billing software dashboard preview"
                width={500}
                height={200}
                className="rounded-xl w-auto h-auto "
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto text-black">
            <h2 className="text-3xl md:text-[42px] font-bold ">
              Features of our Invoice
            </h2>
            <p className="mt-4 text-base md:text-lg">
              Everything you need to bill faster, manage better, and scale your
              business powered by automation, accuracy, and simplicity.
            </p>
          </div>

          {/* View all */}
          {/* <div className="mt-8 flex justify-end">
            <Link
              href="#"
              className="  text-lg font-medium underline flex items-center gap-1"
            >
              View all{" "}
              <Icon icon="line-md:arrow-right" width="20" height="20" />
            </Link>
          </div> */}

          {/* Feature Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-white"
              >
                <h3 className="text-2xl font-semibold text-gray-900 font-open">
                  {item.title}
                </h3>

                <p className="mt-2 text-base  ">{item.description}</p>

                {/* Image Placeholder */}
                <div className="mt-4 rounded-lg border border-gray-100 overflow-hidden">
                  <Image
                    src="/homeFeature.png"
                    alt="Feature"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
