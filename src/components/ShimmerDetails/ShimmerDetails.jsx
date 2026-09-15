import PropTypes from 'prop-types';

const ShimmerBlock = ({ width = '100%', height = '20px', radius = '0.75rem', className = '' }) => (
  <div
    className={`skeleton flex-shrink-0 ${className}`}
    style={{ width, height, borderRadius: radius }}
  />
);

ShimmerBlock.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  radius: PropTypes.string,
  className: PropTypes.string,
};

const ShimmerDetails = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="relative w-full min-h-[380px] overflow-hidden bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col justify-between h-full">
          <div className="flex justify-between items-center mb-16">
            <ShimmerBlock width="90px" height="38px" radius="9999px" />
            <ShimmerBlock width="80px" height="38px" radius="9999px" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <ShimmerBlock width="200px" height="130px" radius="1.25rem" />
            <div className="space-y-3">
              <ShimmerBlock width="140px" height="14px" />
              <ShimmerBlock width="320px" height="50px" radius="1rem" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-pill p-4 flex items-center gap-3">
              <ShimmerBlock width="24px" height="24px" radius="9999px" />
              <div className="space-y-1.5 flex-1">
                <ShimmerBlock width="40%" height="10px" />
                <ShimmerBlock width="70%" height="16px" />
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <ShimmerBlock width="40%" height="16px" />
            <ShimmerBlock width="100%" height="180px" />
          </div>

          <div className="glass-card p-6 space-y-4">
            <ShimmerBlock width="50%" height="16px" />
            <ShimmerBlock width="100%" height="180px" />
          </div>

          <div className="glass-card p-6 space-y-4">
            <ShimmerBlock width="45%" height="16px" />
            <ShimmerBlock width="100%" height="180px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerDetails;
