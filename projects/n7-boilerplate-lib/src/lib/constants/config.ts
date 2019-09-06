// @dynamic

export class Config {
  protected static defaults = {};

  public static get = (key) => Config.defaults[key];
  public static set = (key, value) => Config.defaults[key] = value;
}
