import React from "react";

function buildPageList(currentPage, totalPages) {
  const pages = [];
  const maxShown = 7;
  if (totalPages <= maxShown) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  const showLeft = Math.max(2, currentPage - 1);
  const showRight = Math.min(totalPages - 1, currentPage + 1);

  pages.push(1);
  if (showLeft > 2) pages.push("ellipsis-left");

  for (let i = showLeft; i <= showRight; i += 1) {
    pages.push(i);
  }

  if (showRight < totalPages - 1) pages.push("ellipsis-right");
  pages.push(totalPages);
  return pages;
}

const Pagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const items = buildPageList(currentPage, totalPages);

  const baseBtn =
    "min-w-8 h-8 px-2 inline-flex items-center justify-center border rounded text-sm select-none";

  return (
    <div className="flex items-center gap-2">
      <button
        className={`${baseBtn} ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === 1}
        onClick={() => onChange(1)}
        aria-label="Halaman pertama"
      >
        «
      </button>
      <button
        className={`${baseBtn} ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === 1}
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        aria-label="Sebelumnya"
      >
        ‹
      </button>

      {items.map((it, idx) =>
        typeof it === "number" ? (
          <button
            key={`${it}-${idx}`}
            className={`${baseBtn} ${
              it === currentPage
                ? "bg-blue-50 border-blue-400 text-blue-700"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onChange(it)}
          >
            {it}
          </button>
        ) : (
          <span key={`${it}-${idx}`} className="px-2 text-gray-500">
            …
          </span>
        )
      )}

      <button
        className={`${baseBtn} ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        aria-label="Berikutnya"
      >
        ›
      </button>
      <button
        className={`${baseBtn} ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onChange(totalPages)}
        aria-label="Halaman terakhir"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
