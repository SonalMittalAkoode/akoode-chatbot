/**
 * Compact pagination component - shows first, last, current ± neighbors, and ellipses.
 * Keeps the UI clean when there are many pages (e.g. 22+).
 */
const Pagination = ({ totalCount, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  if (totalPages <= 1) return null;

  const getPaginationItems = () => {
    const siblingCount = 2; // pages to show on each side of current

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => ({ type: "page", value: i + 1 }));
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const items = [{ type: "page", value: 1 }];
    if (showLeftEllipsis) items.push({ type: "ellipsis" });
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) items.push({ type: "page", value: i });
    }
    if (showRightEllipsis) items.push({ type: "ellipsis" });
    if (totalPages > 1) items.push({ type: "page", value: totalPages });

    return items;
  };

  const items = getPaginationItems();

  return (
    <div className="mbp_pagination">
      <ul className="page_navigation">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          >
            <span className="flaticon-left-arrow"></span>
          </a>
        </li>

        {items.map((item, idx) =>
          item.type === "ellipsis" ? (
            <li key={`ellipsis-${idx}`} className="page-item page-item-ellipsis">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li
              key={item.value}
              className={`page-item ${currentPage === item.value ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.value);
                }}
              >
                {item.value}
              </a>
            </li>
          )
        )}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          >
            <span className="flaticon-right-arrow"></span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
