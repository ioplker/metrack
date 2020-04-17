import Vue from 'vue'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Store from 'src/store/index';

import { Task, TaskInitData, TaskUpdateData, TASK_STATE, FilterFunctions } from 'src/store/classes/Task';
import { Project, ProjectInitData, ProjectUpdateData, ProjectComplexity } from 'src/store/classes/Project';
import { Period, PeriodInitData, PeriodUpdateData } from 'src/store/classes/Period';

@Module({
  dynamic: true,
  name: 'TasksStore',
  namespaced: true,
  store: Store
})
export default class TasksStoreModule extends VuexModule {
  public tasks: Task[] = [];
  public projects: Project[] = [];
  public periods: Period[] = [];

  public todayTasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public tasksFilter!: FilterFunctions;

  public projectsComplexity: {[k: number]: ProjectComplexity} = {};
  public projectsById: {[k: number]: Project} = {};

  public periodsByTask: {[k: number]: Period[]} = {};

  public backlogTotalComplexity: number = 0;
  public backlogDoneComplexity: number = 0;
  public todayTotalComplexity: number = 0;
  public todayDoneComplexity: number = 0;


  /* Mutations */
  // Tasks
  @Mutation
  private ADD_TASK(data: TaskInitData): void {
    data.id = this.tasks.length;
    this.tasks.push(new Task(data));

    this.periodsByTask[data.id] = [];
  }

  @Mutation
  private UPDATE_TASK(payload: {task: Task, data: TaskUpdateData}): void {
    // NOTE: Updates are comming only for one parameter at a time!
    const { task, data } = payload;

    // Reassign task periods projectId if it has been changed
    if (data.projectId !== task.projectId) {
      const taskPeriods = this.periodsByTask[task.id];
      taskPeriods.forEach(period => {
        period.update({projectId: data.projectId});
      });
    }

    task.update(data);

    // Reactivity part
    const index = this.tasks.findIndex(t => t.id === task.id);
    Vue.set(this.tasks, index, task);
  }

  @Mutation
  private UPDATE_COMPLEXITY_COUNTERS(): void {
    // Backlog counters (based on filtered tasks)
    const backlogTotal = this.filteredTasks
      .reduce((acc, {complexity}) => acc + complexity, 0)
    const backlogDone = this.filteredTasks
      .reduce((acc, {complexity, state}) => state === TASK_STATE.FINISHED ? acc + complexity : acc, 0)
    this.backlogTotalComplexity = backlogTotal;
    this.backlogDoneComplexity = backlogDone;

    // Today counters
    const todayTasks = this.tasks
      .filter(task => {
        const [ lastPeriod ] = this.periodsByTask[task.id].slice(-1);

        return task.state === TASK_STATE.WAITING
        || task.state === TASK_STATE.WORKING
        || (task.state === TASK_STATE.FINISHED && lastPeriod && lastPeriod.isFinishedToday)
      });
    const todayTotal = todayTasks
      .reduce((acc, {complexity}) => acc + complexity, 0);
    const todayDone = todayTasks
      .reduce((acc, {complexity, state}) => state === TASK_STATE.FINISHED ? acc + complexity : acc, 0);
    this.todayTotalComplexity = todayTotal;
    this.todayDoneComplexity = todayDone;

    // Projects counters
    const projectsComplexity: {[k: number]: ProjectComplexity} = {};
    this.projects.forEach(project => {
      projectsComplexity[project.id] = {total: 0, done: 0};
    });
    this.tasks.forEach(task => {
      if (task.state === TASK_STATE.FINISHED) {
        projectsComplexity[task.projectId].done += task.complexity;
      }
      projectsComplexity[task.projectId].total += task.complexity;
    });
    this.projectsComplexity = projectsComplexity;
  }

  @Mutation
  private UPDATE_TODAY_TASKS(): void {
    const todayTasks: Task[] = [];
    this.tasks.forEach(task => {
      if (task.state === TASK_STATE.WAITING || task.state === TASK_STATE.WORKING) {
        todayTasks.push(task);
      } else if (task.state === TASK_STATE.FINISHED) {
        const [ lastPeriod ] = this.periodsByTask[task.id].slice(-1);
        if (lastPeriod && lastPeriod.isFinishedToday) todayTasks.push(task);
      }
    });
    this.todayTasks = todayTasks;
  }

  @Mutation
  private SET_TASKS_FILTER(filterFunctions: FilterFunctions): void {
    this.tasksFilter = filterFunctions;
  }

