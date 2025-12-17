// components/DraggableRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOutlined } from '@ant-design/icons';

interface DraggableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const DraggableRow: React.FC<DraggableRowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    backgroundColor: isDragging ? '#fafafa' : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...props}
    >
      {React.Children.map(props.children, (child, index) => {
        if (index === 0) {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  {...listeners}
                  style={{ cursor: 'move', marginRight: 8 }}
                >
                  <DragOutlined />
                </span>
                {(child as React.ReactElement).props.children}
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

export default DraggableRow;