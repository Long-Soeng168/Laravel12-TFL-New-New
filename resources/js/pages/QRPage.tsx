import React from "react";

export default function SelectWebsite() {
  const sites = [
    {
      name: "PG Market",
      desc: "Visit our official homepage for pgmarket.online",
      url: "https://pgmarket.online/",
      img: "/pgmarket.png",
    },
    {
      name: "Pond Growth",
      desc: "Visit our official homepage for pondgrowth.com",
      url: "https://www.pondgrowth.com/",
      img: "/pondgrowth.png",
    },
  ];

  return (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Destination</h1>
        <p className="text-gray-300">Select which site you’d like to visit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {sites.map((site, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform"
          >
            <img
              src={site.img}
              alt={site.name}
              className="aspect-video w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{site.name}</h2>
              <p className="text-gray-400 mb-6">{site.desc}</p>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Visit Site →
              </a>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        © {new Date().getFullYear()} PG Market
      </footer>
    </div>
  );
}
