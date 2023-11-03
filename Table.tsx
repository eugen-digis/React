import { Button, Checkbox, ListNotFound, ScrollArea } from '@/components/common';
import {
	Row,
	TableOptions,
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { TBody, THeader } from './components';
import { TablePagination } from './components/TablePagination';
import { options } from './components/TablePagination/components/ShowPerPage/constants';
import { defaultPaginationState } from '@/constants';

type Props<T> = Omit<TableOptions<T>, 'getCoreRowModel'> & {
	notFoundTitle?: string;
	notFoundText?: string;
	scrollAreaClass?: string;
	totalItems: number;
	onRowClick?: (row: T) => void;
	getRowStyles?: (row: Row<T>) => undefined | string;
	lightHeader?: boolean;
	hideGoTo?: boolean;
	hideShowPerPage?: boolean;
};

export const Table = <T extends object>({
	notFoundText = '',
	notFoundTitle = '',
	state,
	data,
	columns,
	totalItems,
	scrollAreaClass = '',
	lightHeader,
	hideGoTo,
	hideShowPerPage,
	onRowClick,
	getRowStyles,
	onPaginationChange,
	...props
}: Props<T>) => {
	const modifiedColumns = useMemo(() => {
		const colHelper = createColumnHelper<T>();
		const cols = [...columns];

		if (state?.rowSelection) {
			cols.unshift(
				colHelper.display({
					id: 'select',
					header: () => {
						return (
							<Checkbox
								variant="circled"
								containerClassName="data-[state=checked]:!border-white"
								iconClassName="!bg-white"
								{...{
									checked: table.getIsAllRowsSelected(),
									indeterminate: table.getIsSomeRowsSelected() + '',
									onCheckedChange: (value) => table.toggleAllRowsSelected(!!value),
								}}
							/>
						);
					},
					cell: ({ row }) => (
						<Checkbox
							variant="circled"
							{...{
								checked: row.getIsSelected(),
								disabled: !row.getCanSelect(),
								indeterminate: row.getIsSomeSelected() + '',
								onCheckedChange: row.getToggleSelectedHandler(),
							}}
						/>
					),
				})
			);
		}

		return cols;
	}, [columns]);

	const table = useReactTable({
		data,
		columns: modifiedColumns,
		state,
		isMultiSortEvent: () => true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		pageCount: Math.ceil(totalItems / (state?.pagination?.pageSize || options[0].value)),
		enableRowSelection: true,
		manualPagination: true,
		manualSorting: true,
		enableMultiSort: true,
		enableSorting: true,
		onPaginationChange,
		...props,
	});

	useEffect(() => {
		table.resetRowSelection();
	}, [data]);

	const headers = table.getHeaderGroups();
	const cols = table.getRowModel();
	const isPageTooFar = totalItems > 0 && !data.length;

	return (
		<>
			{data.length !== 0 ? (
				<div className="flex h-full w-full flex-1 flex-col">
					<ScrollArea className={scrollAreaClass}>
						<div className="mr-3 shadow-[0_4px_20px_rgba(0,0,0,0,1)]">
							<table className="relative w-full border-separate border-spacing-y-3">
								<THeader lightHeader={lightHeader} headers={headers} />
								<TBody getRowStyles={getRowStyles} onRowClick={onRowClick} columns={cols} />
							</table>
						</div>
					</ScrollArea>

					{state?.pagination && totalItems > defaultPaginationState.pageSize && (
						<TablePagination
							hideGoTo={hideGoTo}
							hideShowPerPage={hideShowPerPage}
							totalItems={totalItems}
							onPaginationChange={onPaginationChange}
							table={table}
						/>
					)}
				</div>
			) : (
				<ListNotFound
					title={isPageTooFar ? 'Not found' : notFoundTitle}
					text={isPageTooFar ? '' : notFoundText}
				>
					{isPageTooFar && (
						<Button className="mt-2" variant="outline" onClick={() => table.resetPageIndex()}>
							Go to the first page
						</Button>
					)}
				</ListNotFound>
			)}
		</>
	);
};
