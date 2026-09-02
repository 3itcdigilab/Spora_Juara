import React from 'react';
import { Link } from 'react-router';

export const PageHeader = ({ title, subtitle, breadcrumbs, actions, children }: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          {breadcrumbs.map((b: any, i: number) => (
            <React.Fragment key={i}>
              <Link to={b.path} className="hover:text-primary-600">{b.label}</Link>
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {(actions || children) && (
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {children}
      </div>
    )}
  </div>
);