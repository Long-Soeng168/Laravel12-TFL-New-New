
export function MyCard() {
  return (
    <div className="max-w-xs w-full group/card">
    <div
      className="cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-end p-4 bg-black"
    >
      <img
        src="assets/images/about1.png"
        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
        alt="Author"
      />
      <div className="absolute inset-0 bg-black opacity-60 transition-opacity duration-300 group-hover/card:opacity-80"></div>

      <div className="relative z-10 text-white p-4">
        <h1 className="font-bold text-xl md:text-2xl">Author Card</h1>
        <p className="font-normal text-sm mt-2">
          Card with Author avatar, complete name and time to read - most suitable for blogs.
        </p>
      </div>
    </div>
  </div>
  );
}
