import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Store from '../store/index';

@Module({
  dynamic: true,
  name: 'settings',
  namespaced: true,
  store: Store
})
export default class SettingsStoreModule extends VuexModule {
  public languageOptions = ['english', 'russian'];
  public firstDayOfWeekOptions = ['monday', 'sunday'];
  public colorThemeOptions = ['classic light', 'classic dark', 'neon dark'];
  public saveOnChangesOptions = ['yes', 'no'];

  public languageSelected = this.languageOptions[0];
  public firstDayOfWeekSelected = this.firstDayOfWeekOptions[0];
  public colorThemeSelected = this.colorThemeOptions[0];
  public saveOnChangesSelected = this.saveOnChangesOptions[0];

  public workHoursInDay = 6;
  public autosavePeriod = 10;


  @Mutation
  private SET_LANGUAGE(value: string) {
    this.languageSelected = value;
  }

  @Mutation
  private SET_FIRST_DAY_OF_WEEK(value: string) {
    this.firstDayOfWeekSelected = value;
  }

  @Mutation
  private SET_COLOR_THEME(value: string) {
    this.colorThemeSelected = value;
  }

  @Mutation
  private SET_WORK_HOURS_IN_DAY(value: number) {
    this.workHoursInDay = value;
  }

  @Mutation
  private SET_AUTOSAVE_PERIOD(value: number) {
    this.autosavePeriod = value;
  }

  @Mutation
  private SET_SAVE_ON_CHANGES(value: string) {
    this.saveOnChangesSelected = value;
  }


  @Action
  public setLanguage(value: string) {
    this.SET_LANGUAGE(value);
  }

  @Action
  public setFirstDayOfWeek(value: string) {
    this.SET_FIRST_DAY_OF_WEEK(value);
  }

  @Action
  public setColorTheme(value: string) {
    this.SET_COLOR_THEME(value);
  }

  @Action
  public setWorkHoursInDay(value: number) {
    this.SET_WORK_HOURS_IN_DAY(value);
  }

  @Action
  public setAutosavePeriod(value: number) {
    this.SET_AUTOSAVE_PERIOD(value);
  }

  @Action
  public setSaveOnChanges(value: string) {
    this.SET_SAVE_ON_CHANGES(value);
  }
}