<template>
  <div class="task-card row items-stretch"
    :class="cardClasses"
  >
    <div class="project col-3">
      <slot></slot>
    </div>
    <div class="name col"
      :title="task.name"
    >{{ task.name }}</div>

    <q-btn v-if="canPlan"
      :class="{active: onToday}"
      flat color="primary" icon="today"
      size="sm"
      @click="toggleOnToday()" />

    <div class="complexity">{{ task.complexity }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';

import { Task } from 'src/store/classes/Task'

@Component({})
export default class TaskCard extends Vue {
  @Prop()
  private isSelected!: boolean;

  @Prop()
  private isFinished!: boolean;

  @Prop()
  private canPlan!: boolean;

  @Prop({ required: true })
  private task!: Task;

  @Prop({ required: true })
  private onToday!: boolean;

  store = getModule(TasksStoreModule);

  private get cardClasses(): {[k: string]: boolean} {
    return {
      'active': this.isSelected,
      'finished': this.isFinished,
    };
  }

  private toggleOnToday(): void {
    if (this.onToday) {
      this.store.moveTaskToBacklog(this.task);
    } else {
      this.store.moveTaskToToday(this.task);
    }
  }
}
</script>

<style lang="scss" scoped>
.task-card {
  border-top: 1px solid #000000;
  color: #000000;
  width: 100%;
  height: 30px;
  font-size: 16px;
  line-height: 29px;
  cursor: pointer;
  &:last-of-type {
    border-bottom: 1px solid #000000;
  }
  &.active {
    background: rgba($color: $primary, $alpha: 0.2);
  }
  &.finished {
    background: rgba($color: #000000, $alpha: 0.1);
    color: rgba($color: #000000, $alpha: 0.4);
  }
  &.active.finished {
    background: rgba($color: $primary, $alpha: 0.2);
    color: rgba($color: #000000, $alpha: 0.4);
  }
  .project {
    padding: 0 5px;
    text-align: center;
    border-right: 1px solid #000000;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    padding: 0 5px;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 29px;
  }
  .complexity {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
    padding: 0 5px;
    width: 30px;
  }
  button:not(.active) {
    opacity: 0.3;
  }
}
</style>