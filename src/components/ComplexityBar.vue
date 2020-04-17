<template>
  <div class="complexity-bar"
    @wheel="handleScroll"
  >
    <div class="line"></div>
    <div class="steps-wrapper">
      <div class="step"
        v-for="(step, index) of steps"
        :key="index"
        :class="{active: value === step}"
        :style="{ 'left': stepsPositionMap[step]+'%', }"
        @click="selectStep(step)"
      >
        <div class="tick"></div>
        <div class="number">{{ step }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'

import { TASK_COMPLEXITY } from 'src/store/classes/Task'

@Component({})
export default class ComplexityBar extends Vue {
  @Prop()
  private value: number = this.steps[0];

  private get steps(): number[] {
    const steps: number[] = [];
    Object.keys(TASK_COMPLEXITY).forEach(key => {
      if (Number(key)) steps.push(Number(key));
    });
    return steps.sort((a, b) => a - b);
  }

  private get stepsPositionMap(): {[k: number]: number} {
    const map: {[k: number]: number} = {};

    // in px
    const min = this.steps[0];
    const [ max ] = this.steps.slice(-1);
    const distance = max - min + 1;
    const endLength = 30;
    const endLengthPercent = 100 / endLength;

    // in %
    const stepLength = (100 - endLengthPercent*2) / distance;

    this.steps.forEach(step => {
      map[step] = Math.floor(stepLength * (step-1) + endLengthPercent);
    });
    return map;
  }

  @Emit('input')
  private selectStep(step: number): number {
    return step; // Don't need to return anything, just got rid of lint warning
  }

  private selectNextStep(): void {
    const index = this.steps.indexOf(this.value);
    if (index < this.steps.length - 1) this.selectStep(this.steps[index + 1]);
  }

  private selectPrevStep(): void {
    const index = this.steps.indexOf(this.value);
    if (index > 0) this.selectStep(this.steps[index - 1]);
  }

  private handleScroll(event: {deltaY: number}): void {
    if (event.deltaY > 0) {
      this.selectPrevStep();
    } else {
      this.selectNextStep();
    }
  }
}
</script>

<style lang="scss" scoped>
.complexity-bar {
  padding-top: 4px;
  width: 100%;
  cursor: col-resize;
  .line {
    width: 100%;
    height: 2px;
    background: rgb(0,255,229);
    background: linear-gradient(90deg, rgb(0, 255, 229) 0%, rgb(59, 255, 90) 10%, rgb(149, 255, 0) 21%, rgb(234, 255, 0) 39%, rgb(255, 255, 0) 58%, rgb(255, 153, 0) 87%, rgb(255, 0, 0) 100%);
  }
  .steps-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -6px;
    padding: 0 5px;
    height: 30px;
    .step {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &.active {
        .tick {
          width: 10px;
          border-radius: 50%;
        }
        .number {
          font-weight: bold;
        }
      }
      .tick {
        width: 2px;
        height: 10px;
        background: #000000;
      }
      .number {
        user-select: none;
      }
    }
  }
}
</style>