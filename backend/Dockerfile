FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src
COPY database/ ./database
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
RUN apt-get update && apt-get install -y musl-tools
RUN rustup target add x86_64-unknown-linux-musl

COPY database/ ./database
COPY --from=planner /app/recipe.json recipe.json

# Enable static linking for OpenSSL
ENV OPENSSL_STATIC=yes \
    OPENSSL_LIB_DIR=/usr/lib/x86_64-linux-gnu \
    OPENSSL_INCLUDE_DIR=/usr/include/openssl

RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src
RUN cargo build --release --target x86_64-unknown-linux-musl --all-features

FROM alpine:latest AS application

# Install runtime dependencies
RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/backend .

CMD ["./backend"]
