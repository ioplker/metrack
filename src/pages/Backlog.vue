<template>
  <q-page class="flex flex-center items-stretch window-height q-pa-lg">
    <section class="col q-mr-lg relative-position tile today-wrapper">
      <div class="content">
        <div class="row justify-between items-center q-mb-sm">
          <q-btn flat color="primary" icon="assignment"
            @click="openReportDialog(true)" />
          <h2 class="header">Today <span class="alt-text">(points: {{ todayDoneComplexity }} / {{ todayTotalComplexity }})</span></h2>
          <q-btn flat color="primary" icon="delete_outline"
            @click="clearTodayTasks()" />
        </div>

        <div class="cards-container q-mb-sm">
          <task-card
            v-for="(task, index) of todayTasks"
            :key="'td-tsk_'+index"
            :task="task"
            :onToday="true"
            :canPlan="!isTaskFinished(task)"
            :isFinished="isTaskFinished(task)"
            :isSelected="isTaskSelected(task)"
            @click.native="selectTask(task)"
          >
            <div
              :title="projectsById[task.projectId].name"
              :style="{overflow: 'hidden', 'text-overflow': 'ellipsis', height: '29px'}"
            >{{ projectsById[task.projectId].name }}</div>
          </task-card>
        </div>
        <div class="col-auto">
          <task-panel
            :task="selectedTask"
            :isFinished="isTaskFinished(selectedTask)"
          ></task-panel>
        </div>
      </div>
    </section>

    <section class="col relative-position tile backlog-wrapper">
      <div class="content" :class="{'project-mode': isProjectMode}">
        <div class="row justify-between items-center q-mb-sm">
          <q-btn flat color="primary" icon="assignment"
            @click="openReportDialog(false)" />
          <h2 class="header">Backlog <span class="alt-text">(points: {{ backlogDoneComplexity }} / {{ backlogTotalComplexity }})</span></h2>

          <q-btn v-if="!isProjectMode" flat color="primary" icon="list"
            @click="changeMode()" />
          <q-btn v-if="isProjectMode" flat color="primary" icon="folder_open"
            @click="changeMode()" />
        </div>

        <task-filter v-show="!isProjectMode"
          @filter-changed="filterTasks"
        ></task-filter>

        <div v-show="!isProjectMode"
          class="cards-container"
        >
          <task-card
            v-for="(task, index) of filteredTasks"
            :key="'tsk_'+index"
            :task="task"
            :onToday="isTaskOnToday(task)"
            :canPlan="!isTaskFinished(task)"
            :isFinished="isTaskFinished(task)"
            :isSelected="isTaskSelected(task)"
            @click.native="selectTask(task)"
          >
            <div
              :title="projectsById[task.projectId].name"
              :style="{overflow: 'hidden', 'text-overflow': 'ellipsis', height: '29px'}"
            >{{ projectsById[task.projectId].name }}</div>
          </task-card>
        </div>

        <div v-show="isProjectMode"
          class="cards-container"
        >
          <project-card
            v-for="(project, index) of projects"
            :key="'prj_'+index"
            :project="project"
            :complexity="projectsComplexity[project.id]"
          ></project-card>
        </div>

        <q-btn v-if="!isProjectMode"
          flat color="primary" icon="add" class="full-width absolute-bottom"
          size="md"
          :disable="projects.length === 0"
          @click="addTask()" />

        <q-btn v-if="isProjectMode"
          flat color="primary" icon="add" class="full-width absolute-bottom"
          size="md"
          @click="addProject()" />
      </div>
    </section>

    <q-dialog v-model="copyToClipboardDialog">
      <q-card style="width: 540px; max-width: 80vw;">
        <q-card-section class="row items-center scroll" style="max-height: 50vh">
          <q-input class="report full-width" style="font-family: 'Courier New', Courier, monospace;"
            borderless
            hide-bottom-space
            v-model="report"
            type="textarea"
            :input-style="{ padding: '2px 5px', resize: 'none' }"
            :autogrow="false"
            placeholder="Report to copy"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Copy to clipboard" color="primary"
            v-close-popup
            @click="copyReportToClipboard()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';

import { shortDateFilter } from 'src/filters/DateTimeFilters';

import { Task, TaskInitData, TASK_STATE, FilterFunctions } from 'src/store/classes/Task';
import TaskCard from 'src/components/TaskCard.vue'
import ProjectCard from 'src/components/ProjectCard.vue'
import { Project, ProjectInitData, ProjectComplexity } from 'src/store/classes/Project';
import TaskPanel from 'src/components/TaskPanel.vue';
import TaskFilter from 'src/components/TaskFilter.vue';

@Component({
  filters: {
    shortDateFilter,
  },
  components: { TaskCard, ProjectCard, TaskPanel, TaskFilter },
})
export default class PageBacklog extends Vue {
  store = getModule(TasksStoreModule);
  private isProjectMode: boolean = false;
  private selectedTask: Task | null = null;
  private copyToClipboardDialog: boolean = false;
  private report: string = '';

