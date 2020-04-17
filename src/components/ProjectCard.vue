<template>
  <div class="project-card row items-center">
    <input type="text"
      v-model="projectName"
      class="project col full-height q-pl-sm"
      @input="changeProjectName"
    >
    <div v-if="complexity"
      class="complexity col-auto"
    >{{ complexity.done }} / {{ complexity.total }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators';
import TasksStoreModule from 'src/store/TasksStoreModule';

import { Project, ProjectComplexity } from 'src/store/classes/Project';

@Component({
  filters: {
    truncate(value: string, count: number) {
      return value.length > count ? value.slice(0, count) + '..' : value;
    },
  },
})
export default class ProjectCard extends Vue {
  @Prop({ required: true })
  private project!: Project;

  @Prop({ required: true })
  private complexity!: ProjectComplexity;

  store = getModule(TasksStoreModule);
  private projectName: string = this.project.name;

  private changeProjectName(): void {
    const payload = {
      project: this.project,
      data: { name: this.projectName },
    }
    this.store.updateProject(payload);
  }
}
</script>

<style lang="scss" scoped>
.project-card {
  position: relative;
  border-top: 1px solid #000000;
  color: #000000;
  width: 100%;
  height: 30px;
  font-size: 16px;
  padding-right: 5px;
  &:last-of-type {
    border-bottom: 1px solid #000000;
  }
  input {
    border: none;
  }
  .complexity {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
    padding: 0 5px;
  }
}
</style>