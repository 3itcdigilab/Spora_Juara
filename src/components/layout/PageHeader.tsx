import React from 'react';
import { Link } from 'react-router';
export const PageHeader = ({ title, subtitle, breadcrumbs, actions }: any) => (
  <div className="page-header">
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
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);