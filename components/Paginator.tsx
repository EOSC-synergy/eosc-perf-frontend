import { type FC } from 'react';
import { Pagination } from 'react-bootstrap';
import { range } from 'lodash';

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
    readonly page: number;
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
export const Paginator: FC<PaginatorProps> = ({ pagination, navigateTo }) => (
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
        {pagination.pages > 1 && pagination.pages <= 5 ? (
            range(1, pagination.pages + 1).map((page) => (
                <Pagination.Item
                    active={page === pagination.page}
                    onClick={() => navigateTo(page)}
                    key={page}
                >
                    {page}
                </Pagination.Item>
            ))
        ) : (
            <>
                <Pagination.Item
                    active={pagination.page === 1}
                    onClick={() => navigateTo(1)}
                    key={1}
                >
                    1
                </Pagination.Item>
                {pagination.page > 3 && <Pagination.Ellipsis disabled />}
                {pagination.page >= 3 && pagination.pages > 3 && (
                    <Pagination.Item
                        onClick={() => navigateTo(pagination.page - 1)}
                        key={pagination.page - 1}
                    >
                        {pagination.page - 1}
                    </Pagination.Item>
                )}
                {pagination.page !== 1 && pagination.page !== pagination.pages && (
                    <Pagination.Item
                        active
                        onClick={() => navigateTo(pagination.page)}
                        key={pagination.page}
                    >
                        {pagination.page}
                    </Pagination.Item>
                )}
                {pagination.page <= pagination.pages - 2 && pagination.pages > 3 && (
                    <Pagination.Item
                        onClick={() => navigateTo(pagination.page + 1)}
                        key={pagination.page + 1}
                    >
                        {pagination.page + 1}
                    </Pagination.Item>
                )}
                {pagination.page < pagination.pages - 2 && <Pagination.Ellipsis disabled />}
                {pagination.pages > 1 && (
                    <Pagination.Item
                        active={pagination.page === pagination.pages}
                        onClick={() => navigateTo(pagination.pages)}
                        key={pagination.pages}
                    >
                        {pagination.pages}
                    </Pagination.Item>
                )}
            </>
        )}

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
