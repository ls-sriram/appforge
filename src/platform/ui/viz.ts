export type UiStampAttrs = {
  __uiid?: string;
  __uilabel?: string;
};

export interface UiStamp {
  (id: string, label: string): UiStampAttrs;
  scope(segment: string): UiStamp;
}

function joinUiId(prefix: string, id: string): string {
  return prefix ? `${prefix}.${id}` : id;
}

export function createUi(prefix = ""): UiStamp {
  const stamp = ((id: string, label: string) => ({
    __uiid: joinUiId(prefix, id),
    __uilabel: label,
  })) as UiStamp;
  stamp.scope = (segment: string) => createUi(joinUiId(prefix, segment));
  return stamp;
}

const noopUiImpl = ((() => ({})) as unknown) as UiStamp;
noopUiImpl.scope = () => noopUiImpl;

export const noopUi = noopUiImpl;
