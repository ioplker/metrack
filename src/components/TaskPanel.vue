<template>
  <div class="container">
    <input
      class="name-input rounded bordered"
      maxlength="80"
      type="text" placeholder="Новая задача"
      v-model="taskName"/>

    <div
      class="project-input rounded bordered"
      :class="{'show-select': selectShown}"
      title="Ctrl+Enter для переключения режима"
      >
      <input
        type="text" placeholder="Проект"
        maxlength="20"
        v-model="projectName"
        @keyup.ctrl.enter="toggleSelect()"
        ref="projectNameInput"
        />
      <select
        v-model="projectName"
        @keyup.ctrl.enter="toggleSelect()"
        ref="projectNameSelect"
        >
        <option
          v-for="(project, index) of projects"
          :key=index
          :value="project.name"
          >{{ project.name }}</option>
      </select>
    </div>

    <button class="add-btn rounded"
      @click="addTask()"
      title="Добавить задачу"
      >
      <img src="../assets/icon__plus.svg" alt="Добавить задачу" />
    </button>

    <div class="panel rounded bordered">
      <div v-if="selectedTask" class="info">
        <div class="task-name">{{ selectedTask.name }}</div>
        <div class="line"></div>
        <div class="subtitle">
          <div class="project-name">{{ selectedTaskProject.name }}</div>
          <div class="task-date">{{ selectedTask.createdDate | shortDate }}</div>
        </div>
      </div>
      <textarea
        v-if="selectedTask"
        class="task-text"
        placeholder="Ура-а-а!! Новая ЗА-ДА-ЧА!!!11"
        v-model="selectedTask.text"
        ></textarea>
      <div v-if="selectedTask" class="time-periods">
        <div
          v-for="(period, index) of reversedTaskPeriods"
          :key="index"
          class="time-row"
          >
          <div class="time-part">
            <div class="time">{{ period.start | fullDate }}</div>
            <div>&nbsp;-&nbsp;</div>
            <div class="time">{{ period.end | fullDate }}</div>
          </div>
          <div class="duration">{{ period.duration | hoursAndMinutes}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'selectedTask',
    'selectedTaskProject',
    'selectedTaskPeriods',
    'projects',
  ],
  data() {
    return {
      taskName: '',
      taskText: '',
      projectName: '',
      selectShown: false,
    };
  },
  computed: {
    reversedTaskPeriods() {
      return this.selectedTaskPeriods.slice().reverse()
    },
  },
  methods: {
    addTask() {
      if (this.taskName && this.projectName) {
        this.$emit('onTaskAdded', {
          name: this.taskName,
          project: this.projectName,
          text: this.taskText
        });
        this.taskName = '';
        this.projectName = '';
        this.taskText = '';
      } else {
        alert('Укажите проект и название задачи!');
      }
    },
    toggleSelect() {
      this.selectShown = !this.selectShown;
      if (this.selectShown) {
        this.$nextTick(function(){
          this.$refs.projectNameSelect.focus();
        });
      } else {
        this.$nextTick(function(){
          this.$refs.projectNameInput.focus();
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .container {
    display: grid;
    grid-gap: 5px;
    grid-template-rows: 30px 1fr;
    grid-template-columns: 1fr 100px 60px;
    padding-left: 5px;
    padding-bottom: 5px;
    input {
      padding-left: 10px;
    }
    .name-input {
      grid-row: 1;
      grid-column: 1;
    }
    .project-input {
      position: relative;
      grid-row: 1;
      grid-column: 2;
      padding-left: 10px;
      &.show-select {
        input {
          display: none;
        }
        select {
          display: block;
        }
      }
      input {
        width: 100%;
        border: none;
        padding: 0;
      }
      select {
        display: none;
        background: none;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
      }
    }
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-row: 1;
      grid-column: 3;
      background-color: #dae8fc;
      border: solid 2px #6c8ebf;
    }
    .panel {
      grid-row: 2;
      grid-column: 1 / span 3;
      color: #4D4D4D;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .info {
        padding: 5px;
        border-bottom: solid 1px black;
        .task-name {
          font-size: 18px;
        }
        .line {
          height: 1px;
          width: 70px;
          background: black;
          margin: 5px 0;
        }
        .subtitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .project-name {
            font-size: 14px;
          }
          .task-date {
            font-size: 14px;
          }
        }
      }
      .task-text {
        font-size: 14px;
        padding: 5px;
        resize: none;
        margin: 0;
        border: none;
        flex-grow: 1;
      }
      .time-periods {
        height: 20%;
        overflow-y: auto;
        border-top: solid 1px black;
        .time-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 1;
          padding: 0 5px;
          margin-bottom: 2px;
          .time-part {
            display: flex;
            align-items: center;
            .time {
              font-size: 14px;
            }
          }
          .duration {
            font-size: 12px;
            font-style: italic;
            text-align: right;
          }
        }
      }
    }
  }
</style>