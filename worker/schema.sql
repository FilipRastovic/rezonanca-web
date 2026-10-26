-- Card orders + the transaction log the bank requires us to keep for 13 months.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,          -- OrderID sent to the gateway
  token TEXT NOT NULL,          -- SD: secret that ties the buyer's browser to the order
  created_at TEXT NOT NULL,
  purchase_time TEXT NOT NULL,  -- yyMMddHHmmss, Belgrade time, as signed
  lang TEXT NOT NULL,
  amount INTEGER NOT NULL,      -- para (RSD × 100), shipping included
  currency INTEGER NOT NULL,    -- 941 = RSD
  lines TEXT NOT NULL,          -- JSON cart lines
  customer TEXT NOT NULL,       -- JSON name, phone, email, address, city, zip, note
  ip TEXT,                      -- buyer IP at checkout
  status TEXT NOT NULL,         -- pending | preauthorized | failed | captured | refunded
  tran_code TEXT, approval_code TEXT, rrn TEXT, xid TEXT, proxy_pan TEXT,
  notify_raw TEXT,              -- gateway notification (without signature)
  notified_at TEXT,
  emails TEXT,                  -- JSON log of confirmation emails sent
  shipped_at TEXT, captured_at TEXT
);
CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at);
