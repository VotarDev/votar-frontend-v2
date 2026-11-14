/**
 * Title and description for every page, by route (router.pathname).
 * Applied in _app through <PageMeta>; a page can still render its own
 * <PageMeta> (e.g. with an election's name) and it replaces these.
 *
 * `noIndex` keeps signed-in, admin, ballot and checkout pages out of search
 * results.
 */
export interface RouteMeta {
  title?: string;
  description: string;
  noIndex?: boolean;
}

export const SITE_URL = "https://www.votar.ng";

export const DEFAULT_META: RouteMeta = {
  description:
    "Votar – The platform where your choice is visible, and your voice is heard. Create secure online elections, collect votes and see results live.",
};

const PRIVATE = { noIndex: true } as const;

export const ROUTE_META: Record<string, RouteMeta> = {
  // Public site
  "/": {
    description:
      "Votar – The platform where your choice is visible, and your voice is heard. Participate in elections and shape your future.",
  },
  "/about": {
    title: "About Us",
    description:
      "Learn more about Votar and how we help organisations run transparent, secure online elections.",
  },
  "/product": {
    title: "Products & Plans",
    description:
      "Take advantage of our services for free or pay for only what you use if you want more. Choose the Votar plan that suits your needs.",
  },
  "/blog": {
    title: "Blog",
    description:
      "Unleash the power of e-voting with Votar. Get the latest news, updates and insights on voting and elections.",
  },
  "/faq": {
    title: "FAQ",
    description:
      "Find answers to common questions about Votar: creating elections, voting, credits and results.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Read Votar's Privacy Policy to understand how we collect, use and protect your personal information.",
  },
  "/vote": {
    title: "Vote",
    description:
      "Cast your vote on Votar and make your voice heard. Enter your election details to open your secret ballot.",
  },
  "/404": {
    title: "Page not found",
    description: "We can't find the page you're looking for. Head back to Votar's home page.",
    noIndex: true,
  },

  // Sign in
  "/signin": {
    title: "Sign in or create an account",
    description:
      "Sign in to Votar to create and manage your elections, or create a free account to get started.",
  },
  "/signin/[id]": {
    title: "Verify your email",
    description: "Enter the code we emailed you to verify your Votar account.",
    ...PRIVATE,
  },
  "/forgot-password": {
    title: "Forgot password",
    description: "Reset your Votar password. We'll email you a secure link to set a new one.",
  },
  "/reset-password": {
    title: "Set a new password",
    description: "Choose a new password for your Votar account.",
    ...PRIVATE,
  },

  // Organiser dashboard
  "/dashboard": {
    title: "Dashboard",
    description: "An overview of the elections you've created on Votar.",
    ...PRIVATE,
  },
  "/elections": {
    title: "Elections",
    description: "Manage, edit and monitor the elections you've created on Votar.",
    ...PRIVATE,
  },
  "/elections/[...id]": {
    title: "Edit election",
    description: "Update your election's details, ballot, voters, payment and monitoring settings.",
    ...PRIVATE,
  },
  "/create-election": {
    title: "Create an election",
    description: "Choose a Votar plan and start setting up a new election.",
    ...PRIVATE,
  },
  "/create-election/create": {
    title: "Create an election",
    description: "Set up your election step by step: details, ballot, voters, payment and monitoring.",
    ...PRIVATE,
  },
  "/participate": {
    title: "Participate in an election",
    description: "Join an election on Votar as a voter.",
    ...PRIVATE,
  },
  "/monitor-election": {
    title: "Monitor an election",
    description: "Pick an election to get its live results links.",
    ...PRIVATE,
  },
  "/monitor-election/[...id]": {
    title: "Monitoring links",
    description: "Share live results links for your election.",
    ...PRIVATE,
  },
  "/votar-forms": {
    title: "Votar Forms",
    description: "Create registration forms to collect voters for your elections.",
    ...PRIVATE,
  },
  "/votar-forms/[...id]": {
    title: "Create a Votar form",
    description: "Build a registration form and share its link with voters.",
    ...PRIVATE,
  },
  "/votar-forms/responses/[...id]": {
    title: "Form responses",
    description: "Review who filled in your form, then export them to your election.",
    ...PRIVATE,
  },
  "/profile": {
    title: "Profile",
    description: "Your Votar account details and saved payment cards.",
    ...PRIVATE,
  },
  "/profile/billing/add": {
    title: "Add a card",
    description: "Save a payment card to your Votar account.",
    ...PRIVATE,
  },
  "/profile/billing/edit/[...id]": {
    title: "Edit card",
    description: "Update a saved payment card on your Votar account.",
    ...PRIVATE,
  },
  "/preview-election/[...id]": {
    title: "Ballot preview",
    description: "Preview the ballot exactly as your voters will see it.",
    ...PRIVATE,
  },
  "/cast-votes": {
    title: "Ballot preview",
    description: "Preview a Votar ballot.",
    ...PRIVATE,
  },
  "/cast-votes/[...id]": {
    title: "Ballot preview",
    description: "Preview the ballot as your voters will see it.",
    ...PRIVATE,
  },

  // Voters
  "/access/[...id]": {
    title: "Enter your access code",
    description: "Enter the access code you received to open your secret ballot on Votar.",
    ...PRIVATE,
  },
  "/ballot": {
    title: "Your ballot",
    description: "Cast your vote securely on Votar.",
    ...PRIVATE,
  },
  "/freevotar/ballot": {
    title: "Your ballot",
    description: "Vote for your preferred candidates on Votar.",
    ...PRIVATE,
  },
  "/monitoring-elections/[...id]": {
    title: "Live results",
    description: "Follow this election's results live on Votar.",
    ...PRIVATE,
  },
  "/usersForm": {
    title: "Registration form",
    description: "Fill in this form to register as a voter for an election on Votar.",
    ...PRIVATE,
  },

  // Checkout
  "/payment/select-method": {
    title: "Choose how to pay",
    description: "Pick a payment method for your Votar credits.",
    ...PRIVATE,
  },
  "/payment/card-method": {
    title: "Pay with card",
    description: "Pay securely for your Votar credits with Paystack.",
    ...PRIVATE,
  },
  "/payment/bank-transfer": {
    title: "Chat with support",
    description: "Talk to Votar's team to pay for your credits and get them topped up.",
    ...PRIVATE,
  },

  // Admin console
  "/admin": {
    title: "Admin dashboard",
    description: "An overview of elections across Votar.",
    ...PRIVATE,
  },
  "/admin/login": {
    title: "Admin sign in",
    description: "Sign in to the Votar admin console.",
    ...PRIVATE,
  },
  "/admin/elections": {
    title: "Admin · Elections",
    description: "Every election on Votar, with publishing controls.",
    ...PRIVATE,
  },
  "/admin/users": {
    title: "Admin · Users",
    description: "Election creators and voters on Votar.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting": {
    title: "Admin · Free Votar & credits",
    description: "Free Votar organisers and Votar credit top-ups.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/pro": {
    title: "Admin · Votar Pro",
    description: "Organisers with Votar Pro elections.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/details/[...id]": {
    title: "Admin · Free Votar elections",
    description: "An organiser's Free Votar elections, with publishing controls.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/pro/details/[...id]": {
    title: "Admin · Votar Pro elections",
    description: "An organiser's Votar Pro elections, with publishing and SMS controls.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/election-details/[...id]": {
    title: "Admin · Election details",
    description: "An election's details and controls.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/votarpro-election-details/[...id]": {
    title: "Admin · Election details",
    description: "A Votar Pro election's details and controls.",
    ...PRIVATE,
  },
  "/admin/free-pro-meeting/election-details/purchasedVotes": {
    title: "Admin · Purchased votes",
    description: "Votes purchased for an election.",
    ...PRIVATE,
  },
  "/admin/coupon": {
    title: "Admin · Coupons",
    description: "Discounts organisers can apply to their elections.",
    ...PRIVATE,
  },
  "/admin/referals": {
    title: "Admin · Referrals",
    description: "Referrals across Votar.",
    ...PRIVATE,
  },
  "/admin/blogs-and-faqs": {
    title: "Admin · Blogs & FAQs",
    description: "Manage Votar's blog posts and FAQs.",
    ...PRIVATE,
  },
  "/admin/profile": {
    title: "Admin · Profile",
    description: "Your admin account and the administrators who can sign in.",
    ...PRIVATE,
  },
};
