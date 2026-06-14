CREATE TABLE IF NOT EXISTS config (
    project_id TEXT NOT NULL,
    environment TEXT NOT NULL,
    scope TEXT NOT NULL CHECK (scope IN ('frontend', 'backend')),
    group_category TEXT NOT NULL DEFAULT 'general',
    category TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        project_id,
        environment,
        scope,
        category,
        key
    )
);
