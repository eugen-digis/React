import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Identifier } from 'dnd-core';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { checkDrag } from '@/utils';
import { ItemTypes, DragItem, DragableItem } from '@/types';
import clsx from 'clsx';

export interface CardProps<T> {
	Card: React.FC<T>;
	data: T;
	index: number;
	moveCard: (dragIndex: number, hoverIndex: number) => void;
	className?: string;
	dragDotsClassName?: string;
}

export const DraggableListItem = <T extends DragableItem>({
	data,
	index,
	moveCard,
	className,
	dragDotsClassName,
	Card,
}: CardProps<T>) => {
	const ref = useRef<HTMLDivElement>(null);
	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: ItemTypes.BOX,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			const shouldBreak = checkDrag(ref, monitor, dragIndex, hoverIndex)

			if (shouldBreak) return;

			moveCard(dragIndex, hoverIndex);
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag, preview] = useDrag(
		{
			type: ItemTypes.BOX,
			item: () => ({ id: data.id, index }),
			collect: (monitor: any) => ({
				isDragging: monitor.isDragging(),
			}),
		},
		[data, index]
	);

	const opacity = isDragging ? 0.4 : 1;
	drag(drop(ref));

	const renderItem = () => {
		if (Card) return Card(data);

		return <></>;
	};

	return (
		<div style={{ opacity }} className={clsx('flex flex-row items-center', className)}>
			<div
				ref={ref}
				className={clsx('flex w-12 cursor-move justify-center bg-transparent', dragDotsClassName)}
			>
				<MdOutlineDragIndicator size={24} />
			</div>
			<div
				ref={preview}
				className={clsx(
					'flex w-full flex-1',
					isDragging && 'max-h-[60px] min-w-full cursor-move bg-white'
				)}
				data-handler-id={handlerId}
			>
				{renderItem()}
			</div>
		</div>
	);
};
