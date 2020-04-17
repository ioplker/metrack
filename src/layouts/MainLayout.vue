<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      show-if-above
      no-swipe-close
      no-swipe-open
      bordered
      content-class="bg-grey-1"
      :width="150"
      :mini="drawerMinified"
      :breakpoint="500"
      :mini-to-overlay="true"
      @mouseover="drawerMinified = false"
      @mouseout="drawerMinified = true"
    >
      <div class="drawer-content">
        <q-list class="top-list">
          <template v-for="(link, index) of topLinks">
            <q-item v-if="link.path"
              :key="index"
              :to="link.path" exact clickable>
              <q-item-section avatar>
                <q-icon color="primary" :name="link.icon" />
              </q-item-section>

              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>

            <q-item v-if="link.callback"
              :key="index"
              @click="link.callback()" exact clickable>
              <q-item-section avatar>
                <q-icon color="primary" :name="link.icon" />
              </q-item-section>

              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>

            <hr v-if="link.lineAfter"
              :key="'line_'+index">
          </template>
        </q-list>

        <q-list class="bottom-list">
          <template v-for="(link, index) of bottomLinks">
            <q-item v-if="link.path"
              :key="index"
              :to="link.path" exact clickable>
              <q-item-section avatar>
                <q-icon color="primary" :name="link.icon" />
              </q-item-section>

              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>

            <q-item v-if="link.callback"
              :key="index"
              @click="link.callback()" exact clickable>
              <q-item-section avatar>
                <q-icon color="primary" :name="link.icon" />
              </q-item-section>

              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>

            <hr v-if="link.lineAfter"
              :key="'line_'+index">
          </template>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

interface SideItem {
  title: string,
  icon: string,
  path?: string,
  callback?: Function,
  lineAfter?: boolean,
}

@Component
export default class MainLayout extends Vue {
  private drawerOpened = true;
  private drawerMinified = true;
  private topLinks: SideItem[] = [
    {
      title: 'Today',
      icon: 'access_time',
      path: '/today',
    },
    {
      title: 'Backlog',
      icon: 'list',
      path: '/backlog',
    },
    {
      title: 'Statistics',
      icon: 'timeline',
      path: '/statistics',
      lineAfter: true,
    },
    {
      title: 'Export',
      icon: 'save',
      callback: this.export,
    },
    {
      title: 'Import',
      icon: 'archive',
      callback: this.import,
      lineAfter: true,
    },
    {
      title: 'Settings',
      icon: 'settings',
      path: '/settings',
    },
  ];
  private bottomLinks: SideItem[] = [
    {
      title: 'Quit',
      icon: 'logout',
      callback: this.quit,
    },
  ];

  private toggleDrawer(): void {
    this.drawerMinified = !this.drawerMinified;
  }

  private import(): void {
    console.log('import() called');
  }

  private export(): void {
    console.log('export() called');
  }

  private quit(): void {
    console.log('quit() called');
  }
}
</script>

<style lang="scss" scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top-list {
    flex-grow: 1;
  }
  hr {
    margin: 10px;
    color: $primary;
  }
}
</style>