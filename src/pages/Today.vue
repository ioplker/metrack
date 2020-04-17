<template>
  <q-page class="flex flex-center column q-pa-lg">
    <section class="row-2">
      <q-btn class="task-btn q-mr-lg"
        flat
        :class="isStarted ? 'negative' : 'positive'"
        :label="isStarted ? 'Stop' : 'Start'"
        @click="toggleTaskPaused()" />

      <div class="task-info">
        <template v-if="activeTask">
          <div class="row">
            <div class="col-auto">{{ activeTask.name }}</div>
            <div class="col">
              <div>{{ activeTaskStartDate | shortDateFilter }}</div>
              <q-btn
                :class="{active: activeTask.isFinished}"
                flat color="primary" icon="check"
                size="sm"
                @click="toggleTaskFinished()" />
            </div>
          </div>

          <div class="row">
            <div class="col-auto">
              <div class="project">{{ activeTaskProject }}</div>
              <div class="complexity">{{ activeTask.complexity }}</div>
            </div>
            <div class="col task-timings"></div>
          </div>
        </template>
      </div>
    </section>
    <section class="row-10">
      <div class="task-info q-mr-lg"></div>

      <div class="tasks-list"></div>
    </section>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';
import { Task } from 'src/store/classes/Task';
import { Project } from 'src/store/classes/Project';

import { shortDateFilter } from 'src/filters/DateTimeFilters';

@Component({
  filters: {
    shortDateFilter,
  },
})
export default class PageToday extends Vue {
  store = getModule(TasksStoreModule);
  private activeTask!: Task;
  private selectedTask!: Task;

  private get isStarted(): boolean {
    return this.activeTask ? this.activeTask.isFinished : false;
  }

  private get activeTaskStartDate(): Date | null {
    let date: Date | null = null;
    if (this.activeTask && this.store.periodsByTask[this.activeTask.id].length > 0) {
      date = this.store.periodsByTask[this.activeTask.id][0].dateStarted;
    }
    return date;
  }

  private get activeTaskProject(): Project | null {
    if (!this.activeTask) return null;
    return this.store.projectsById[this.activeTask.projectId];
  }

  private toggleTaskPaused(): void {
    if (this.activeTask) {
      if (this.isStarted) {
        this.store.pauseTask(this.activeTask);
      } else {
        this.store.startTask(this.activeTask);
      }
    }
  }

  private toggleTaskFinished(): void {
    if (this.activeTask) {
      this.activeTask.isFinished ? this.store.unfinishTask(this.activeTask) : this.store.finishTask(this.activeTask);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>