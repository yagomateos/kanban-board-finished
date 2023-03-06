import { DeleteIcon, LinkIcon } from '@chakra-ui/icons';
import { Box, IconButton, ScaleFade, Tooltip } from '@chakra-ui/react';
import _ from 'lodash';
import { memo } from 'react';
import { useTaskDragAndDrop } from '../hooks/useTaskDragAndDrop';
import { TaskModel } from '../utils/models';
import { AutoResizeTextarea } from './AutoResizeTextArea';
import { Link } from 'react-router-dom'
import { ColumnType } from '../utils/enums';
import { debug } from '../utils/logging';

type TaskProps = {
  column: ColumnType
  index: number;
  task: TaskModel;
  onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
  onDelete: (id: TaskModel['id']) => void;
  onDropHover: (i: number, j: number) => void;
};

function Task({
  column,
  index,
  task,
  onUpdate: handleUpdate,
  onDropHover: handleDropHover,
  onDelete: handleDelete,
}: TaskProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
    { task, index: index },
    handleDropHover,
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
  };

  const handleDeleteClick = () => {
    handleDelete(task.id);
  };

  const handleLinkClick = () => {
      navigator.clipboard.writeText(location.href + `task/${column}/${task.id}`);
      debug(`Task ${task.id} copy to clipboard`)      
  };

  return (
    <ScaleFade in={true} unmountOnExit>      
      <Box
        ref={ref}
        as="div"
        role="group"
        position="relative"
        rounded="lg"
        w={200}
        pl={3}
        pr={7}
        pt={3}
        pb={1}
        boxShadow="xl"
        cursor="grab"
        fontWeight="bold"
        userSelect="none"
        bgColor={task.color}
        opacity={isDragging ? 0.5 : 1}
      >
        <IconButton
          position="absolute"
          top={0}
          right={0}
          zIndex={100}
          aria-label="delete-task"
          size="md"
          colorScheme="solid"
          color={'gray.700'}
          icon={<DeleteIcon />}
          opacity={0}
          _groupHover={{
            opacity: 1,
          }}
          onClick={handleDeleteClick}
        />
        <Tooltip hasArrow label='Copy to clipboard' placement='bottom'>
          <IconButton
            position="absolute"
            top={6}
            right={0}
            zIndex={100}
            aria-label="copy-task"
            size="md"
            colorScheme="solid"
            color={'gray.700'}
            icon={<LinkIcon />}
            opacity={0}
            _groupHover={{
              opacity: 1,
            }}
            onClick={handleLinkClick}
          />
        </Tooltip>
        <AutoResizeTextarea
          value={task.title}
          fontWeight="semibold"
          cursor="inherit"
          border="none"
          p={0}
          resize="none"
          minH={70}
          maxH={200}
          focusBorderColor="none"
          color="gray.700"
          onChange={handleTitleChange}
        />
        <Link to={`/task/${column}/${task.id}`}>Open</Link>
      </Box>
    </ScaleFade>
  );
}
export default memo(Task, (prev, next) => {
  if (
    _.isEqual(prev.task, next.task) &&
    _.isEqual(prev.index, next.index) &&
    prev.onDelete === next.onDelete &&
    prev.onDropHover === next.onDropHover &&
    prev.onUpdate === next.onUpdate
  ) {
    return true;
  }

  return false;
});
