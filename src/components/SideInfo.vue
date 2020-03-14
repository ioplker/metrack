<template>
  <div class="container">
    <h2>Сегодня <br> отмечено</h2>
    <div class="time">{{ todayMarkedTime | hoursAndMinutes}}</div>
    <a href="https://github.com/ioplker/" target="_blank">ioplker</a>
  </div>
</template>

<script>
  export default {
    props: ['todayMarkedTime'],
  }
</script>

<style scoped lang="scss">
  .container {
    text-align: right;
    color: #4D4D4D;
    padding-top: 5px;
    padding-right: 15px;
    h2 {
      margin: 0;
      line-height: 1;
      font-style: italic;
      font-size: 30px;
    }
    .time {
      font-size: 26px;
    }
  }
</style>