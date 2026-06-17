/**
 * DataSource layer — reads the generated repo-scan snapshot.
 *
 * Transport/persistence detail only: it loads the bundled JSON produced
 * by `npm run studio:scan`. No domain logic, no UI imports. Regenerate
 * the snapshot to refresh.
 */
import type { RepoScan } from "../domain/repo-structure.types";
import snapshot from "./repo-scan.generated.json";

export function fetchRepoScan(): RepoScan {
  return snapshot as unknown as RepoScan;
}
