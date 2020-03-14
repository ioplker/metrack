// Donut chart from:
// https://css-tricks.com/building-a-donut-chart-with-vue-and-svg/
<template>
  <svg height="160" width="160" viewBox="0 0 160 160" class="donut-chart">
    <g v-for="(value, index) in sortedValues" :key="index">
      <circle
        :class="{active: currentIndex === index}"
        :cx="cx"
        :cy="cy"
        :r="radius"
        :stroke="getColor(index)"
        :stroke-width="strokeWidth"
        :stroke-dasharray="adjustedCircumference"
        :stroke-dashoffset="calculateStrokeDashOffset(value, circumference)"
        fill="transparent"
        :transform="returnCircleTransformValue(index)"
      />

      <!-- <text
        v-if="segmentBigEnough(value)"
        text-anchor="middle"
        dy="3px"
        :x="chartData[index].textX"
        :y="chartData[index].textY"
      >{{ percentageString(value) }}</text> -->
    </g>
  </svg>
</template>

<script>
  export default {
    props: [
      'initialValues',
      'currentIndex',
    ],
    data() {
      return {
        angleOffset: -90,
        colors: [
          '#e57373',
          '#f06292',
          '#ba68c8',
          '#9575cd',
          '#7986cb',
          '#64b5f6',
          '#4fc3f7',
          '#4dd0e1',
          '#4db6ac',
          '#81c784',
          '#aed581',
          '#dce775',
          '#fff176',
          '#ffd54f',
          '#ffb74d',
          '#ff8a65',
          ],
        cx: 80,
        cy: 80,
        radius: 90,
        strokeWidth: 30,
      }
  	},
    computed: {
      // adjust the circumference to add small white gaps
      adjustedCircumference() {
        return this.circumference - 2;
      },
      circumference() {
        return 2 * Math.PI * this.radius;
      },
      dataTotal() {
        return this.sortedValues.reduce((acc, val) => acc + val);
      },
      sortedValues() {
        // return this.initialValues.sort((a,b) => b-a);
        return this.initialValues;
      },
      chartData() {
        const chartData = [];
        let angleOffset = this.angleOffset;

        this.sortedValues.forEach((dataVal, index) => {
          const { x, y } = this.calculateTextCoords(dataVal, angleOffset);
          // Start at -90deg so that the largest segment is perpendicular to top
          const data = {
            degrees: angleOffset,
            textX: x,
            textY: y,
          }
          chartData.push(data);
          angleOffset = this.dataPercentage(dataVal) * 360 + angleOffset;
        });
        return chartData;
      },
    },
    methods: {
      calculateStrokeDashOffset(dataVal, circumference) {
        const strokeDiff = this.dataPercentage(dataVal) * circumference;
        return circumference - strokeDiff;
      },
      calculateTextCoords(dataVal, angleOffset) {
        // t must be in radians
        // x(t) = r cos(t) + j
        // y(t) = r sin(t) + j

        const angle = (this.dataPercentage(dataVal) * 360) / 2 + angleOffset;
        const radians = this.degreesToRadians(angle);

        const textCoords = {
          x: this.radius * Math.cos(radians) + this.cx,
          y: this.radius * Math.sin(radians) + this.cy,
        }
        return textCoords;
      },
      degreesToRadians(angle) {
        return angle * (Math.PI / 180);
      },
      dataPercentage(dataVal) {
        return dataVal / this.dataTotal;
      },
      percentageString(dataVal) {
        return `${Math.round(this.dataPercentage(dataVal) * 100)}%`;
      },
      returnCircleTransformValue(index) {
        return `rotate(${this.chartData[index].degrees}, ${this.cx}, ${this.cy})`;
      },
      segmentBigEnough(dataVal) {
        return Math.round(this.dataPercentage(dataVal) * 100) > 5;
      },
      getColor(index) {
        const newIndex = index % this.colors.length;
        return this.colors[newIndex];
      },
    },
  };
</script>

<style lang="scss" scoped>
  svg {
    height: 250px;
    width: 250px;
    overflow: visible;
    circle:not(.active) {
      opacity: 0.4;
    }
  }
  text {
    fill: #333333;
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
  }
</style>