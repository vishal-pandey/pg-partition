FROM postgres:13

# Install pg_cron extension
RUN apt-get update && \
    apt-get install -y postgresql-13-cron && \
    rm -rf /var/lib/apt/lists/*

# Enable pg_cron extension and set the database name
RUN echo "shared_preload_libraries = 'pg_cron'" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "cron.database_name = 'itsm_db'" >> /usr/share/postgresql/postgresql.conf.sample
