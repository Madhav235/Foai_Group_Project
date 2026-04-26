export default function DataTable({ columns, rows }) {
  return (
    <div className="max-h-[60vh] overflow-y-auto rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 bg-white text-slate-700 shadow-sm">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border-b border-slate-200 px-4 py-3 text-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