  private get projects(): Project[] {
    return this.store.projects;
  }

  private get projectsById(): {[k: number]: Project} {
    return this.store.projectsById;
  }

  private get tasks(): Task[] {
    return this.store.tasks;
  }

  private get filteredTasks(): Task[] {
    return this.store.filteredTasks;
  }

  private get todayTasks(): Task[] {
    return this.store.todayTasks;
  }

  private get backlogTotalComplexity(): number {
    return this.store.backlogTotalComplexity;
  }

  private get backlogDoneComplexity(): number {
    return this.store.backlogDoneComplexity;
  }

  private get todayTotalComplexity(): number {
    return this.store.todayTotalComplexity;
  }

  private get todayDoneComplexity(): number {
    return this.store.todayDoneComplexity;
  }

  private get projectsComplexity(): {[k: number]: ProjectComplexity} {
    return this.store.projectsComplexity;
  }

  private isTaskOnToday(task: Task): boolean {
    const foundIndex = this.todayTasks.findIndex(t => t.id === task.id);
    return foundIndex >= 0;
  }

  private isTaskFinished(task: Task): boolean {
    return task ? task.isFinished : false;
  }

  private isTaskSelected(task: Task): boolean {
    return this.selectedTask ? this.selectedTask.id === task.id : false;
  }

  private copyTodayReport(): void {
    console.log('copyTodayReport() called');
  }

  private clearTodayTasks(): void {
    this.tasks.forEach(task => {
      if (this.isTaskOnToday(task)) {
        this.store.moveTaskToBacklog(task);
      }
    });
  }

  private selectTask(task: Task): void {
    this.selectedTask = task;
  }

  private copyBacklogReport(): void {
    console.log('copyBacklogReport() called');
  }

  private changeMode(): void {
    this.isProjectMode = !this.isProjectMode;
  }

  private addTask(): void {
    const taskData: TaskInitData = {
      id: 0,
      projectId: 0,
      name: `Task #${this.store.tasks.length}`,
      complexity: 5,
      description: 'Task description',
      state: TASK_STATE.BACKLOG,
    };
    this.store.addTask(taskData);
  }

  private addProject(): void {
    const projectData: ProjectInitData = {
      id: 0,
      name: `Project #${this.store.projects.length}`,
    };
    this.store.addProject(projectData);
  }

  private filterTasks(filterFunctions: FilterFunctions): void {
    this.store.filterTasks(filterFunctions);
  }

  private openReportDialog(isToday: boolean): void {
    this.generateReport(isToday);
    this.copyToClipboardDialog = true;
  }

  private generateReport(isToday: boolean): void {
    const now = new Date();
    const date = shortDateFilter(now);

    let report = isToday ? `Today report (${date})\n` : `Backlog report (${date})\n`;
    report += isToday ? `Done ${this.todayDoneComplexity} / ${this.todayTotalComplexity}\n`
      : `Done ${this.backlogDoneComplexity} / ${this.backlogTotalComplexity}\n`;
    report += '\n';

    const tasks = isToday ? this.todayTasks : this.filteredTasks;
    const tasksByProjects: {[k: number]: Task[]} = {};
    const projects: Project[] = [];

    tasks.forEach(task => {
      if (tasksByProjects[task.projectId]) {
        tasksByProjects[task.projectId].push(task);
      } else {
        tasksByProjects[task.projectId] = [];
        tasksByProjects[task.projectId].push(task);
        projects.push(this.projectsById[task.projectId]);
      }
    });

    projects.forEach(project => {
      report += `${project.name} (${this.projectsComplexity[project.id].done} / ${this.projectsComplexity[project.id].total})\n`;
      tasksByProjects[project.id].forEach(task => {
        report += task.isFinished ? '  [x] ' : '  [ ] ';
        report += `${task.name} (${task.complexity})\n`;
      });
    });

    this.report = report;
  }

  private copyReportToClipboard(): void {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = this.report;                         // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    // const selected =
    //   document.getSelection().rangeCount > 0        // Check if there is any content selected previously
    //     ? document.getSelection().getRangeAt(0)     // Store selection if found
    //     : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    // if (selected) {                                 // If a selection existed before copying
    //   document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    //   document.getSelection().addRange(selected);   // Restore the original selection
    // }
  };
}
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.today-wrapper {
    .content {
      display: grid;
      grid-template-rows: 45px 2fr 1fr;
      height: 100%;
    }
  }
  &.backlog-wrapper {
    .content {
      display: grid;
      grid-template-rows: 45px 30px 1fr 36px;
      height: 100%;
      &.project-mode {
        grid-template-rows: 45px 1fr 36px;
      }
    }
  }
  .cards-container {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>