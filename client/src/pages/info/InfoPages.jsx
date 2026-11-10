import { useState } from "react";

import { Link } from "react-router-dom";

const PageLayout = ({ title, subtitle, children }) => {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12">

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <p className="text-sm font-bold text-green-600 uppercase tracking-widest">
            ScazStore
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-green-950">
            {title}
          </h1>

          <p className="mt-3 text-gray-500">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-10 shadow-sm">
          {children}
        </div>

      </div>
    </main>
  );
};


// ABOUT US
export const AboutPage = () => (
  <PageLayout
    title="About Us"
    subtitle="Get to know ScazStore"
  >
    <h2 className="text-xl font-bold text-gray-900">
      Welcome to ScazStore
    </h2>

    <p className="mt-4 leading-7 text-gray-600">
      ScazStore is a demonstration ecommerce project designed to
      showcase a modern online shopping experience.
    </p>

    <p className="mt-4 leading-7 text-gray-600">
      Our concept brings groceries, vegetables and daily essentials
      together in one convenient shopping platform.
    </p>

    <p className="mt-4 leading-7 text-gray-600">
      This project is developed for educational, portfolio and
      demonstration purposes.
    </p>
  </PageLayout>
);


// CONTACT US
export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout
      title="Contact Us"
      subtitle="We would love to hear from you"
    >

      <div className="grid md:grid-cols-2 gap-10">

        <div>
          <h2 className="text-xl font-bold">Get in touch</h2>

          <p className="mt-3 text-gray-500 leading-7">
            Have a question about ScazStore? Send us a message.
          </p>

          <div className="mt-6 space-y-4 text-sm text-gray-600">
            <p>✉ support@scazstore.com</p>
            <p>☎ Customer Support</p>
            <p>◷ Monday - Saturday</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

          <input
            type="text"
            placeholder="Subject"
            required
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            required
            className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
          />

          {submitted && (
            <p role="status" className="text-sm text-amber-700">
              Demo only: Your message has not been sent.
            </p>
          )}

          <button className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700">
            Send Message
          </button>

        </form>

      </div>

    </PageLayout>
  );
};


// TERMS & CONDITIONS
export const TermsPage = () => (
  <PageLayout
    title="Terms & Conditions"
    subtitle="Please read these demonstration terms"
  >

    <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <h2 className="font-bold text-amber-900">
        ⚠️ Important Demo Notice
      </h2>

      <p className="mt-2 text-sm leading-6 text-amber-800">
        ScazStore is a demonstration project created for educational,
        development and portfolio purposes only. It is not a real
        ecommerce business. No real orders, payments or commercial
        transactions are processed through this demonstration.
        Do not use this website for actual purchases or rely on its
        content as legal advice.
      </p>
    </div>

    {[
      ["1. Website Purpose", "This website is provided as a demonstration of ecommerce design and functionality."],
      ["2. Products and Pricing", "Product names, descriptions, images and prices may be fictional or illustrative."],
      ["3. Orders and Payments", "The demonstration does not accept or process genuine orders or payments."],
      ["4. User Information", "Do not submit real passwords, payment information or sensitive personal information."],
      ["5. External Links", "External websites and social media accounts are governed by their own terms and privacy policies."],
      ["6. Changes", "Demonstration content and functionality may be changed or removed without notice."]
    ].map(([heading, text]) => (
      <section key={heading} className="mb-7">
        <h2 className="font-bold text-gray-900">{heading}</h2>
        <p className="mt-2 leading-7 text-gray-600">{text}</p>
      </section>
    ))}

    <p className="text-xs text-gray-400">
      These are sample demonstration terms, not a substitute for
      legally reviewed terms for a commercial website.
    </p>

  </PageLayout>
);


// HELP CENTER
export const HelpPage = () => (
  <PageLayout
    title="Help Center"
    subtitle="How can we help you?"
  >

    <div className="grid sm:grid-cols-2 gap-4">

      {[
        ["Account Help", "Learn about account access and registration.", "/login"],
        ["Frequently Asked Questions", "Find answers to common questions.", "/faq"],
        ["Shipping Information", "Read our sample shipping policy.", "/shipping-policy"],
        ["Returns and Refunds", "Understand our sample return policy.", "/return-policy"],
      ].map(([title, description, link]) => (
        <Link
          key={title}
          to={link}
          className="rounded-xl border p-5 hover:border-green-500 hover:bg-green-50 transition"
        >
          <h2 className="font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-green-700">
            Learn more →
          </span>
        </Link>
      ))}

    </div>

  </PageLayout>
);


