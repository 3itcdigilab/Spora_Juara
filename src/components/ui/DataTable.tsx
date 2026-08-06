import React from 'react';
export interface DataTableProps { 
  columns: Array<{
    key?: string;
    accessor?: string;
    label?: string;
    header?: string;
    render?: (valOrRow: any, row?: any) => React.ReactNode;
  }>;
  data: any[]; 
  onRowClick?: (row: any) => void; 
}

export const DataTable = ({ columns, data, onRowClick }: DataTableProps) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          {columns.map((c, idx) => {
            const labelText = c.label || c.header || '';
            const keyVal = c.key || c.accessor || `col-${idx}`;
            return <th key={keyVal}>{labelText}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
            {columns.map((c, idx) => {
              const fieldKey = c.key || c.accessor || '';
              const labelText = c.label || c.header || '';
              const cellVal = fieldKey ? row[fieldKey] : undefined;
              const renderedContent = c.render 
                ? c.render(cellVal !== undefined ? cellVal : row, row) 
                : cellVal;
              return <td key={fieldKey || idx} data-label={labelText}>{renderedContent}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);