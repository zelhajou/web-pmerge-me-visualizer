import React from 'react';

/**
 * Reusable Card component
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footer,
  header,
  ...props
}) => {
  return (
    <div
      className={`bg-white border rounded-md shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {/* Optional header */}
      {header && (
        <div className="bg-gray-50 border-b px-4 py-3">
          {header}
        </div>
      )}
      
      {/* Title and subtitle */}
      {(title || subtitle) && (
        <div className={`px-4 py-3 ${header ? '' : 'border-b'} ${titleClassName}`}>
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>
      )}
      
      {/* Card body */}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Optional footer */}
      {footer && (
        <div className="bg-gray-50 border-t px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;