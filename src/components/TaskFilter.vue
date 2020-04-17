<template>
  <div class="task-filter row">
    <q-select class="col-3 project"
      borderless
      v-model="filterProject"
      :options="projectOptions"
      :option-label="optionLabel"
      :option-value="optionValue"
      :options-sanitize="true"
      :dense="true"
      :options-dense="true"
      :hide-dropdown-icon="true"
      :clearable="true"
      placeholder="Project"
      label="Project"
      @input="updateFilter"
    />

    <q-input class="col name"
      borderless
      v-model="filterTaskName"
      :debounce="500"
      placeholder="Task name"
      title="Input task name fragment"
      @input="updateFilter"
    />

    <!-- One of the visibility buttons -->
    <q-btn
      v-if="filterVisibility === 'all'"
      flat color="primary" icon="view_headline"
      title="Filtering all"
      size="sm"
      :dense="true"
      @click="setVisibilityFilter('unfinished')" />

    <q-btn
      v-if="filterVisibility === 'unfinished'"
      flat color="primary" icon="visibility"
      title="Filtering unfinished"
      size="sm"
      :dense="true"
      @click="setVisibilityFilter('finished')" />

    <q-btn
      v-if="filterVisibility === 'finished'"
      flat color="primary" icon="visibility_off"
      title="Filtering finished"
      size="sm"
      :dense="true"
      @click="setVisibilityFilter('all')" />

    <!-- One of complexity buttons -->
    <q-btn
      v-if="filterComplexity === 'origin'"
      flat color="primary" icon="watch_later"
      title="Filtering in addition order"
      size="sm"
      :dense="true"
      @click="setComplexityFilter('up')" />

    <q-btn
      v-if="filterComplexity === 'up'"
      flat color="primary" icon="keyboard_arrow_up"
      title="Filtering by complexity from low to high"
      size="sm"
      :dense="true"
      @click="setComplexityFilter('down')" />

    <q-btn
      v-if="filterComplexity === 'down'"
      flat color="primary" icon="keyboard_arrow_down"
      title="Filtering by complexity from high to low"
      size="sm"
      :dense="true"
      @click="setComplexityFilter('origin')" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';

import { Task, FilterFunction, SortFunction, FilterFunctions } from 'src/store/classes/Task'
import { Project } from 'src/store/classes/Project';

enum VISIBILITY_PARAM {
  all = 'all',
  unfinished = 'unfinished',
  finished = 'finished',
}

enum COMPLEXITY_PARAM {
  origin = 'origin',
  up = 'up',
  down = 'down',
}

@Component({})
export default class TaskFilter extends Vue {
  store = getModule(TasksStoreModule);

  private optionLabel: string = 'name';
  private optionValue: string = 'id';

  private filterTaskName: string = '';
  private filterProject: Project | null = null;
  private filterVisibility: VISIBILITY_PARAM = VISIBILITY_PARAM.all;
  private filterComplexity: COMPLEXITY_PARAM = COMPLEXITY_PARAM.origin;

  private get projectOptions(): Project[] {
    return this.store.projects;
  }

  mounted() {
    console.log('filter mounted');
    this.updateFilter();
  }

  private setVisibilityFilter(visibility: VISIBILITY_PARAM): void {
    this.filterVisibility = visibility;
    this.updateFilter();
  }

  private setComplexityFilter(complexity: COMPLEXITY_PARAM): void {
    this.filterComplexity = complexity;
    this.updateFilter();
  }

  private updateFilter(): void {
    const filterProject = this.filterProject ? this.filterProject : null;
    const filterTaskName = this.filterTaskName ? this.filterTaskName : null;
    const filterVisibility = this.filterVisibility;
    const filterComplexity = this.filterComplexity;

    const filterFunctions: FilterFunction[] = [];
    let sortFunction: SortFunction | null = null;

    if (filterProject) {
      filterFunctions.push(
        (task: Task) => task.projectId === filterProject.id
      );
    }

    if (filterTaskName) {
      filterFunctions.push(
        (task: Task) => task.name.includes(filterTaskName)
      );
    }

    if (filterVisibility === VISIBILITY_PARAM.finished) {
      filterFunctions.push(
        (task: Task) => task.isFinished
      );
    } else if (filterVisibility === VISIBILITY_PARAM.unfinished) {
      filterFunctions.push(
        (task: Task) => !task.isFinished
      );
    }

    if (filterComplexity === COMPLEXITY_PARAM.up) {
      sortFunction = (a: Task, b: Task) => a.complexity - b.complexity;
    } else if (filterComplexity === COMPLEXITY_PARAM.down) {
      sortFunction = (a: Task, b: Task) => b.complexity - a.complexity;
    } else {
      sortFunction = (a: Task, b: Task) => a.id - b.id;
    }

    const filterFunction = filterFunctions.length > 0 ?
      (task: Task) => {
        let taskPassed = true;
        filterFunctions.forEach(func => {
          if (!func(task)) taskPassed = false;
        });
        return taskPassed;
      } : null;

    this.setFilter({
      filter: filterFunction,
      sort: sortFunction,
    });
  }

  @Emit('filter-changed')
  private setFilter(filterFunc: FilterFunctions): FilterFunctions {
    return filterFunc; // Don't need to return anything, just got rid of lint warning
  }
}
</script>

<style lang="scss" scoped>
.task-filter {
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
}
</style>