// FAQS
export const FAQPage = () => {
  const questions = [
    ["What is ScazStore?", "ScazStore is a demonstration ecommerce website."],
    ["Can I place an order?", "No. Real orders are not supported in this demo."],
    ["Can I make payments?", "No real payment processing is available."],
    ["How do I create an account?", "You can explore the signup interface, but account registration is not connected to a backend."],
    ["When will the live website be available?", "Please check the production website for future updates."],
  ];

  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions"
    >

      <div className="space-y-3">

        {questions.map(([question, answer]) => (
          <details
            key={question}
            className="group rounded-xl border border-gray-200 p-5"
          >
            <summary className="cursor-pointer font-semibold text-gray-900">
              {question}
              <span className="float-right text-green-600">+</span>
            </summary>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {answer}
            </p>
          </details>
        ))}

      </div>

    </PageLayout>
  );
};


// SHIPPING POLICY
export const ShippingPage = () => (
  <PageLayout
    title="Shipping Policy"
    subtitle="Sample shipping information"
  >

    <div className="space-y-6 text-gray-600 leading-7">

      <section>
        <h2 className="font-bold text-gray-900">Shipping Availability</h2>
        <p className="mt-2">
          Shipping information is provided for demonstration purposes.
          No actual deliveries are arranged through this website.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Delivery Time</h2>
        <p className="mt-2">
          Delivery estimates would depend on location, product
          availability and the selected delivery service.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Shipping Charges</h2>
        <p className="mt-2">
          Any shipping charges displayed in this demo are illustrative only.
        </p>
      </section>

    </div>

  </PageLayout>
);


// RETURN POLICY
export const ReturnPage = () => (
  <PageLayout
    title="Return Policy"
    subtitle="Sample returns and refund information"
  >

    <div className="space-y-6 text-gray-600 leading-7">

      <section>
        <h2 className="font-bold text-gray-900">Return Eligibility</h2>
        <p className="mt-2">
          This demonstration does not accept actual purchases or returns.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Refunds</h2>
        <p className="mt-2">
          No real payments or refunds are processed through ScazStore demo.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Need Help?</h2>
        <p className="mt-2">
          Visit our <Link to="/contact" className="text-green-700 underline">
            Contact Us
          </Link> page for demonstration contact information.
        </p>
      </section>

    </div>

  </PageLayout>
);

/**
 * Demo policy pages. Replace these sample statements with reviewed legal
 * documents before enabling real orders, payments, or customer accounts.
 */
export const PrivacyPolicyPage = () => (
  <PageLayout
    title="Privacy Policy"
    subtitle="How customer information is handled in this demonstration"
  >
    <h2 className="text-xl font-bold text-gray-900">Demo privacy information</h2>
    <p className="mt-4 leading-7 text-gray-600">
      ScazStore is currently a demonstration project. Do not submit real
      personal, financial, or sensitive information through this website.
      Any sample forms or account screens are illustrative unless a connected
      backend and privacy controls are explicitly provided.
    </p>
    <p className="mt-4 leading-7 text-gray-600">
      A production privacy policy must explain what information is collected,
      why it is used, how long it is retained, which service providers receive
      it, and how users can exercise their applicable privacy rights.
    </p>
  </PageLayout>
);

export const RefundPolicyPage = () => (
  <PageLayout
    title="Refund Policy"
    subtitle="Demo-only information about refunds and cancellations"
  >
    <h2 className="text-xl font-bold text-gray-900">No real purchases</h2>
    <p className="mt-4 leading-7 text-gray-600">
      ScazStore does not process real purchases or payments in this
      demonstration. Therefore, no actual refund or cancellation can be
      requested through this website.
    </p>
    <p className="mt-4 leading-7 text-gray-600">
      Before launch, publish a reviewed policy covering cancellation windows,
      eligible returns, refund methods, processing times, and customer support.
    </p>
  </PageLayout>
);
