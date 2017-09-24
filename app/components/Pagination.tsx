import * as React from 'react';
import Link from 'next/link';

export const PaginationComponent =
  ({ pageName, pageNo, pageCount }: PaginationProps) => (
    <div className="pagination">
      <PaginateLeft
        pageName={pageName} pageNo={pageNo} pageCount={pageCount} />

      <span className="page">{pageNo}/{pageCount}</span>

      <PaginateRight
        pageName={pageName} pageNo={pageNo} pageCount={pageCount} />
    </div>
  );

const PaginateLeft = ({ pageName, pageNo }: PaginationProps) => (
  <div>
    {
      pageNo > 1
        ? (<Link href={`/${pageName}?pageNo=${pageNo - 1}`} as={`/${pageName}/${pageNo - 1}`}><a className="prev">← prev</a></Link>)
        : (<span className="disabled">← prev</span>)
    }
  </div>
);

const PaginateRight = ({ pageName, pageNo, pageCount }: PaginationProps) => (
  <div>
    {
      pageNo < pageCount
        ? (<Link href={`/${pageName}?pageNo=${pageNo + 1}`} as={`/${pageName}/${pageNo + 1}`}><a className="next">next →</a></Link>)
        : (<span className="disabled">next →</span>)
    }
  </div>
);

type PaginationProps = {
  pageName: string;
  pageNo: number;
  pageCount: number;
};
