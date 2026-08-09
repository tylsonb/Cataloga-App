import type { ReactNode } from "react";

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          {headers.map((header) => <th key={header} className="py-2">{header}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
