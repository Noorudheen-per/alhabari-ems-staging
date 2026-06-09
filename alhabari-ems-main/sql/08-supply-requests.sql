-- ════════════════════════════════════════════════════════════════════
-- v40: Supply Requests (PPE + Tools unified workflow)
-- Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS supply_requests (
  id BIGSERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'PPE',
  requester_id BIGINT,
  requester_name TEXT,
  site TEXT,
  date DATE,
  status TEXT NOT NULL DEFAULT 'submitted',
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  dn_no TEXT,
  dn_date DATE,
  dn_issued_by TEXT,
  mr_no TEXT,
  mr_date DATE,
  mr_created_by TEXT,
  po_no TEXT,
  po_date DATE,
  po_created_by TEXT,
  sk_note TEXT,
  admin_note TEXT,
  procure_note TEXT,
  history JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supply_requests_status ON supply_requests(status);
CREATE INDEX IF NOT EXISTS idx_supply_requests_requester ON supply_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_supply_requests_site ON supply_requests(site);
CREATE INDEX IF NOT EXISTS idx_supply_requests_token ON supply_requests(token);

ALTER TABLE supply_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_all_supply_requests ON supply_requests;
CREATE POLICY anon_all_supply_requests ON supply_requests
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Add to realtime publication only if not already there (avoids error 42710)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'supply_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE supply_requests;
  END IF;
END $$;
