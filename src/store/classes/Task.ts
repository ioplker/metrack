import Vue from 'vue';

export enum TASK_STATE {
  BACKLOG = 1,
  WAITING = 2,
  WORKING = 3,
  FINISHED = 4,
}

export enum TASK_COMPLEXITY {
  EASY_1 = 1,
  EASY_2 = 2,
  MEDIUM_3 = 3,
  MEDIUM_5 = 5,
  HARD_8 = 8,
  HARD_13 = 13,
  INSANE_21 = 21,
  INSANE_34 = 34,
}

export interface TaskInitData {
  id: number;
  projectId: number;
  name: string;
  complexity: TASK_COMPLEXITY;
  description: string;
  state: TASK_STATE;
}

export interface TaskUpdateData {
  projectId?: number;
  name?: string;
  complexity?: TASK_COMPLEXITY;
  description?: string;
  state?: TASK_STATE;
}

export interface FilterFunction { (task: Task): boolean }

export interface SortFunction { (a: Task, b: Task): number }

export interface FilterFunctions {
  filter: FilterFunction | null,
  sort: SortFunction | null,
}

export class Task extends Vue {
  private _id: number;
  private _projectId: number;
  private _name: string;
  private _complexity: TASK_COMPLEXITY;
  private _description: string;
  private _state: TASK_STATE;

  public constructor(data: TaskInitData) {
    super();

    this._id = data.id;
    this._projectId = data.projectId;
    this._name = data.name;
    this._complexity = data.complexity;
    this._description = data.description;
    this._state = data.state;

    // Reactivity part
    Vue.set(this, '_projectId', data.projectId);
    Vue.set(this, '_name', data.name);
    Vue.set(this, '_complexity', data.complexity);
    Vue.set(this, '_description', data.description);
    Vue.set(this, '_state', data.state);
  }

  public get id(): number {
    return this._id;
  }

  public get projectId(): number {
    return this._projectId;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get state(): TASK_STATE {
    return this._state;
  }

  public get complexity(): TASK_COMPLEXITY {
    return this._complexity;
  }

  public get isFinished(): boolean {
    return this._state === TASK_STATE.FINISHED;
  }

  public update(data: TaskUpdateData): void {
    if (data.projectId || data.projectId === 0) Vue.set(this, '_projectId', data.projectId);
    if (data.name) Vue.set(this, '_name', data.name);
    if (data.complexity) Vue.set(this, '_complexity', data.complexity);
    if (data.description || data.description === '') Vue.set(this, '_description', data.description);
    if (data.state) Vue.set(this, '_state', data.state);
  }
}