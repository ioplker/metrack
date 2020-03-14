<template>
  <div
    id="app"
    :class="colorTheme">
    <app-menu
      :lastSaveDate="lastSaveDate"
      @onLoadFromFile="loadFromFile"
      @onSaveToFile="saveToFile()"
      @onLoadFromStorage="loadFromStorage()"
      @onSaveToStorage="saveToStorage()"
      @onClearStorage="clearStorage()"
      @onGenerateMockData="generateMockData()"
      @onThemeSet="setTheme($event)"
      ></app-menu>

    <app-main-button
      @onBtnPress="toggleCurrentTaskState"
      :isStarted="isCurrentTaskStarted"
      :currentTask="currentTask"
      :currentTaskProject="currentTaskProject"
      :currentTaskTotalTime="currentTaskTotalTime"
      :projects="projectsList"
      ></app-main-button>

    <app-side-info
      :todayMarkedTime="todayMarkedTime"
      ></app-side-info>

    <app-task-panel
      :selectedTask="selectedTask"
      :selectedTaskProject="selectedTaskProject"
      :selectedTaskPeriods="selectedTaskPeriods"
      :projects="projectsList"
      @onTaskAdded="addTask"
      ></app-task-panel>

    <app-tasks-list
      :tasks="tasksList"
      :projects="projectsList"
      :selectedTaskId="selectedTaskId"
      :currentTaskId="currentTaskId"
      @onTaskSelect="selectTask"
      @onTaskSetCurrent="setCurrentTask"
      @onTaskToggleVisible="toggleTaskVisible"
      ></app-tasks-list>

    <app-statistics
      :timedTasks="timedTasks"
      :timedProjects="timedProjects"
      :periods="periodsList"
      ></app-statistics>
  </div>
</template>

