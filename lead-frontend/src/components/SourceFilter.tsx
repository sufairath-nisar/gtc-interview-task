'use client';

import React from 'react';

interface SourceFilterProps {
  uniqueSources: string[];
  sourceFilter: string;
}

export default function SourceFilter({ uniqueSources, sourceFilter }: SourceFilterProps) {
  return (
    <select
      name="source"
      defaultValue={sourceFilter}
      className="
        border border-gray-300 rounded-md
        px-3 py-2
        text-gray-700
        bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition
        cursor-pointer
        hover:border-blue-400
        min-w-[160px]
        sm:min-w-[200px]
      "
      onChange={(e) => {
        const value = e.target.value;
        window.location.href = value ? `/leads?source=${value}` : `/leads`;
      }}
      aria-label="Filter leads by source"
    >
      <option value="">All Sources</option>
      {uniqueSources.map((source) => (
        <option key={source} value={source}>
          {source}
        </option>
      ))}
    </select>
  );
}
