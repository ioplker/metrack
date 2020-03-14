<template>
  <div class="container rounded bordered">
    <div class="top-row">
      <button
        @click="displayTasks"
        :class="{active: displayMode === 'tasks'}"
        >Задачи</button>
      <button
        @click="displayProjects"
        :class="{active: displayMode === 'projects'}"
        >Проекты</button>
    </div>

    <div
      class="item-switch switch"
      @scroll="selectItemByScroll($event, displayMode)"
      >
      <button
        class="back-btn"
        :class="{active: hasBackItem}"
        @click="selectPrevItem(displayMode)"
        >
        <img src="../assets/icon__chevron-up.svg" alt="Назад">
      </button>

      <div
        v-if="displayMode === 'tasks' && selectedTask"
        class="wrapper"
        >
        <div
          class="item"
          :title="selectedTask.name"
          >{{ selectedTask.name }}</div>
        <div class="subitem">{{ selectedTask.duration | hoursAndMinutes }}</div>
        <div class="subitem">{{ timedProjects[selectedTask.project].name }}</div>
      </div>

      <div
        v-if="displayMode === 'projects'"
        class="wrapper"
        >
        <div
          class="item"
          :title="selectedProject.name"
          >{{ selectedProject.name }}</div>
        <div class="subitem">{{ selectedProject.duration | hoursAndMinutes }}</div>
      </div>

      <button
        class="next-btn"
        :class="{active: hasNextItem}"
        @click="selectNextItem(displayMode)"
        >
        <img src="../assets/icon__chevron-up.svg" alt="Вперёд">
      </button>
    </div>

    <div
      v-if="displayMode === 'tasks'"
      class="diagram"
      >
      <app-donut-chart
        v-if="sortedTasks[selectedDate] && sortedTasks[selectedDate].length > 0"
        :initial-values="taskDurationsInMinutes[selectedDate]"
        :currentIndex="selectedTaskIndex"
        ></app-donut-chart>
      <div class="time">{{ taskDurationsSum[selectedDate] | shortHoursAndMinutes }}</div>
    </div>

    <div
      v-if="displayMode === 'projects'"
      class="diagram"
      >
      <app-donut-chart
        v-if="sortedProjects && sortedProjects.length > 0"
        :initial-values="projectDurationsInMinutes"
        :currentIndex="selectedProjectIndex"
        ></app-donut-chart>
      <div class="time">{{ projectDurationsSum | shortHoursAndMinutes }}</div>
    </div>

    <div
      v-if="displayMode === 'tasks' && sortedDates.length > 0"
      class="time-switch switch"
      @scroll="selectItemByScroll($event, 'dates')"
      >
      <button
        class="back-btn"
        :class="{active: hasBackDate}"
        @click="selectPrevItem('dates')"
        >
        <img src="../assets/icon__chevron-up.svg" alt="Назад">
      </button>
      <div class="wrapper">
        <div class="item">{{ Number(selectedDate) | shortDate }}</div>
      </div>
      <button
        class="next-btn"
        :class="{active: hasNextDate}"
        @click="selectNextItem('dates')"
        >
        <img src="../assets/icon__chevron-up.svg" alt="Вперёд">
      </button>
    </div>
  </div>
</template>