  @Mutation
  private FILTER_TASKS(): void {
    const filterFunction = this.tasksFilter.filter;
    const sortFunction = this.tasksFilter.sort;

    let filteredTasks = this.tasks
    if (filterFunction) {
      filteredTasks = filteredTasks.filter(filterFunction);
    }
    if (sortFunction) {
      filteredTasks.sort(sortFunction);
    }

    Vue.set(this, 'filteredTasks', []);
    if (filteredTasks) {
      filteredTasks.forEach(task => {
        this.filteredTasks.push(task);
      });
    }
  }

  // Projects
  @Mutation
  private ADD_PROJECT(data: ProjectInitData): void {
    data.id = this.projects.length;
    const project = new Project(data);
    this.projects.push(project);
    Vue.set(this.projectsById, data.id, project);
  }

  @Mutation
  private UPDATE_PROJECT(payload: {project: Project, data: ProjectUpdateData}): void {
    const { project, data } = payload;
    project.update(data);

    // Reactivity part
    const index = this.projects.findIndex(p => p.id === project.id);
    Vue.set(this.projects, index, project);
    Vue.set(this.projectsById, project.id, project);
  }

  // Periods
  @Mutation
  private ADD_PERIOD(data: PeriodInitData): void {
    data.id = this.periods.length;
    const period = new Period(data);

    this.periods.push(period);
    this.periodsByTask[data.taskId].push(period);
  }

  @Mutation
  private UPDATE_PERIOD(payload: {period: Period, data: PeriodUpdateData}): void {
    const { period, data } = payload;
    period.update(data);

    // Reactivity part
    const index = this.periods.findIndex(p => p.id === period.id);
    Vue.set(this.periods, index, period);
  }

  @Mutation
  private FINISH_PERIOD(period: Period): void {
    period.finish();

    // Reactivity part
    const index = this.periods.findIndex(p => p.id === period.id);
    Vue.set(this.periods, index, period);
  }

  @Mutation
  private REMOVE_PERIOD(periodId: number): void {
    const periodsIndex = this.periods.findIndex((period) => period.id === periodId);
    if (periodsIndex > -1) {
      const period = this.periods[periodsIndex];
      const byTasksIndex = this.periodsByTask[period.taskId].findIndex((period) => period.id === periodId);

      this.periods.splice(periodsIndex, 1);
      this.periodsByTask[period.taskId].splice(byTasksIndex, 1);
    }
  }


  /* Actions */
  // Tasks
  @Action
  public addTask(data: TaskInitData): void {
    this.ADD_TASK(data);
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public updateTask(payload: {task: Task, data: TaskUpdateData}): void {
    this.UPDATE_TASK(payload);
    this.UPDATE_TODAY_TASKS();
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public moveTaskToToday(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.WAITING },
    }
    this.UPDATE_TASK(payload);
    this.UPDATE_TODAY_TASKS();
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public moveTaskToBacklog(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.BACKLOG },
    }
    this.UPDATE_TASK(payload);
    this.UPDATE_TODAY_TASKS();
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public startTask(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.WORKING },
    }
    this.UPDATE_TASK(payload);

    // Handle periods
    this.ADD_PERIOD({
      id: this.periods.length,
      taskId: task.id,
      projectId: task.projectId,
    })

    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public pauseTask(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.WAITING },
    }
    this.UPDATE_TASK(payload);

    // Handle periods
    const [ lastPeriod ] = this.periodsByTask[task.id].slice(-1);
    if (lastPeriod) this.FINISH_PERIOD(lastPeriod);

    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public finishTask(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.FINISHED },
    }
    this.UPDATE_TASK(payload);

    // Handle periods
    const [ lastPeriod ] = this.periodsByTask[task.id].slice(-1);
    if (lastPeriod) this.FINISH_PERIOD(lastPeriod);

    this.UPDATE_TODAY_TASKS();
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public unfinishTask(task: Task): void {
    const payload = {
      task,
      data: { state: TASK_STATE.BACKLOG },
    }
    this.UPDATE_TASK(payload);
    this.UPDATE_TODAY_TASKS();
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public filterTasks(filterFunctions: FilterFunctions): void {
    this.SET_TASKS_FILTER(filterFunctions);
    this.FILTER_TASKS();
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  // Projects
  @Action
  public addProject(data: ProjectInitData): void {
    this.ADD_PROJECT(data);
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public updateProject(payload: {project: Project, data: ProjectUpdateData}): void {
    this.UPDATE_PROJECT(payload);
  }

  // Periods
  @Action
  public addPeriod(data: PeriodInitData): void {
    this.ADD_PERIOD(data);
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public updatePeriod(payload: {period: Period, data: PeriodUpdateData}): void {
    this.UPDATE_PERIOD(payload);
    this.UPDATE_COMPLEXITY_COUNTERS();
  }

  @Action
  public removePeriod(periodId: number): void {
    this.REMOVE_PERIOD(periodId);
    this.UPDATE_COMPLEXITY_COUNTERS();
  }
}