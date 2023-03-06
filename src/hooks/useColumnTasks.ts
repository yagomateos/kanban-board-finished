import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ColumnType } from '../utils/enums';
import { pickChakraRandomColor, swap } from '../utils/helpers';
import { debug } from '../utils/logging';
import { TaskModel } from '../utils/models';
import useTaskCollection from './useTaskCollection';
import { SERVER_URL } from '../utils/Constants'


const MAX_TASK_PER_COLUMN = 100;

function useColumnTasks(column: ColumnType) {
  const [tasks, setTasks] = useTaskCollection();
  
  const columnTasks = tasks[column];

  const addEmptyTask = () => {
    debug(`Adding new empty task to ${column} column`);
    setTasks((allTasks) => {
      const columnTasks = allTasks[column];
      
      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        debug('Too many task!');
        return allTasks;
      }

      const newColumnTask: TaskModel = {
        id: uuidv4(),
        title: `New ${column} task`,
        color: pickChakraRandomColor('.300'),
        column,
      };
      axios.post(`${SERVER_URL}/${column}`, newColumnTask)
                .catch(ex => console.error(ex));
      return {
        ...allTasks,
        [column]: [newColumnTask, ...columnTasks],
      };
    })    
  };

  const deleteTask = useCallback(
    (id: TaskModel['id']) => {
      debug(`Removing task ${id}..`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column];
        axios.delete(`${SERVER_URL}/${column}/${id}`)
                .catch(ex => console.error(ex));
        return {
          ...allTasks,
          [column]: columnTasks.filter((task) => task.id !== id),
        };
      });
    },
    [column, setTasks],
  );

  const updateTask = useCallback(
    (id: TaskModel['id'], updatedTask: Omit<Partial<TaskModel>, 'id'>) => {
      debug(`Updating task ${id} with ${JSON.stringify(updatedTask)}`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column];
        axios.put(`${SERVER_URL}/${column}/${id}`, updatedTask)
                    .catch(ex => console.error(ex));
        return {
          ...allTasks,
          [column]: columnTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task,
          ),
        };
      });
    },
    [column, setTasks],
  );

  const dropTaskFrom = useCallback(
    (from: ColumnType, id: TaskModel['id']) => {
      
      setTasks((allTasks) => {
        
        const fromColumnTasks = allTasks[from];
        const toColumnTasks = allTasks[column];
        const movingTask = fromColumnTasks.find((task) => task.id === id);
        axios.post(`${SERVER_URL}/${column}`, {...movingTask, column})
                .catch(ex => console.error(ex));
        axios.delete(`${SERVER_URL}/${from}/${id}`)
                .catch(ex => console.error(ex));
        debug(`Moving task ${movingTask?.id} from ${from} to ${column}`);

        if (!movingTask) {
          return allTasks;
        }

        // remove the task from the original column and copy it within the destination column
        return {
          ...allTasks,
          [from]: fromColumnTasks.filter((task) => task.id !== id),
          [column]: [{ ...movingTask, column }, ...toColumnTasks],
        };
      });
    },
    [column, setTasks],
  );

  const swapTasks = useCallback(
    (i: number, j: number) => {
      debug(`Swapping task ${i} with ${j} in ${column} column`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column];
        return {
          ...allTasks,
          [column]: swap(columnTasks, i, j),
        };
      });
    },
    [column, setTasks],
  );

  useEffect(() => {
    axios.get(`${SERVER_URL}/db`)
        .then(res => {
          setTasks((allTasks) => {
            return {
              ...allTasks,
              [column]: res.data[column],
            };
          });
        })
        .catch(ex => console.error(ex));
  }, [column, setTasks])

  return {
    tasks: columnTasks,
    addEmptyTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnTasks;
