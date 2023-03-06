import { useLocalStorage } from 'usehooks-ts';

import { ColumnType } from '../utils/enums';
import { TaskModel } from '../utils/models';

function useTaskCollection() {
  return useLocalStorage<{
    [key in ColumnType]: TaskModel[];
  }>('tasks', {
    Todo: [
      
    ],
    'In-Progress': [
      
    ],
    Blocked: [
      
    ],
    Completed: [
      
    ],
  });
}

export default useTaskCollection;
