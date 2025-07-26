#[cfg(feature = "redis")]
use crate::config::CONFIG;
#[cfg(not(feature = "redis"))]
use tower_sessions::MemoryStore;
use tower_sessions::{
    Expiry, SessionManagerLayer,
    cookie::{SameSite, time::Duration},
};
#[cfg(feature = "redis")]
use tower_sessions_redis_store::{
    RedisStore,
    fred::prelude::{ClientLike, Config, Pool, ServerConfig},
};

#[cfg(feature = "redis")]
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
        .with_http_only(false)
        .with_same_site(SameSite::None)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}

#[cfg(not(feature = "redis"))]
pub async fn session() -> SessionManagerLayer<MemoryStore> {
    let session_store = MemoryStore::default();

    SessionManagerLayer::new(session_store)
        .with_http_only(false)
        .with_same_site(SameSite::None)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}
