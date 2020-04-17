import Vue from 'vue';

export interface ProjectInitData {
  id: number;
  name: string;
}

export interface ProjectUpdateData {
  name?: string;
}

export interface ProjectComplexity {
  total: number;
  done: number;
}

export class Project extends Vue {
  private _id: number;
  private _name: string;

  public constructor(data: ProjectInitData) {
    super();

    this._id = data.id;
    this._name = data.name;

    // Reactivity part
    Vue.set(this, '_name', data.name);
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public update(data: ProjectUpdateData): void {
    if (data.name) Vue.set(this, '_name', data.name);
  }
}