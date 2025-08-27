import React, { useEffect, useState } from 'react';

const variants = {
  poster: {
    wrapper: 'bg-gradient-to-br from-gray-800 to-gray-700 text-white flex items-center justify-center',
    icon: '🎬',
  },
  news: {
    wrapper: 'bg-gradient-to-br from-orange-200 to-red-200 text-orange-900 flex items-center justify-center',
    icon: '📰',
  },
  product: {
    wrapper: 'bg-gradient-to-br from-amber-200 to-yellow-200 text-amber-900 flex items-center justify-center',
    icon: '🛍️',
  },
  generic: {
    wrapper: 'bg-gray-200 text-gray-600 flex items-center justify-center',
    icon: '📷',
  },
};

const ImageWithFallback = ({ src, alt = '', className = '', variant = 'generic', label = '' }) => {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    // Reset error when src changes
    setErrored(!src);
  }, [src]);

  if (!errored && src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setErrored(true)}
      />
    );
  }

  const v = variants[variant] || variants.generic;
  const text = (label || alt || '').toString().trim();

  return (
    <div className={`${className} ${v.wrapper}`}
         aria-label={alt}
         role="img"
    >
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="text-3xl mb-1 select-none">{v.icon}</div>
        {text && (
          <div className="text-xs opacity-80 line-clamp-2">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageWithFallback;