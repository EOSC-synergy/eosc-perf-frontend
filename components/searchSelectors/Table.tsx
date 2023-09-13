import { type ReactElement, type ReactNode } from 'react';
import type Identifiable from 'components/Identifiable';
import actionable from 'styles/actionable.module.css';

type TableProps<Item> = {
    items?: Item[];
    setItem: (benchmark: Item) => void;
    tableName: string;
    displayItem: (item: Item) => ReactNode;
};

function Table<Item extends Identifiable>({
    items,
    setItem,
    tableName,
    displayItem,
}: TableProps<Item>): ReactElement {
    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ borderBottom: '3px solid #000' }}>{tableName}</th>
                </tr>
            </thead>
            <tbody>
                {items && items.length > 0 ? (
                    items.map((item: Item) => (
                        <tr key={item.id}>
                            <td style={{ borderBottom: '1px solid #ddd' }}>
                                <div
                                    onClick={() => setItem(item)}
                                    className={actionable['actionable']}
                                >
                                    {displayItem(item)}
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td>No results found!</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default Table;
