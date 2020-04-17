<template>
  <div class="task-panel col">
    <div class="row top-wrapper">
      <q-select class="col-3 project"
        borderless
        v-model="taskProject"
        :options="projectOptions"
        :option-label="optionLabel"
        :option-value="optionValue"
        :options-sanitize="true"
        :dense="true"
        :options-dense="true"
        :hide-dropdown-icon="true"
        label="Project"
        @input="updateTask"
      />

      <q-input class="col name"
        borderless
        v-model="taskName"
        :debounce="500"
        placeholder="Task name"
        @input="updateTask"
      />

      <q-btn
        :class="{active: !isFinished}"
        flat color="primary" icon="check"
        size="sm"
        @click="toggleIsFinished()" />
    </div>

    <complexity-bar class="complexity"
      v-model="taskComplexity"
      @input="updateTask"
    ></complexity-bar>

    <q-input class="description"
      borderless
      hide-bottom-space
      v-model="taskDescription"
      type="textarea"
      :debounce="500"
      :input-style="{ padding: '2px 5px', resize: 'none' }"
      :autogrow="false"
      placeholder="Task description"
      @input="updateTask"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';

import { Task, TASK_COMPLEXITY } from 'src/store/classes/Task'
import { Project } from 'src/store/classes/Project';
import ComplexityBar from 'src/components/ComplexityBar.vue'

@Component({
  components: { ComplexityBar },
})
export default class TaskPanel extends Vue {
  @Prop()
  private task!: Task;

  @Prop()
  private isFinished!: boolean;

  store = getModule(TasksStoreModule);

  private optionLabel: string = 'name';
  private optionValue: string = 'id';

  private taskName: string = '';
  private taskProject: Project | null = null;
  private taskDescription: string = '';
  private taskComplexity: number = TASK_COMPLEXITY.EASY_1;

  private get projectOptions(): Project[] {
    return this.store.projects;
  }

  @Watch('task')
  taskChanged(task: Task | null) {
    this.taskName = task ? task.name : '';
    this.taskProject = task ? this.store.projectsById[task.projectId] : null;
    this.taskDescription = task ? task.description : '';
    this.taskComplexity = task ? task.complexity : TASK_COMPLEXITY.EASY_1;
  }

  private updateTask(): void {
    if (this.taskProject) {
      const payload = {
        task: this.task,
        data: {
          name: this.taskName,
          projectId: this.taskProject.id,
          description: this.taskDescription,
          complexity: this.taskComplexity,
        },
      };
      this.store.updateTask(payload);
    }
  }

  private toggleIsFinished(): void {
    if (this.task) {
      this.isFinished ? this.store.unfinishTask(this.task) : this.store.finishTask(this.task);
    }
  }
}
</script>

<style lang="scss" scoped>
.task-panel {
  .top-wrapper {
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    color: #000000;
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 29px;
    .project {
      height: 100%;
      padding: 0 5px;
      text-align: center;
      border-right: 1px solid #000000;
      overflow: hidden;
      white-space: nowrap;
    }
    .name {
      height: 100%;
      padding: 0 5px;
      flex-grow: 1;
    }
    button:not(.active) {
      opacity: 0.3;
    }
  }
  .complexity {
    border-bottom: 1px solid #000000;
    margin-top: 5px;
  }
}
</style>