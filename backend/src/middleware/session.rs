use tower_sessions::{
    Expiry, SessionManagerLayer,
    cookie::{SameSite, time::Duration},
};
use tower_sessions_redis_store::{
    RedisStore,
    fred::prelude::{ClientLike, Config, Pool, ServerConfig},
};

use crate::config::CONFIG;

pub async fn session() -> SessionManagerLayer<RedisStore<Pool>> {
    let config = Config {
        password: Some(CONFIG.redis.password.clone()),
        server: ServerConfig::new_centralized(CONFIG.redis.host.clone(), CONFIG.redis.port),
        ..Default::default()
    };
    let pool = Pool::new(config, None, None, None, CONFIG.redis.pool_size).unwrap();

    pool.connect();
    pool.wait_for_connect().await.unwrap();

    let session_store = RedisStore::new(pool);

    SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_same_site(SameSite::Lax)
        .with_http_only(false)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}
