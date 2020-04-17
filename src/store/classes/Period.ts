import Vue from 'vue';

export interface PeriodInitData {
  id: number;
  taskId: number;
  projectId: number;
}

export interface PeriodUpdateData {
  projectId?: number;
  dateStarted?: Date;
  dateFinished?: Date;
}

export class Period extends Vue {
  private _id: number;
  private _taskId: number;
  private _projectId: number;
  private _dateStarted: Date;
  private _dateFinished?: Date;

  public constructor(data: PeriodInitData) {
    super();

    this._id = data.id;
    this._taskId = data.taskId;
    this._projectId = data.projectId;
    this._dateStarted = new Date();
  }

  public get id(): number {
    return this._id;
  }

  public get taskId(): number {
    return this._taskId;
  }

  public get projectId(): number {
    return this._projectId;
  }

  public get dateStarted(): Date {
    return this._dateStarted;
  }

  public get dateFinished(): Date | null {
    return this._dateFinished || null;
  }

  public get duration(): number | null {
    return this._dateStarted && this._dateFinished ?
      this._dateFinished.valueOf() - this._dateStarted.valueOf()
      : null;
  }

  public get isFinishedToday(): boolean {
    const today = new Date();
    return this.isFinishedOnDate(today);
  }

  public update(data: PeriodUpdateData): void {
    if (data.projectId || data.projectId === 0) this._projectId = data.projectId;
    if (data.dateStarted) this._dateStarted = new Date(data.dateStarted);
    if (data.dateFinished) this._dateFinished = new Date(data.dateFinished);
  }

  public finish(): void {
    if (!this._dateFinished) this._dateFinished = new Date();
  }

  public isFinishedOnDate(date: Date): boolean {
    if (this._dateFinished) {
      return this._dateFinished.getFullYear() === date.getFullYear()
        && this._dateFinished.getMonth() === date.getMonth()
        && this._dateFinished.getDate() === date.getDate()
    }
    return false;
  }
}