import { type FC } from 'react';
import { Pagination } from 'react-bootstrap';

/**
 * Representation of an OpenAPI pagination object
 */
export type Paginatable = {
    /**
     * Page index of next page
     */
    readonly next_num: number;

    /**
     * Page index of previous page
     */
    readonly prev_num: number;

    /**
     * Total number of pages
     */
    readonly total: number;

    /**
     * Maximum number of items per page
     */
    per_page?: number;

    /**
     * Whether there is a next page
     */
    readonly has_next: boolean;

    /**
     * Whether there is a previous page
     */
    readonly has_prev: boolean;

    /**
     * Total number of pages available
     */
    readonly pages: number;

    /**
     * The current page
     */
    page?: number;
};

/**
 * Generic for pagination of a specific object type
 */
export type Paginated<Type> = { items: Type[] } & Paginatable;

type PaginatorProps = {
    pagination: Paginatable;
    navigateTo: (pageIndex: number) => void;
};

/**
 * Component to navigate between pages of a pagination object
 *
 * @param props
 * @param props.pagination paginatable object to navigate through
 * @param props.navigateTo callback to navigate to another page in the pagination
 */
const Paginator: FC<PaginatorProps> = ({ pagination, navigateTo }) => (
    <Pagination className="align-items-center mb-0" data-testid="paginator">
        <Pagination.First
            disabled={pagination.pages === 0 || pagination.page === 1}
            onClick={() => navigateTo(1)}
            data-testid="paginator-first"
        />
        <Pagination.Prev
            disabled={!pagination.has_prev}
            onClick={() => navigateTo(pagination.prev_num)}
            data-testid="paginator-prev"
        />
        {/* TODO: don't show all pages, only nearby 3-5? */}
        {[...Array(pagination.pages).keys()].map((n: number) => (
            <Pagination.Item
                active={pagination.page === n + 1}
                onClick={() => navigateTo(n + 1)}
                key={n + 1}
            >
                {n + 1}
            </Pagination.Item>
        ))}
        <Pagination.Next
            disabled={!pagination.has_next}
            onClick={() => navigateTo(pagination.next_num)}
            data-testid="paginator-next"
        />
        <Pagination.Last
            disabled={pagination.pages === 0 || pagination.page === pagination.pages}
            onClick={() => navigateTo(pagination.pages)}
            data-testid="paginator-last"
        />
    </Pagination>
);

export default Paginator;
