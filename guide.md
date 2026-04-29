# PostgreSQL Replication (Master/Slave) with Docker Compose

Tài liệu này hướng dẫn cấu hình replication master/slave cho project dùng image `bitnami/postgresql`, bằng `.conf` mount vào container.

## 1) Cấu trúc file cấu hình

Tạo/đảm bảo các file sau trong thư mục `postgres/`:

```text
postgres/
  master/
    postgres.conf
    pg_hba.conf
  slave/
    postgres.conf
```

Bitnami PostgreSQL có cơ chế include:
- `postgresql.conf` sẽ `include_dir = 'conf.d'`

Vì vậy, ta mount các file `.conf` của mình vào `.../conf/conf.d/` (không ghi đè `postgresql.conf`).

## 2) Nội dung `.conf` (template)

### Master: `postgres/master/postgres.conf`

```conf
# Master - replication basics
listen_addresses = '*'
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on
wal_keep_size = 128MB
```

### Master: `postgres/master/pg_hba.conf`

> User replication trong ví dụ là `replicator`. Nếu bạn đổi `DB_REPLICATE_USER` trong compose thì cập nhật tại đây cho khớp.

```conf
# TYPE  DATABASE       USER            ADDRESS                 METHOD
host    replication    replicator      0.0.0.0/0               md5
```

### Slave: `postgres/slave/postgres.conf`

```conf
hot_standby = on
hot_standby_feedback = on
```

## 3) Mount vào `docker-compose.yml`

Trong `docker-compose.yml`, thêm/cập nhật `volumes` cho 2 service:

### `postgresql-master`

```yaml
volumes:
  - ./postgres/master/postgres.conf:/opt/bitnami/postgresql/conf/conf.d/postgres-master.conf:ro
  - ./postgres/master/pg_hba.conf:/opt/bitnami/postgresql/conf/pg_hba.conf:ro
```

### `postgresql-slave`

```yaml
volumes:
  - ./postgres/slave/postgres.conf:/opt/bitnami/postgresql/conf/conf.d/postgres-slave.conf:ro
```

## 4) Lưu ý về biến `${DB_USER}` trong Compose

Trong `docker-compose.yml` bạn đang dùng dạng:
- `${DB_USER:-postgres}`
- `${DB_PASSWORD:-123456}`

Điều này giúp tránh trường hợp Compose nội suy ra chuỗi rỗng (dẫn tới lỗi kiểu *“no PostgreSQL user name specified in startup packet”*).

Nếu bạn muốn dùng đúng giá trị trong `server/.env` thì bạn có thể:
- hoặc để mặc định `:-...` như hiện tại
- hoặc tạo thêm file `.env` ở **root** (cùng cấp `docker-compose.yml`) để Compose lấy biến.

## 5) Kiểm tra replication

### Trên master

Chạy trong container `postgresql-master`:

```sql
select client_addr, state, sync_state, write_lag, flush_lag, replay_lag
from pg_stat_replication;
```

### Trên slave

Chạy trong container `postgresql-slave`:

```sql
select status, receive_start_lsn, received_lsn, latest_end_lsn
from pg_stat_wal_receiver;
```

## 6) Troubleshooting nhanh

Nếu gặp lỗi “no PostgreSQL user name specified in startup packet”:
- kiểm tra `POSTGRESQL_USERNAME` trong log/compose config không bị rỗng
- đảm bảo `POSTGRESQL_REPLICATION_USER` khớp với `pg_hba.conf` ở master
- xem log master/slave để biết PostgreSQL có bị từ chối auth hay chưa.

