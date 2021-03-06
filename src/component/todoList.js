import React from 'react';
import Tasks from './tasks/tasks'
import Header from './header/header'
import style from '../App.module.css'
import AddTasks from './addTasks/add-tasks'
import TaskOptions from './taskOptions/task-options'
import { changeStateApi, changeTextApi, createTaskApi, deleteAllTaskApi, deleteTaskApi, getAllTasks } from '../api/api';

class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      filtredTasks: [],
      filterSlate: false,
      active: ''
    }
  }

  componentDidMount() {

    getAllTasks().then(response => {
        this.setState(prevState => {
          return {
            ...prevState,
            tasks: response
          }
        })
      })
      .catch(err => {
        console.log(`Произошла ошибка: ${err}`)
      })
  }

  allTasksBtn = () => {
    this.setState({
      filterSlate: false,
      active: 'all'
    })
  }

  doneTasksBtn = () => {
    this.setState({
      filterSlate: true,
      active: 'done'
    })

    this.setState(prevState => {
      const filterArr = prevState.tasks.filter(item => {
        return (item.isDone)
      })
      return {
        ...prevState,
        filtredTasks: filterArr
      }
    })
  }

  notDoneTasksBtn = () => {
    this.setState({
      filterSlate: true,
      active: 'notDone'
    })
    this.setState(prevState => {
      const filterArr = prevState.tasks.filter(item => {
        return (!item.isDone)
      })
      return {
        ...prevState,
        filtredTasks: filterArr
      }
    })
  }

  addTasks = (task) => {
    const newTask = {
          todo: task,
          isDone: false
    }
    createTaskApi(newTask).then(()=> {
      
      this.setState(prevState => {
        return {
          ...prevState,
          tasks: prevState.tasks.concat(newTask)
        }
      })
    })
    .catch(err => {
      console.log(`Произошла ошибка: ${err}`)
    })
  }
  
  doneTask = id => {
    changeStateApi(id).then(() => {
      this.setState((prevState) => {
        return {
          tasks: prevState.tasks.map(tasks => {
            if (tasks._id === id) {
              return {
                ...tasks,
                isDone: !tasks.isDone
              }
            }
            return tasks
          })
        }
      })
    })
    .catch(err => {
      console.log(`Произошла ошибка: ${err}`)
    })
  }

  deleteTask = id => {
    deleteTaskApi(id).then(() => {
      this.setState(prevState => {
        return {
          tasks: prevState.tasks.filter(item => item._id !== id)
        }
      })
    })
  }

  getFilteredTasks = () => {
    if (!this.state.filterSlate) {
      return this.state.tasks
    }
    return this.state.filtredTasks
  }

  changeText = (id) => {
    let taskText = prompt('Введите новое название')
    changeTextApi(id, taskText).then(() =>{
      this.setState(prevState => {
        const prevStateMap = prevState.tasks.map(item => {
          if (item._id === id) {
            return {
              ...item,
              todo: taskText
            }
          }
          return item
        })
        return {
          ...prevState,
          tasks: prevStateMap
        }
      })
    })
    .catch(err => {
      console.log(`Произошла ошибка: ${err}`)
    })
    
  }

  clearAllTasks = () => {
    deleteAllTaskApi(this.state.tasks).then(() => {
      this.setState(prevState => {
        return {
          ...prevState,
          tasks: []
        }
      })
    })
    .catch(err => {
      console.log(`Произошла ошибка: ${err}`)
    })
    
  }

  render() {
    const { tasks } = this.state
    return (
      <div className={style.wrapper}>
        <Header tasks={tasks.length} />
        <AddTasks addTasks={this.addTasks} />
        {this.getFilteredTasks().map(tasks => {
          return (
            <Tasks
              key={tasks._id}
              tasks={tasks}
              deleteTask={() => this.deleteTask(tasks._id)}
              doneTask={() => this.doneTask(tasks._id)}
              changeText={() => this.changeText(tasks._id)}
            />
          )
        })}
        <TaskOptions
          state={this.state.active}
          doneTasksBtn={this.doneTasksBtn}
          notDoneTasksBtn={this.notDoneTasksBtn}
          allTasksBtn={this.allTasksBtn}
        />
        <div className={style.btnWrapper}>
          <button onClick={this.clearAllTasks}>Удалить все задачи</button>
        </div>
        <h3 className={style.link}>
            <a href={'/about'}>
                О приложение
            </a>
        </h3>
      </div>
    )
  }
}

export default TodoList;
