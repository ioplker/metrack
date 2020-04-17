<template>
  <q-page class="flex flex-center items-stretch">
    <section class="col q-ma-lg tile">
      <h2 class="header">General <span class="alt-text">Settings</span></h2>

      <!-- Language -->
      <div class="row items-center">
        <span class="col">Language</span>
        <q-select
          class="col"
          outlined
          v-model="languageSelected"
          :options="languageOptions"
          :dense="true" :options-dense="true"
        ></q-select>
      </div>

      <!-- First day of the week -->
      <div class="row items-center">
        <span class="col">First day of the week</span>
        <q-select
          class="col"
          outlined
          v-model="firstDayOfWeekSelected"
          :options="firstDayOfWeekOptions"
          :dense="true" :options-dense="true"
        ></q-select>
      </div>

      <!-- Color theme -->
      <div class="row items-center">
        <span class="col">Color theme</span>
        <q-select
          class="col"
          outlined
          v-model="colorThemeSelected"
          :options="colorThemeOptions"
          :dense="true" :options-dense="true"
        ></q-select>
      </div>

      <!-- Work hours in a day -->
      <div class="row items-center">
        <span class="col">Work hours in a day</span>
        <q-input
          class="col"
          outlined
          v-model.number="workHoursInDay"
          type="number"
          suffix="hours"
          :dense="true"
          :rules="[ val => val <= 24 && val >= 1 ]"
          :hide-bottom-space="true"
        />
      </div>

      <!-- Autosave period -->
      <div class="row items-center">
        <span class="col">Autosave period</span>
        <q-input
          class="col"
          outlined
          v-model.number="autosavePeriod"
          type="number"
          suffix="minutes"
          :dense="true"
          :rules="[ val => val <= 59 && val >= 0]"
          :hide-bottom-space="true"
        />
      </div>

      <!-- Save on changes -->
      <div class="row items-center">
        <span class="col">Save on changes</span>
        <q-select
          class="col"
          outlined
          v-model="saveOnChangesSelected"
          :options="saveOnChangesOptions"
          :dense="true" :options-dense="true"
        ></q-select>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators';
import SettingsStoreModule from 'src/store/SettingsStoreModule';

@Component
export default class PageSettings extends Vue {
  store = getModule(SettingsStoreModule);

  // Language
  get languageOptions() {
    return this.store.languageOptions;
  }
  get languageSelected() {
    return this.store.languageSelected;
  }
  set languageSelected(value: string) {
    this.store.setLanguage(value);
  }

  // First day of the week
  get firstDayOfWeekOptions() {
    return this.store.firstDayOfWeekOptions;
  }
  get firstDayOfWeekSelected() {
    return this.store.firstDayOfWeekSelected;
  }
  set firstDayOfWeekSelected(value: string) {
    this.store.setFirstDayOfWeek(value);
  }

  // Color theme
  get colorThemeOptions() {
    return this.store.colorThemeOptions;
  }
  get colorThemeSelected() {
    return this.store.colorThemeSelected;
  }
  set colorThemeSelected(value: string) {
    this.store.setColorTheme(value);
  }

  // Work hours in a day
  get workHoursInDay() {
    return this.store.workHoursInDay;
  }
  set workHoursInDay(value: number) {
    this.store.setWorkHoursInDay(value);
  }

  // Autosave period
  get autosavePeriod() {
    return this.store.autosavePeriod;
  }
  set autosavePeriod(value: number) {
    this.store.setAutosavePeriod(value);
  }

  // Save on changes
  get saveOnChangesOptions() {
    return this.store.saveOnChangesOptions;
  }
  get saveOnChangesSelected() {
    return this.store.saveOnChangesSelected;
  }
  set saveOnChangesSelected(value: string) {
    this.store.setSaveOnChanges(value);
  }
}
</script>
