import { dateOwner } from "../timestamp";
import { idOwner, type IdStrategy } from "../ids";

export interface EntityMetadata {
  createdAt: string;
  updatedAt: string;
}

export interface OwnedMetadata extends EntityMetadata {
  ownerId: string;
}

export interface CreateMetadataOptions {
  now?: Date | string | number;
}

export interface CreateOwnedMetadataOptions extends CreateMetadataOptions {
  ownerId?: string;
  ownerIdStrategy?: IdStrategy;
}

export interface MetadataOwner {
  create(options?: CreateMetadataOptions): EntityMetadata;
  createOwned(options?: CreateOwnedMetadataOptions): OwnedMetadata;
  touch<T extends { updatedAt?: string }>(current: T): T & { updatedAt: string };
}

export const metadataOwner: MetadataOwner = {
  create(options?: CreateMetadataOptions): EntityMetadata {
    const nowIso = resolveNowIso(options);
    return {
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },
  createOwned(options?: CreateOwnedMetadataOptions): OwnedMetadata {
    const metadata = this.create(options);

    return {
      ...metadata,
      ownerId: options?.ownerId ?? idOwner.generate({ strategy: options?.ownerIdStrategy }),
    };
  },
  touch<T extends { updatedAt?: string }>(current: T): T & { updatedAt: string } {
    return {
      ...current,
      updatedAt: dateOwner.nowIso(),
    };
  },
};

function resolveNowIso(options?: CreateMetadataOptions): string {
  if (!options?.now) {
    return dateOwner.nowIso();
  }

  return dateOwner.toIso(options.now) ?? dateOwner.nowIso();
}
