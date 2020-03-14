<template>
  <div class="container rounded bordered">
    <div class="filter">
      <select
        class="project-name"
        placeholder="Проект"
        @input="filterByProject"
        >
        <option
          :value="null"
          >Все проекты</option>
        <option
          v-for="(project, index) of projects"
          :key=index
          :value="project.id"
          >{{ project.name }}</option>
      </select>

      <input
        type="text"
        class="task-name"
        placeholder="Название задачи"
        @input="filterByTaskName"
        />

      <button
        class="hidden-btn"
        @click="toggleShowVisible()"
        :class="{hidden: !showVisible}"
        >
        <img src="../assets/icon__eye.svg" alt="Показать скрытые" />
      </button>
    </div>

    <div class="tasks">
      <template
        v-for="(task, index) of filteredTasks"
        >
        <div
          v-if="task.visible === showVisible"
          :key="index"
          class="task-row"
          @click="selectTask(task.id)"
          @dblclick="setCurrentTask(task.id)"
          :class="{
            selected: selectedTaskId === task.id,
            current: currentTaskId === task.id}"
          >
          <div class="project">{{ getTaskProject(task).name }}</div>
          <div class="name">{{ task.name }}</div>
          <button
            v-if="showVisible"
            class="delete-btn"
            @click.stop="toggleTaskVisible(task.id)"
            >
            <img
              src="../assets/icon__cross.svg"
              alt="Скрыть"
              />
          </button>
          <button
            v-if="!showVisible"
            class="show-btn"
            @click.stop="toggleTaskVisible(task.id)"
            >
            <img
              src="../assets/icon__plus.svg"
              alt="Показать"
              />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'tasks',
      'projects',
      'selectedTaskId',
      'currentTaskId',
    ],
    computed: {
      filteredTasks() {
        let result = this.tasks;
        if (this.tasksFilter.projectId) {
          const filterProjectId = this.tasksFilter.projectId;
          result = result.filter(task => task.project === filterProjectId);
        }

        if (this.tasksFilter.taskName) {
          const filterTaskName = this.tasksFilter.taskName;
          result = result.filter(task => task.name.includes(filterTaskName));
        }

        return result;
      },
    },
    data() {
      return {
        tasksFilter: {
          projectId: null,
          taskName: '',
        },
        showVisible: true,
      };
    },
    methods: {
      getTaskProject(task) {
        const projectId = task.project;
        return this.projects.find(project => project.id === projectId);
      },
      toggleTaskVisible(taskId) {
        this.$emit('onTaskToggleVisible', taskId);
      },
      selectTask(taskId) {
        this.$emit('onTaskSelect', taskId);
      },
      setCurrentTask(taskId) {
        this.$emit('onTaskSetCurrent', taskId);
      },
      filterByProject(event) {
        console.log(event);
        const projectId = event.target.value;
        this.tasksFilter.projectId = projectId;
      },
      filterByTaskName(event) {
        const text = event.target.value;
        this.tasksFilter.taskName = text;
      },
      toggleShowVisible() {
        this.showVisible = !this.showVisible;
      },
    }
  };
</script>

<style scoped lang="scss">
  .container {
    margin-bottom: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .filter {
      font-size: 18px;
      line-height: 39px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      border-bottom: solid 1px black;
      flex-shrink: 0;
      input, select {
        border: none;
      }
      .project-name {
        width: 121px;
        height: 100%;
        padding-left: 10px;
        border-right: solid 1px black;
        background: transparent;
      }
      .task-name {
        height: 100%;
        padding: 0 10px;
        flex-grow: 1;
      }
      .hidden-btn {
        background: none;
        border: none;
        height: 100%;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        img {
          width: 26px;
        }
        &.hidden img {
          opacity: 0.3;
        }
      }
    }
    .tasks {
      overflow: auto;
      .task-row {
        color: #4d4d4d;
        font-size: 18px;
        line-height: 39px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        cursor: pointer;
        border-bottom: solid 1px black;
        &:hover {
          background-color: #e8e8e8;
          border-color: #9b9b9b;
        }
        &.selected {
          background-color: #dae8fc;
          border-color: #6c8ebf;
        }
        &.current {
          background-color: #cfc5ff;
          border-color: #966cbf;
        }
        .project {
          width: 100px;
          height: 100%;
          padding: 0 10px;
          border-right: solid 1px black;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          flex-shrink: 0;
          user-select: none;
          white-space: nowrap;
        }
        .name {
          height: 100%;
          padding: 0 10px;
          flex-grow: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          user-select: none;
        }
        .delete-btn, .show-btn {
          background: none;
          border: none;
          border-left: solid 1px black;
          height: 100%;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .delete-btn {
          &:hover {
            background-color: #F8CECC;
          }
        }
        .show-btn {
          &:hover {
            background-color: #D5E8D4;
          }
        }
      }
    }
  }
</style>