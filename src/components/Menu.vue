<template>
  <div class="container">
    <div class="menu">
      <div class="btn">
        <button
          @click="clearStorage()"
          title="Удалить сохранение"
          ></button>
        <img class="tall" src="../assets/icon__trash.svg" alt="Удалить сохранение">
      </div>

      <div class="btn">
        <button
          @click="loadFromStorage()"
          title="Загрузить из браузера"
          ></button>
        <img src="../assets/icon__open.svg" alt="Загрузить из браузера">
      </div>

      <div class="btn">
        <button
          @click="saveToStorage()"
          title="Сохранить в браузер"
          ></button>
        <img src="../assets/icon__save.svg" alt="Сохранить в браузер">
      </div>

      <div class="btn">
        <button
          @click="triggerFileInput()"
          title="Загрузить из файла"
          ></button>
        <img class="tall" src="../assets/icon__open-file.svg" alt="Загрузить из файла">
        <input
          ref="fileinput"
          @change="loadFromFile"
          v-show="false"
          type="file"
          >
      </div>

      <div class="btn">
        <button
          @click="saveToFile()"
          title="Сохранить в файл"
          ></button>
        <img class="tall" src="../assets/icon__save-file.svg" alt="Сохранить в файл">
      </div>

      <div class="btn">
        <button
          @click="toggleTheme()"
          title="Поменять тему"
          ></button>
        <img class="tall" src="../assets/icon__brush.svg" alt="Сгенерировать фейковые данные">
      </div>

      <div class="btn">
        <button
          @click="generateMockData()"
          title="Сгенерировать фейковые данные"
          ></button>
        <img class="tall" src="../assets/icon__toilet-paper.svg" alt="Сгенерировать фейковые данные">
      </div>
    </div>
    <div
      v-if="lastSaveDate"
      class="last-save-text"
      >Сохранение от {{ lastSaveDate | fullDate }}</div>
    <div
      v-if="!lastSaveDate"
      class="last-save-text"
      >Нет сохранённой версии!</div>
    </div>
</template>

<script>
export default {
  props: [
    'lastSaveDate',
  ],
  data() {
    return {
      themes: [
        '',
        'inverted',
      ],
      currentThemeIndex: 0,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileinput.click();
    },
    loadFromFile(event) {
      let file = event.target.files[0];
      if (!file) {
        return;
      }

      let reader = new FileReader();
      const thisComponent = this;
      reader.onload = function(e) {
        let contents = e.target.result;
        thisComponent.$emit('onLoadFromFile', contents);
      };
      reader.readAsText(file);
    },
    saveToFile() {
      this.$emit('onSaveToFile');
    },
    loadFromStorage() {
      this.$emit('onLoadFromStorage');
    },
    saveToStorage() {
      this.$emit('onSaveToStorage');
    },
    clearStorage() {
      this.$emit('onClearStorage');
    },
    toggleTheme() {
      this.currentThemeIndex += 1;
      if (this.currentThemeIndex >= this.themes.length) {
        this.currentThemeIndex = 0;
      }
      this.$emit('onThemeSet', this.themes[this.currentThemeIndex]);
    },
    generateMockData() {
      this.$emit('onGenerateMockData');
    },
  }
};
</script>

<style scoped lang="scss">
  .container {
    .menu {
      display: flex;
      align-items: flex-start;
      .btn {
        height: 35px;
        width: 70px;
        margin: 0 -3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        position: relative;
        border: solid 2px transparent;
        border-top: 0;
        &:first-child {
          margin-left: 0;
          border-left: 0;
          margin-right: -20px;
          padding-right: 15px;
          width: 70px;
          button {
            transform: skew(0);
          }
        }
        button {
          background-color: #dae8fc;
          border: solid 2px #6c8ebf;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          transform: skew(-30deg);
        }
        img {
          position: relative;
          width: 30px;
          max-height: 26px;
          pointer-events: none;
          margin-left: -3px;
          &.tall {
            max-height: 20px;
          }
        }
      }
    }
    .last-save-text {
      color: #CCCCCC;
      font-style: italic;
      padding-left: 5px;
      font-size: 12px;
    }
  }
</style>