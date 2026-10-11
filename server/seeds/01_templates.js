
exports.seed = async function (knex) {
  const existing = await knex("templates").first("id");

  // Avoid inserting duplicates when the seed runs again.
  if (existing) return;

  await knex("templates").insert([
    {
      name: "SaaS Dashboard",
      description:
        "A modern analytics dashboard for SaaS products and business metrics.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      category: "Dashboard",
    },
    {
      name: "E-commerce Store",
      description:
        "A clean storefront layout for showcasing products and collections.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      category: "E-commerce",
    },
    {
      name: "Portfolio Website",
      description:
        "A professional portfolio for developers, designers, and freelancers.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
      category: "Portfolio",
    },
    {
      name: "Agency Landing Page",
      description:
        "A conversion-focused landing page for digital agencies and startups.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      category: "Landing Page",
    },
    {
      name: "Online Learning Platform",
      description:
        "A course discovery interface for educational platforms and instructors.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
      category: "Education",
    },
  ]);
};
