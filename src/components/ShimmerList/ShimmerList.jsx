const ShimmerList = () => {
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
      {skeletons.map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col map-module h-[420px] animate-pulse overflow-hidden bg-base-100/50"
        >
          {/* Flag Placeholder */}
          <div className="h-[180px] bg-base-content/10 relative">
             <div className="absolute bottom-4 left-4 w-12 h-4 bg-primary/20 rounded" />
          </div>
          
          <div className="p-6 flex flex-col flex-grow space-y-6 relative">
             {/* Abstract Lines */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-primary/5 rounded-tr-3xl" />

            {/* Title Placeholder */}
            <div className="h-6 bg-base-content/10 rounded w-2/3" />
            
            {/* Stats Placeholders */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary/10 rounded-full" />
                <div className="h-2 bg-base-content/5 rounded w-1/2" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary/10 rounded-full" />
                <div className="h-2 bg-base-content/5 rounded w-1/3" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary/10 rounded-full" />
                <div className="h-2 bg-base-content/5 rounded w-2/3" />
              </div>
            </div>

            <div className="mt-auto h-8 bg-base-content/5 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerList;

