import { useLocation, Link } from "react-router-dom";

const NoticePage = () => {
  const location = useLocation();

  const {
    type = "production",
    platform = "Social Media",
    redirectUrl,
  } = location.state || {};

  const notices = {
    social: {
      icon: "↗",
      title: "Leaving ScazStore",
      message: `This link redirects you to our ${platform} account. You will be visiting an external website.`,
      button: "Continue",
    },

    production: {
      icon: "🚧",
      title: "Feature Not Available",
      message:
        "This feature or page is available only in the production version of ScazStore. Please check back when the live website is available.",
      button: "Back to Home",
    },
  };

  const notice = notices[type] || notices.production;

  const handleContinue = () => {
    if (type !== "social" || !redirectUrl) return;

    try {
      const destination = new URL(redirectUrl);

      if (!["https:", "http:"].includes(destination.protocol)) return;

      window.open(destination.href, "_blank", "noopener,noreferrer");
    } catch {
      // Ignore malformed or unsupported redirect URLs.
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          {notice.icon}
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {notice.title}
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          {notice.message}
        </p>

        {type === "social" && redirectUrl ? (
          <button
            onClick={handleContinue}
            className="mt-7 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            {notice.button}
          </button>
        ) : (
          <Link
            to="/"
            className="mt-7 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            {notice.button}
          </Link>
        )}

      </div>
    </main>
  );
};

export default NoticePage;