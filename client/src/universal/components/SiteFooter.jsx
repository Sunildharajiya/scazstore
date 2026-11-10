import { Link } from "react-router-dom";
import Logo from "../../assets/images/scazstore-logo.png";

const Footer = () => {

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Offers", link: "/offers" },
    { name: "Contact Us", link: "/contact" },
    { name: "My Account", link: "/account" },
  ];

  const categories = [
    { name: "Groceries", link: "/groceries" },
    { name: "Vegetables", link: "/vegetables" },
    { name: "Daily Needs", link: "/daily-needs" },
    { name: "Fresh Fruits", link: "/fruits" },
    { name: "All Products", link: "/products" },
  ];

  const supportLinks = [
    { name: "Help Center", link: "/help" },
    { name: "FAQs", link: "/faq" },
    { name: "Shipping Policy", link: "/shipping-policy" },
    { name: "Return Policy", link: "/return-policy" },
    { name: "Privacy Policy", link: "/privacy-policy" },
  ];

  return (

    <footer className="bg-green-950 text-white">

      {/* NEWSLETTER SECTION */}

      <div className="border-b border-white/10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div className="text-center lg:text-left">

              <h2 className="text-2xl sm:text-3xl font-black">
                Stay Fresh with{" "}
                <span className="text-green-400">
                  ScazStore!
                </span>
              </h2>

              <p className="text-green-100/60 text-sm mt-2">
                Subscribe for exclusive offers and the latest updates.
              </p>

            </div>


            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Newsletter:", e.target.email.value);
              }}
              className="flex w-full max-w-md bg-white rounded-full p-1.5"
            >

              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-800 outline-none rounded-full"
              />

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-bold transition"
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>

      </div>


      {/* MAIN FOOTER */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}

          <div className="lg:col-span-2">

            <Link to="/" className="inline-flex items-center gap-3">

              <img
                src={Logo}
                alt="ScazStore"
                className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
              />

              <div>

                <h2 className="text-2xl font-black">
                  Scaz<span className="text-green-400">Store</span>
                </h2>

                <p className="text-[9px] tracking-[2px] text-green-100/60 font-bold">
                  SHOP SMART. LIVE BETTER.
                </p>

              </div>

            </Link>


            <p className="text-sm text-green-100/60 leading-7 mt-5 max-w-sm">
              Your everyday shopping destination. Discover quality
              groceries, fresh vegetables and daily essentials
              at great prices.
            </p>


            {/* SOCIAL LINKS */}

            <div className="flex items-center gap-3 mt-6">

              <SocialLink label="Facebook" icon="f" />

              <SocialLink label="Instagram" icon="◎" />

              <SocialLink label="Twitter / X" icon="𝕏" />

              <SocialLink label="YouTube" icon="▶" />

            </div>

          </div>


          {/* QUICK LINKS */}

          <FooterColumn
            title="Quick Links"
            links={quickLinks}
          />


          {/* CATEGORIES */}

          <FooterColumn
            title="Categories"
            links={categories}
          />


          {/* CUSTOMER SUPPORT */}

          <FooterColumn
            title="Customer Support"
            links={supportLinks}
          />

        </div>


        {/* CONTACT INFORMATION */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 pt-8 border-t border-white/10">

          <ContactItem
            icon="✉"
            title="Email Support"
            value="support@scazstore.com"
          />

          <ContactItem
            icon="☎"
            title="Call Us"
            value="Customer Support"
          />

          <ContactItem
            icon="◷"
            title="Working Hours"
            value="Monday - Saturday"
          />

        </div>


        {/* BOTTOM FOOTER */}

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-xs text-green-100/50 text-center">
            © {new Date().getFullYear()} ScazStore.
            All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-xs text-green-100/60">

            <Link
              to="/privacy-policy"
              className="hover:text-green-400 transition"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="hover:text-green-400 transition"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/refund-policy"
              className="hover:text-green-400 transition"
            >
              Refund Policy
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};


// FOOTER COLUMN

const FooterColumn = ({ title, links }) => (

  <div>

    <h3 className="text-sm font-bold uppercase tracking-wider mb-5">
      {title}
    </h3>

    <ul className="space-y-3">

      {links.map((item) => (

        <li key={item.name}>

          <Link
            to={item.link}
            className="text-sm text-green-100/60 hover:text-green-400 hover:translate-x-1 inline-block transition-all"
          >
            {item.name}
          </Link>

        </li>

      ))}

    </ul>

  </div>

);


// SOCIAL LINKS

const SocialLink = ({ label, icon }) => (

  <a
    href="#"
    aria-label={label}
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center font-bold text-lg transition"
  >
    {icon}
  </a>

);


// CONTACT ITEM

const ContactItem = ({ icon, title, value }) => (

  <div className="flex items-center gap-4">

    <div className="w-11 h-11 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center text-xl">
      {icon}
    </div>

    <div>

      <h4 className="text-sm font-bold">
        {title}
      </h4>

      <p className="text-xs text-green-100/50 mt-1">
        {value}
      </p>

    </div>

  </div>

);


export default Footer;