<script>
  import Menu from "./components/Menu";
  import MainButton from "./components/MainButton";
  import SideInfo from "./components/SideInfo";
  import TaskPanel from "./components/TaskPanel";
  import TasksList from "./components/TasksList";
  import Statistics from "./components/Statistics";

  export default {
    components: {
      appMenu: Menu,
      appMainButton: MainButton,
      appSideInfo: SideInfo,
      appTaskPanel: TaskPanel,
      appTasksList: TasksList,
      appStatistics: Statistics,
    },
    data() {
      return {
        colorTheme: '',
        todayMarkedTime: 0,
        lastSaveDate: null,
        selectedTaskId: null,
        currentTaskId: null,
        isCurrentTaskStarted: false,
        projectsList: [],
        tasksList: [],
        periodsList: [],
        timedTasks: {},
        timedProjects: {},
      };
    },
    computed: {
      selectedTask() {
        return this.getTaskById(this.selectedTaskId);
      },
      selectedTaskProject() {
        const task = this.getTaskById(this.selectedTaskId);
        if (task) {
          return this.getProjectById(task.project);
        }
        return null;
      },
      selectedTaskPeriods() {
        if (this.selectedTaskId) {
          return this.getTaskPeriods(this.selectedTaskId);
        }
        return [];
      },
      currentTask() {
        if (this.currentTaskId) {
          return this.getTaskById(this.currentTaskId);
        }
        return null;
      },
      currentTaskProject() {
        const task = this.getTaskById(this.currentTaskId);
        if (task) {
          return this.getProjectById(task.project);
        }
        return null;
      },
      currentTaskTotalTime() {
        let totalTime = 0;
        const task = this.getTaskById(this.currentTaskId);
        if (task) {
          const taskPeriods = this.getTaskPeriods(task.id);
          taskPeriods.forEach(period => totalTime += period.duration);
        }
        return totalTime;
      },
    },
    mounted() {
      this.loadFromStorage(true);
      this.updateTimedTasksAndProjects();
    },
    methods: {
      generateMockData() {
        let today = new Date();
        today = this.getFlatDate(today);
        const projects = [
          {id: 'prj_0', name: 'стельки.рф'},
          {id: 'prj_1', name: 'modula.net'},
          {id: 'prj_2', name: 'master.com'},
          {id: 'prj_3', name: 'cool-things.me'},
          {id: 'prj_4', name: 'corgi-app'}
        ];

        const tasks = [];
        projects.forEach(project => {
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Шапка', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Шапка для мобилки', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Сайдбар', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Сайдбар для мобилки', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Контент', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Контент для мобилки', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Подвал', text: ''});
          tasks.push({id: `tsk_${tasks.length}`, project: project.id, visible: false, createdDate: 0, name: 'Верстка. Подвал для мобилки', text: ''});
        });

        const periods = [];
        let startDate;
        let endDate = new Date(today);
        endDate.setHours(18);
        tasks.forEach(task => {
          const periodsCount = this.getRandomInt(1, 5);
          for (let i = 0; i < periodsCount; i++) {
            const hours = - this.getRandomInt(0, 3);
            const minutes = - this.getRandomInt(1, 59);

            startDate = this.addHours(endDate, hours);
            startDate = this.addMinutes(startDate, minutes);
            const duration = endDate.valueOf() - startDate.valueOf();
            periods.unshift({task: task.id, project: task.project, start: startDate.valueOf(), end: endDate.valueOf(), duration: duration});

            endDate = new Date(startDate);
          }
          task.createdDate = startDate.valueOf();
        });

        this.projectsList = projects;
        this.tasksList = tasks;
        this.periodsList = periods;
        this.updateTimedTasksAndProjects();
      },
      setTheme(colorTheme) {
        this.colorTheme = colorTheme;
      },
      addDays(dateObj, days) {
        const newDate = new Date();
        newDate.setTime(dateObj.getTime() + (days*24*60*60*1000));
        return newDate;
      },
      addHours(dateObj, hours) {
        const newDate = new Date();
        newDate.setTime(dateObj.getTime() + (hours*60*60*1000));
        return newDate;
      },
      addMinutes(dateObj, minutes) {
        const newDate = new Date();
        newDate.setTime(dateObj.getTime() + (minutes*60*1000));
        return newDate;
      },
      getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      getFlatDate(dateObj) {
        const newDate = new Date(dateObj);
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);

        return newDate;
      },
      loadFromStorage(skipWarning=false) {
        const doLoading = skipWarning ? true : confirm('Загрузить сохранение? \nВсе изменения будут утеряны!');
        if (doLoading) {
          const loadingObjects = [
            'lastSaveDate',
            'currentTaskId',
            'selectedTaskId',
            'projectsList',
            'tasksList',
            'periodsList',
            'timedTasks',
            'timedProjects',
          ];

          loadingObjects.forEach(key => {
            const value = localStorage.getItem(`meTrack_${key}`);
            if (value) {
              this[key] = JSON.parse(value);
            }
          });
        }
        this.calcTodayMarkedTime();
      },
      saveToStorage() {
        const now = new Date();
        this.lastSaveDate = now.valueOf();

        let doRestartCurrentTask = this.isCurrentTaskStarted;

        // Temporarily stopping current task
        if (doRestartCurrentTask) {
          this.toggleCurrentTaskState()
        }

        const savingObjects = {
          lastSaveDate: this.lastSaveDate,
          currentTaskId: this.currentTaskId,
          selectedTaskId: this.selectedTaskId,
          projectsList: this.projectsList,
          tasksList: this.tasksList,
          periodsList: this.periodsList,
          timedTasks: this.timedTasks,
          timedProjects: this.timedProjects,
        };

        Object.keys(savingObjects).forEach(key => {
          const parsed = JSON.stringify(savingObjects[key]);
          localStorage.setItem(`meTrack_${key}`, parsed);
        });

        // Restarting current task
        if (doRestartCurrentTask) {
          this.toggleCurrentTaskState()
        }
      },
      clearStorage() {
        if (confirm('Удалить данные из браузера?')) {
          const clearingObjects = [
            'lastSaveDate',
            'currentTaskId',
            'selectedTaskId',
            'projectsList',
            'tasksList',
            'periodsList',
            'timedTasks',
            'timedProjects',
          ];

          clearingObjects.forEach(key => {
            localStorage.removeItem(`meTrack_${key}`);
          });

          this.lastSaveDate = null;
        }
      },
      saveToFile() {
        const now = new Date();
        const readableDate = this.$options.filters.shortDate(now.valueOf());

        let doRestartCurrentTask = this.isCurrentTaskStarted;

        // Temporarily stopping current task
        if (doRestartCurrentTask) {
          this.toggleCurrentTaskState()
        }

        let data = {
          lastSaveDate: now.valueOf(),
          currentTaskId: this.currentTaskId,
          selectedTaskId: this.selectedTaskId,
          projectsList: this.projectsList,
          tasksList: this.tasksList,
          periodsList: this.periodsList,
          timedTasks: this.timedTasks,
          timedProjects: this.timedProjects,
        };
        data = JSON.stringify(data);
        const filename = `metrack-save-${readableDate}.json`;

        const file = new Blob([data], {type: "application/json;charset=utf-8"});
        // IE10+
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, filename);

        // Other browsers
        } else {
          let a = document.createElement("a");
          let url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }, 0);
        }

        // Restarting current task
        if (doRestartCurrentTask) {
          this.toggleCurrentTaskState()
        }
      },
      loadFromFile(fileContents) {
        console.log(fileContents);
        const data = JSON.parse(fileContents);

        this.lastSaveDate = data.lastSaveDate;
        this.currentTaskId = data.currentTaskId;
        this.selectedTaskId = data.selectedTaskId;
        this.projectsList = data.projectsList;
        this.tasksList = data.tasksList;
        this.periodsList = data.periodsList;
        this.timedTasks = data.timedTasks;
        this.timedProjects = data.timedProjects;

        // Additionally save to LocalStorage
        this.saveToStorage();
      },
      toggleCurrentTaskState() {
        this.isCurrentTaskStarted = !this.isCurrentTaskStarted;

        if (this.currentTask) {
          const now = new Date();
          let timePeriod;
          if (this.isCurrentTaskStarted) {
            timePeriod = {
              task: this.currentTask.id,
              project: this.currentTask.project,
              start: now.valueOf(),
              end: null,
              duration: null
            };
            this.registerTimePeriod(timePeriod);
          } else {
            timePeriod = this.periodsList.pop();
            timePeriod.end = now.valueOf();
            timePeriod.duration = timePeriod.end - timePeriod.start;

            // Don't push periods lesser than 1 minute
            if (timePeriod.duration >= 60000) {
              this.registerTimePeriod(timePeriod);
            }
          }
          this.calcTodayMarkedTime();
        }
      },
      registerTimePeriod(period) {
        this.periodsList.push(period);
        this.addTimedTask(this.getTaskById(period.task), period);
        this.addTimedProject(this.getProjectById(period.project), period);
      },
      updateTimedTasksAndProjects() {
        this.timedTasks = {};
        this.timedProjects = {};

        this.periodsList.forEach(period => {
          const task = this.getTaskById(period.task);
          this.addTimedTask(task, period);

          const project = this.getProjectById(task.project);
          this.addTimedProject(project, period);
        });
      },
      addTimedTask(task, period) {
        let day = this.getFlatDate(period.start);
        day = String(day.valueOf());


        if (!Object.keys(this.timedTasks).includes(day)) {
          this.$set(this.timedTasks, day, {});
        }

        if (!Object.keys(this.timedTasks[day]).includes(task.id)) {
          this.$set(this.timedTasks[day], task.id, {
            name: task.name,
            project: task.project,
            duration: 0,
          });
        }

        this.$set(this.timedTasks[day][task.id], 'duration', Number(this.timedTasks[day][task.id].duration) + period.duration);
      },
      addTimedProject(project, period) {
        if (!Object.keys(this.timedProjects).includes(project.id)) {
          this.$set(this.timedProjects, project.id, {
            name: project.name,
            duration: 0,
          });
        }

        this.timedProjects[project.id].duration += period.duration;
      },
      calcTodayMarkedTime() {
        let markedTime = 0;
        let today = new Date();
        const shortDateFilter = this.$options.filters.shortDate;

        today = shortDateFilter(today.valueOf());

        const firstIndex = this.periodsList.findIndex(period => {
          return shortDateFilter(period.start) === today;
        });
        if (firstIndex !== -1) {
          const periodsToCount = this.periodsList.slice(firstIndex);
          periodsToCount.forEach(period => markedTime += period.duration);
        }

        this.todayMarkedTime = markedTime;
      },
      addTask(taskData) {
        const task = this.createTask(taskData);
        this.tasksList.push(task);

        this.selectTask(task.id);
      },
      selectTask(taskId) {
        this.selectedTaskId = taskId;
      },
      setCurrentTask(taskId) {
        const task = this.getTaskById(taskId);

        if (task && task.visible) {
          if (this.currentTaskId !== taskId) {
            // Stop old task
          if (this.isCurrentTaskStarted) {
            this.toggleCurrentTaskState()
          }

          // Start new task
          this.currentTaskId = taskId;
          }
          this.toggleCurrentTaskState()
        }
      },
      toggleTaskVisible(taskId) {
        const task = this.getTaskById(taskId);

        if (task) {
          if (this.currentTaskId === taskId && this.isCurrentTaskStarted) {
            this.toggleCurrentTaskState();
          }
          task.visible = !task.visible;

          this.selectedTaskId = this.selectedTaskId === task.id ? null : this.selectedTaskId;
          this.currentTaskId = this.currentTaskId === task.id ? null : this.currentTaskId;
        }
      },
      createTask(taskData) {
        const now = new Date();
        let project = this.getProjectByName(taskData.project);
        if (!project) {
          project = {
            id: `prj_${this.projectsList.length}`,
            name: taskData.project
          };
          this.projectsList.push(project);
        }

        return {
          id: `tsk_${this.tasksList.length}`,
          project: project.id,
          visible: true,
          name: taskData.name,
          text: taskData.text,
          createdDate: now.valueOf(),
        };
      },
      getTaskById(taskId) {
        return this.tasksList.find(task => task.id === taskId) || null;
      },
      getProjectById(projectId) {
        return this.projectsList.find(project => project.id === projectId) || null;
      },
      getProjectByName(projectName) {
        return this.projectsList.find(project => project.name === projectName) || null;
      },
      getTaskPeriods(taskId) {
        return this.periodsList.filter(period => period.task === taskId);
      },
    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  button {
    font-family: Helvetica, Arial, sans-serif;
    padding: 0;
    cursor: pointer;
  }
  #app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100vh;
    display: grid;
    grid-gap: 5px;
    grid-template-rows: 140px 1fr;
    grid-template-columns: 30% 40% 30%;
    color: #4d4d4d;
    border-color: black;
    background: white;
    &.inverted {
      filter: invert(1);
      button#main-btn {
        filter: invert(1);
        &.start {
          border-color: #22ce22;
          background-color: #0c460c;
          color: #22ce22;
        }
        &.idle {
          color: #6d6d6d;
          background-color: #353535;
          border-color: #6d6d6d;
        }
        &.stop {
          border-color: #ce2222;
          background-color: #460c0c;
          color: #ce2222;
        }
      }
    }
    .rounded {
      border-radius: 5px;
    }
    .bordered {
      border: solid 1px black;
    }
  }
</style>
