-- Connect to the itsm_db database to create the pg_cron extension
\c itsm_db

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create partitioned table
CREATE TABLE incidents (
    id SERIAL,
    incident_id TEXT NOT NULL,
    status TEXT NOT NULL,
    severity TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id, created_at)  -- Include created_at in the primary key
) PARTITION BY RANGE (created_at);

-- Create original table
CREATE TABLE incident_og (
    id SERIAL PRIMARY KEY,
    incident_id TEXT NOT NULL,
    status TEXT NOT NULL,
    severity TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create sample partitions from the start of 2024
CREATE TABLE incidents_2024_01 PARTITION OF incidents FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE incidents_2024_02 PARTITION OF incidents FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE incidents_2024_03 PARTITION OF incidents FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE incidents_2024_04 PARTITION OF incidents FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE incidents_2024_05 PARTITION OF incidents FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE incidents_2024_06 PARTITION OF incidents FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE incidents_2024_07 PARTITION OF incidents FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE incidents_2024_08 PARTITION OF incidents FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE incidents_2024_09 PARTITION OF incidents FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE incidents_2024_10 PARTITION OF incidents FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE incidents_2024_11 PARTITION OF incidents FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE incidents_2024_12 PARTITION OF incidents FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE incidents_2025_01 PARTITION OF incidents FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE incidents_2025_02 PARTITION OF incidents FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE incidents_2025_03 PARTITION OF incidents FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE incidents_2025_04 PARTITION OF incidents FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE incidents_2025_05 PARTITION OF incidents FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

-- Indexing for optimized queries
CREATE INDEX idx_incidents_2024_01_created_at ON incidents_2024_01 (created_at);
CREATE INDEX idx_incidents_2024_02_created_at ON incidents_2024_02 (created_at);
CREATE INDEX idx_incidents_2024_03_created_at ON incidents_2024_03 (created_at);
CREATE INDEX idx_incidents_2024_04_created_at ON incidents_2024_04 (created_at);
CREATE INDEX idx_incidents_2024_05_created_at ON incidents_2024_05 (created_at);
CREATE INDEX idx_incidents_2024_06_created_at ON incidents_2024_06 (created_at);
CREATE INDEX idx_incidents_2024_07_created_at ON incidents_2024_07 (created_at);
CREATE INDEX idx_incidents_2024_08_created_at ON incidents_2024_08 (created_at);
CREATE INDEX idx_incidents_2024_09_created_at ON incidents_2024_09 (created_at);
CREATE INDEX idx_incidents_2024_10_created_at ON incidents_2024_10 (created_at);
CREATE INDEX idx_incidents_2024_11_created_at ON incidents_2024_11 (created_at);
CREATE INDEX idx_incidents_2024_12_created_at ON incidents_2024_12 (created_at);
CREATE INDEX idx_incidents_2025_01_created_at ON incidents_2025_01 (created_at);
CREATE INDEX idx_incidents_2025_02_created_at ON incidents_2025_02 (created_at);
CREATE INDEX idx_incidents_2025_03_created_at ON incidents_2025_03 (created_at);
CREATE INDEX idx_incidents_2025_04_created_at ON incidents_2025_04 (created_at);
CREATE INDEX idx_incidents_2025_05_created_at ON incidents_2025_05 (created_at);

-- Function to create new partitions automatically
CREATE OR REPLACE FUNCTION create_incident_partition() RETURNS void AS $$
DECLARE
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    start_date := date_trunc('month', NOW());
    end_date := start_date + INTERVAL '1 month';
    partition_name := format('incidents_%s', to_char(start_date, 'YYYY_MM'));

    IF NOT EXISTS (
        SELECT FROM pg_tables WHERE tablename = partition_name
    ) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF incidents FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );

        EXECUTE format('CREATE INDEX ON %I (created_at)', partition_name);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Schedule auto-partitioning every month
SELECT cron.schedule('0 0 1 * *', $$SELECT create_incident_partition();$$);

-- Function to generate fake data
CREATE OR REPLACE FUNCTION generate_fake_data() RETURNS void AS $$
DECLARE
    status_array TEXT[] := ARRAY['Open', 'Closed', 'In Progress'];
    severity_array TEXT[] := ARRAY['Low', 'Medium', 'High'];
    i INT;
BEGIN
    FOR i IN 1..1000000 LOOP  -- Generate 1 million records
        INSERT INTO incidents (incident_id, status, severity, summary, created_at, updated_at)
        VALUES (
            'INC' || LPAD(i::TEXT, 7, '0'),  -- Adjusted to ensure unique incident IDs
            status_array[FLOOR(RANDOM() * 3 + 1)],
            severity_array[FLOOR(RANDOM() * 3 + 1)],
            'This is a summary for incident ' || i,
            '2024-01-01'::timestamp + (RANDOM() * (NOW() - '2024-01-01'::timestamp)),  -- Random date from start of 2024
            NOW()  -- Set updated_at to the current timestamp
        );

        INSERT INTO incident_og (incident_id, status, severity, summary, created_at, updated_at)
        VALUES (
            'INC' || LPAD(i::TEXT, 7, '0'),  -- Adjusted to ensure unique incident IDs
            status_array[FLOOR(RANDOM() * 3 + 1)],
            severity_array[FLOOR(RANDOM() * 3 + 1)],
            'This is a summary for incident ' || i,
            '2024-01-01'::timestamp + (RANDOM() * (NOW() - '2024-01-01'::timestamp)),  -- Random date from start of 2024
            NOW()  -- Set updated_at to the current timestamp
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call the function to generate fake data
SELECT generate_fake_data();
