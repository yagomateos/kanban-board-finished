import { useEffect, useState } from 'react'
import {} from '@chakra-ui/icons';
import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import Column from './components/Column';
import DarkModeIconButton from './components/DarkModeIconButton';
import { ColumnType } from './utils/enums';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, ScaleFade } from '@chakra-ui/react';
import _ from 'lodash';
import { memo } from 'react';
import { useTaskDragAndDrop } from './hooks/useTaskDragAndDrop';
import { TaskModel } from './utils/models';
import { AutoResizeTextarea } from './components/AutoResizeTextArea';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { SERVER_URL } from './utils/Constants'

function Singlepage(){
    const [ task, setTask ] = useState(null)
    const { id, column } = useParams()
    
    useEffect(() => {
        if(id !== null && column !== null){
            console.log(id, column);
            axios.get(`${SERVER_URL}/${column}/${id}`)
                .then(res => {
                    setTask({
                        ...res.data
                    })
                })
                .catch(ex => console.error(ex));
        }
            
      }, [])
    // console.log(task, id, column);
    
    return (
        <main>
            <Heading
                fontSize={{ base: '4xl', sm: '5xl', md: '6xl' }}
                fontWeight="bold"
                textAlign="center"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
                mt={4}
            >
                {column} Task
            </Heading>
            <DarkModeIconButton position="absolute" top={0} right={2} />
            <Container maxWidth="container.lg" px={4} py={10}>
                <SimpleGrid
                    columns={{ base: 1, md: 4 }}
                    spacing={{ base: 16, md: 4 }}
                >
                        <Box
                            as="div"
                            role="group"
                            position="relative"
                            rounded="lg"
                            w={1000}
                            h={400}
                            pl={3}
                            pr={7}
                            pt={3}
                            pb={1}
                            boxShadow="xl"
                            userSelect="none"
                            bgColor={task?.color || 'gray.500'  }
                        >

                            <p>{task?.title || ''}</p>
                        </Box>
                </SimpleGrid>
            </Container>
      </main>
    )
}

export default Singlepage;