<script>
  import DonutChart from "./DonutChart";

  export default {
    components: {
      appDonutChart: DonutChart,
    },
    props: [
      'timedTasks',
      'timedProjects',
    ],
    computed: {
      sortedDates() {
        const sortedTimestamps = [];
        Array.from(Object.keys(this.timedTasks)).forEach(key => {
          sortedTimestamps.push(key);
        });
        sortedTimestamps.sort();

        return sortedTimestamps;
      },
      sortedTasks() {
        const timedTasks = this.timedTasks;
        const sortedTasks = {};
        Array.from(Object.keys(timedTasks)).forEach(day => {
          const dayTasks = timedTasks[day];
          sortedTasks[day] = [];
          Array.from(Object.keys(dayTasks)).forEach(taskId => {
            sortedTasks[day].push({
              name: dayTasks[taskId].name,
              project: dayTasks[taskId].project,
              duration: dayTasks[taskId].duration,
            });
          });

          sortedTasks[day].sort((t_1, t_2) => t_1.duration < t_2.duration);
        });

        return sortedTasks;
      },
      taskDurationsInMinutes() {
        const durations = {};
        Array.from(Object.keys(this.sortedTasks)).forEach(day => {
          durations[day] = [];
          this.sortedTasks[day].forEach(task => {
            durations[day].push(Number(task.duration) / 60000);
          });
        });
        return durations;
      },
      taskDurationsSum() {
        const sum = {};
        Array.from(Object.keys(this.taskDurationsInMinutes)).forEach(day => {
          sum[day] = this.taskDurationsInMinutes[day].reduce((acc, val) => acc + val) * 60000;
        });

        return sum;
      },
      sortedProjects() {
        const timedProjects = this.timedProjects;
        const sortedProjects = [];
        Array.from(Object.keys(timedProjects)).forEach(key => {
          sortedProjects.push({
            id: key,
            name: timedProjects[key].name,
            duration: timedProjects[key].duration,
          });
        });
        return sortedProjects.sort((p_1, p_2) => p_1.duration < p_2.duration);
      },
      projectDurationsInMinutes() {
        const durations = [];
        this.sortedProjects.forEach(project => {
          durations.push(project.duration / 60000);
        });
        return durations;
      },
      projectDurationsSum() {
        if (this.projectDurationsInMinutes.length > 0) {
          return this.projectDurationsInMinutes.reduce((acc, val) => acc + val) * 60000;
        }
        return [];
      },
      selectedDate() {
        return this.sortedDates[this.selectedDateIndex];
      },
      selectedTask() {
        if (this.selectedDate && this.sortedTasks) {
          return this.sortedTasks[this.selectedDate][this.selectedTaskIndex];
        }
        return null;
      },
      selectedProject() {
        return this.sortedProjects[this.selectedProjectIndex];
      },
      hasBackItem() {
        if (this.displayMode === 'tasks') {
          return this.selectedTaskIndex !== 0;
        } else {
          return this.selectedProjectIndex !== 0;
        }
      },
      hasNextItem() {
        if (this.displayMode === 'tasks') {
          if (this.selectedDate && this.sortedTasks) {
            return this.selectedTaskIndex < this.sortedTasks[this.selectedDate].length - 1;
          }
          return false;
        } else {
          if (this.sortedProjects) {
            return this.selectedProjectIndex < this.sortedProjects.length - 1;
          }
          return false;
        }
      },
      hasBackDate() {
        return this.selectedDateIndex !== 0;
      },
      hasNextDate() {
        return this.selectedDateIndex < this.sortedDates.length - 1;
      },
    },
    data() {
      return {
        displayMode: 'tasks',
        selectedDateIndex: 0,
        selectedTaskIndex: 0,
        selectedProjectIndex: 0,
      };
    },
    methods: {
      displayTasks() {
        this.displayMode = 'tasks';
      },
      displayProjects() {
        this.displayMode = 'projects';
      },
      selectPrevItem(switchType) {
        switch (switchType) {
          case 'dates':
            this.selectedDateIndex -= this.selectedDateIndex > 0 ? 1 : 0;
            this.selectedTaskIndex = 0;
            break;
          case 'tasks':
            this.selectedTaskIndex -= this.selectedTaskIndex > 0 ? 1 : 0;
            break;
          case 'projects':
            this.selectedProjectIndex -= this.selectedProjectIndex > 0 ? 1 : 0;
            break;
          default:
            break;
        }
      },
      selectNextItem(switchType) {
        switch (switchType) {
          case 'dates':
            this.selectedTaskIndex = 0;
            this.selectedDateIndex += this.selectedDateIndex < this.sortedDates.length-1 ? 1 : 0;
            break;
          case 'tasks':
            this.selectedTaskIndex += this.selectedTaskIndex < this.sortedTasks[this.selectedDate].length-1 ? 1 : 0;
            break;
          case 'projects':
            this.selectedProjectIndex += this.selectedProjectIndex < this.sortedProjects.length-1 ? 1 : 0;
            break;
          default:
            break;
        }
      },
      selectItemByScroll(event, switchType) {
        console.log(event);
      },
    },
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
    margin-right: 15px;
    position: relative;
    .top-row {
      display: grid;
      grid-template-rows: 40px;
      grid-template-columns: 1fr 1fr;
      border-bottom: solid 1px black;
      button {
        background: none;
        border: none;
        font-size: 24px;
        font-style: italic;
        height: 100%;
        text-align: center;
        &:not(.active) {
          color: #CCCCCC;
        }
        &:first-child {
          border-right: solid 1px black;
        }
      }
    }
    .switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0;
      &.time-switch {
        justify-content: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        margin: 0;
      }
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        padding: 0;
        &:not(.active) {
          pointer-events: none;
          img {
            opacity: 0.2;
          }
        }
        img {
          width: 20px;
          height: 20px;
          opacity: 0.7;
        }
      }
      .back-btn {
        transform: rotate(-90deg);
      }
      .next-btn {
        transform: rotate(90deg);
      }
      .wrapper {
        text-align: center;
        font-style: italic;
        padding: 0 5px;
        user-select: none;
        .item {
          font-size: 24px;
          padding-bottom: 4px;
          line-height: 1;
          height: 25px;
          overflow: hidden;
        }
        .subitem {
          font-size: 20px;
          color: #CCCCCC;
          padding-bottom: 2px;
          line-height: 1;
        }
      }
    }
    .diagram {
      position: absolute;
      bottom: 60px;
      left: 0;
      width: 100%;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 20px;
      .time {
        position: absolute;
        font-size: 50px;
        font-style: italic;
        font-weight: bold;
        user-select: none;
      }
    }
  }
</style>