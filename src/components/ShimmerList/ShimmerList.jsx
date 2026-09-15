const ShimmerList = () => {
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="glass-card rounded-2xl overflow-hidden border border-white/10 p-0 flex flex-col"
        >
          <div className="skeleton h-44 w-full rounded-b-none" />

          <div className="p-5 flex flex-col gap-4">
            <div className="skeleton h-5 w-3/4 rounded-lg" />

            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <div className="skeleton h-3.5 w-16" />
                <div className="skeleton h-3.5 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-3.5 w-14" />
                <div className="skeleton h-3.5 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-3.5 w-16" />
                <div className="skeleton h-3.5 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerList;
