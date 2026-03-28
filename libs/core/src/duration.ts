export class Duration {
  constructor(private readonly milliseconds: number) {}

  public static inDays(value: number) {
    return new Duration(value * 24 * 60 * 60 * 1000);
  }

  public static inHours(value: number) {
    return new Duration(value * 60 * 60 * 1000);
  }

  public static inMinutes(value: number) {
    return new Duration(value * 60 * 1000);
  }

  public static inSeconds(value: number) {
    return new Duration(value * 1000);
  }

  public static inMilliseconds(value: number) {
    return new Duration(value);
  }

  public toMilliseconds() {
    return this.milliseconds;
  }

  public toSeconds() {
    return this.milliseconds / 1000;
  }

  public toMinutes() {
    return this.milliseconds / 1000 / 60;
  }

  public toHours() {
    return this.milliseconds / 1000 / 60 / 60;
  }

  public toDays() {
    return this.milliseconds / 1000 / 60 / 60 / 24;
  }
}
