import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';

export function NextPagination({ className, totalPages }) {
  const { query } = useRouter();

  return (
    <Pagination
      className={className}
      page={parseInt(query.page || '1')}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={NextLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}
const NextLink = forwardRef(({ item, query, ...props }, ref) => (
  <Link
    href={{
      pathname: '/search',
      query: { ...query, page: item.page },
    }}
    {...props}
  >
    <a {...props} ref={ref}></a>
  </Link>
));
