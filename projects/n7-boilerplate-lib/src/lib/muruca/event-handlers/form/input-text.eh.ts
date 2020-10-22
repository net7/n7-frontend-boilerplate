import { MrInputEH } from './input.eh';

export class MrInputTextEH extends MrInputEH {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`: {
          const { value } = payload;
          const { id } = this.dataSource;
          const state = this.dataSource.getState();
          // update input state
          this.dataSource.setState({ value });
          // emit change
          this.form.change$.next({ id, state });
          break;
        }
        default:
          break;
      }
    });
  }
}
