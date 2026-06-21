export type UiStampAttrs = {
  __uiid?: string;
};

export interface UiStamp {
  (id: string): UiStampAttrs;
  scope(segment: string): UiStamp;
}

function joinUiId(prefix: string, id: string): string {
  return prefix ? `${prefix}.${id}` : id;
}

export function createUi(prefix = ""): UiStamp {
  const stamp = ((id: string) => ({ __uiid: joinUiId(prefix, id) })) as UiStamp;
  stamp.scope = (segment: string) => createUi(joinUiId(prefix, segment));
  return stamp;
}

const noopUiImpl = ((() => ({})) as unknown) as UiStamp;
noopUiImpl.scope = () => noopUiImpl;

export const noopUi = noopUiImpl;
