use tower_sessions::{
    Expiry, SessionManagerLayer,
    cookie::{SameSite, time::Duration},
};
use tower_sessions_redis_store::{
    RedisStore,
    fred::prelude::{ClientLike, Config, Pool},
};

pub async fn session() -> SessionManagerLayer<RedisStore<Pool>> {
    let pool = Pool::new(Config::default(), None, None, None, 6).unwrap();

    pool.connect();
    pool.wait_for_connect().await.unwrap();

    let session_store = RedisStore::new(pool);

    SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_same_site(SameSite::Lax)
        .with_http_only(false)
        .with_expiry(Expiry::OnInactivity(Duration::seconds(600)))
}
