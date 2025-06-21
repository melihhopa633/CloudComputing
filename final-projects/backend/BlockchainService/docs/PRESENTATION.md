# Blockchain Service: Mimarisi ve Entegrasyonu

## İçerik

1. Blockchain Service Nedir?
2. Teknik Mimarisi
3. Smart Contract Yapısı
4. Diğer Servislerle Entegrasyonu
5. API Endpointleri
6. Veri Akışı
7. Örnek Kullanım Senaryoları

## 1. Blockchain Service Nedir?

BlockchainService, cloud computing platformumuzda konteyner kaynak metriklerini (CPU, bellek kullanımı) Ethereum-uyumlu blockchain üzerinde kaydeden ve sorgulayan bir mikroservistir. Bu servis:

- Konteyner kullanım verilerini blockchain üzerinde şeffaf şekilde kaydeder
- Kullanıcıların konteyner kullanım geçmişini değiştirilemez şekilde saklar
- REST API aracılığıyla diğer servislerle entegre olur
- Ganache gibi Ethereum test ağlarıyla çalışabilir

## 2. Teknik Mimarisi

BlockchainService, aşağıdaki teknolojileri kullanır:

- **Node.js & Express.js**: REST API'leri sunmak için
- **ethers.js**: Ethereum blockchain'i ile etkileşim için
- **Smart Contract**: Solidity ile yazılmış konteyner metriklerini kaydeden kontrat
- **PostgreSQL**: API çağrıları ve blockchain işlem detayları için veritabanı

Mimari bileşenler:

- `index.js`: Ana uygulama giriş noktası
- `src/metrics.js`: API endpointlerini tanımlar
- `src/blockchain.js`: Blockchain etkileşimi için arabirim
- `src/database.js`: Veritabanı operasyonları
- `contracts/MetricContract.sol`: Metrik kayıt kontratı

## 3. Smart Contract Yapısı

`MetricContract.sol` kontratı şu yapıdadır:

```solidity
contract MetricContract {
    struct Metric {
        string containerId;
        uint256 memoryMB;
        uint256 cpuUsage;
        uint256 timestamp;
    }

    Metric[] public metrics;

    function recordMetric(
        string memory containerId,
        uint256 memoryMB,
        uint256 cpuUsage,
        uint256 timestamp
    ) public { ... }

    function getMetricCount() public view returns (uint256) { ... }

    function getMetric(uint256 index) public view returns (...) { ... }
}
```

Bu kontrat:

- Metrik verilerini blockchain üzerinde saklar
- Her metrik için konteyner ID, bellek, CPU ve zaman bilgisi tutar
- Tüm metrikleri listeleme ve sayma fonksiyonları sağlar

## 4. Diğer Servislerle Entegrasyonu

BlockchainService, sistemdeki diğer servislerle şu şekilde entegre olur:

### ResourceManagerService ile Entegrasyon

ResourceManagerService, konteyner başlatma ve durdurma işlemlerini yönetir:

1. Kullanıcı ResourceManagerService üzerinden konteyner başlatır
2. ResourceManagerService düzenli olarak konteyner kullanım metriklerini toplar
3. Bu metrikler BlockchainService'e HTTP POST `/api/metrics` endpointi ile gönderilir
4. BlockchainService bu metriği hem veritabanına hem blockchain'e kaydeder

```
Frontend → IdentityService → ResourceManagerService → BlockchainService → Ethereum Blockchain
```

### Frontend ile Entegrasyon

Frontend uygulaması, kullanıcıların metrik verilerini görüntülemek için:

1. BlockchainService'in GET `/api/metrics` endpointini çağırır
2. Kullanıcı bazlı filtreleme yapabilir
3. Metrik verilerini görselleştirir
4. İşlem hash'leri ve block numaralarını gösterir

## 5. API Endpointleri

BlockchainService şu API endpointlerini sunar:

- `POST /api/metrics`: Yeni metrik kaydı

  ```json
  {
    "user_email": "user@example.com",
    "user_fullname": "User Name",
    "containerId": "abcd1234",
    "containerName": "jupyter-notebook",
    "memoryMB": 256.5,
    "cpuUsage": 0.35
  }
  ```

- `GET /api/metrics`: Tüm metrikleri sorgulama (filtreleme ve sayfalama destekli)
- `GET /api/metrics/:containerId`: Belirli bir konteyner için metrikleri sorgulama
- `GET /api/metrics/count`: Metrik sayısını alma

## 6. Veri Akışı

BlockchainService'deki veri akışı:

1. **Metrik Kaydı**:

   - ResourceManagerService → POST /api/metrics isteği
   - BlockchainService metriği doğrular
   - Blockchain.js kontratı çağırır ve işlemi blockchain'e gönderir
   - İşlem hash'i ve blok numarası veritabanına kaydedilir
   - Yanıt ResourceManagerService'e döndürülür

2. **Metrik Sorgusu**:
   - Frontend → GET /api/metrics isteği
   - BlockchainService veritabanından metrikleri sorgular
   - Metrikleri JSON formatında döndürür

## 7. Örnek Kullanım Senaryoları

### Senaryo 1: Kullanım İzleme

Bir üniversitedeki öğrencilerin bulut kaynaklarını kullanımının şeffaf izlenmesi:

- Her öğrencinin konteyner kullanımı blockchain'de kaydedilir
- Fakülte yönetimi kullanım verilerini şeffaf şekilde görüntüleyebilir
- Veriler değiştirilemez olduğu için güvenilirdir

### Senaryo 2: Kaynak Faturalandırma

Kullanıma dayalı faturalandırma:

- Her kullanıcının kaynak tüketimi (CPU, bellek) blockchain'de kaydedilir
- Faturalama sistemi BlockchainService'den verileri çeker
- Faturalandırma şeffaf ve doğrulanabilir şekilde yapılabilir

### Senaryo 3: Kaynak Optimizasyonu

Sistem yöneticileri için:

- Konteyner bazlı kaynak kullanım trendleri analiz edilebilir
- Aşırı kaynak tüketen konteynerlerin tespiti yapılabilir
- Kaynak tahsisi optimize edilebilir
