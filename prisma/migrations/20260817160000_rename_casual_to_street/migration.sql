-- Rename enum value instead of dropping/recreating it, so existing rows
-- referencing "casual" keep working and are simply relabeled "street".
ALTER TYPE "CategorySlug" RENAME VALUE 'casual' TO 'street';
