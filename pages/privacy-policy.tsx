import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import Head from "next/head";
import React from "react";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, set up an election, or contact us for support. This includes your name, email address, organization name, and payment information. We also automatically collect certain information when you use our services, including log data, device information, and cookies.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send technical notices, updates, security alerts, and support messages; respond to your comments and questions; and monitor and analyze trends, usage, and activities in connection with our services.",
  },
  {
    title: "3. Sharing of Information",
    content:
      "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when required by law or to protect our rights.",
  },
  {
    title: "4. Data Security",
    content:
      "We implement a variety of security measures to maintain the safety of your personal information. All sensitive data is encrypted via Secure Socket Layer (SSL) technology. We use industry-standard safeguards to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.",
  },
  {
    title: "5. Cookies",
    content:
      "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.",
  },
  {
    title: "6. Third-Party Links",
    content:
      "Occasionally, at our discretion, we may include or offer third-party products or services on our platform. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.",
  },
  {
    title: "7. Children's Privacy",
    content:
      "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.",
  },
  {
    title: "8. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. You are advised to review this Privacy Policy periodically for any changes.",
  },
  {
    title: "9. Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at privacy@votar.ng or write to us at: Votar, No 20 Fair-view Estate, Lagos Island, Lagos State, Nigeria.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div>
      <Head>
        <title>Privacy Policy - Votar</title>
        <meta
          name="description"
          content="Read Votar's Privacy Policy to understand how we collect, use, and protect your personal information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Privacy Policy - Votar" />
        <meta
          property="og:description"
          content="Learn how Votar handles your personal data and privacy."
        />
        <meta property="og:url" content="https://www.votar.ng/privacy-policy" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/privacy-policy" />
      </Head>
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Nav />
      </div>
      <div className="max-w-[900px] mx-auto px-4 lg:px-0 py-16">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#00122F] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Effective Date: January 1, 2025
          </p>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            At Votar, we are committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform and services. Please read this
            policy carefully.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-[#00122F] mb-3">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
