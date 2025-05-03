# 📦 ResourceManagerService

## Amaç

Kullanıcıların talep ettiği geliştirme ortamlarını (ör. Jupyter, IDE) Docker container olarak başlatan, kullanım süresini izleyen ve loglayan merkezi servis.

## Temel Özellikler

- Kimlik doğrulamalı istekleri alır
- Docker container başlatır/durdurur
- Kullanım verisini PostgreSQL'e kaydeder
- Tüm aktiviteleri Seq ile loglar
- Kullanım loglarını BlockchainService'e iletir

## Kurulum

1. .NET 9.0 SDK kurulu olmalı
2. PostgreSQL ve Seq servisleri çalışıyor olmalı (docker-compose önerilir)
3. Bağımlılıkları yükleyin:
   ```sh
   dotnet restore
   ```
4. Geliştirme ortamında başlatmak için:
   ```sh
   dotnet run
   ```
5. Docker ile build/run:
   ```sh
   docker build -t resourcemanagerservice .
   docker run -p 8080:8080 resourcemanagerservice
   ```

## API Endpointleri

- `POST /api/tasks` : Yeni container başlat
- `DELETE /api/tasks/{id}` : Container durdur
- `GET /api/tasks` : Kullanıcıya ait görevleri listele
- `GET /api/tasks/{id}` : Tekil görev detayı

## Ortam Değişkenleri

- ConnectionStrings\_\_DefaultConnection
- Jwt**Key, Jwt**Issuer, Jwt\_\_Audience
- Serilog\_\_SeqServerUrl

## Mimarideki Yeri

Frontend → IdentityService → **ResourceManagerService** → Docker
