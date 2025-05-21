# 🧠 Blockchain-Based Cloud Resource Management System

## 📌 Proje Amacı

Kullanıcıların başlattığı container tabanlı görevlerin kaynak tüketimini (CPU, RAM) izleyip bunları *değiştirilemez* biçimde bir *blockchain ağına* kaydederek; güvenli, şeffaf ve denetlenebilir bir kaynak yönetim sistemi sunmak.

## 🧩 BlockchainNode (Ganache)

Ganache, geliştirme ortamında Ethereum ağı simülasyonu sağlayan hafif ve hızlı bir blockchain node'udur. Projemizde, geliştirilen metrik kayıt sistemi için bir Ethereum ağına ihtiyaç duyulduğundan, test ve lokal geliştirme için Ganache tercih edilmiştir. Docker ortamında bir servis olarak ayağa kaldırılır ve blockchainservice adlı mikroservis bu node'a bağlanarak kontrat fonksiyonlarını kullanır.

### Özellikler

* Anında blok üretimi (instant mining): Her işlem anında işlenir, madenci beklenmez.
* JSON-RPC erişimi: http://localhost:8545 üzerinden işlem yapılabilir.
* Ön tanımlı test cüzdanları: Özel anahtar gerektirmeden işlem yapılabilir.
* Volume ile kalıcı veri depolama: Blok verileri ./ganache_data klasörüne yazılır.
* Kolay kurulum: Docker Compose ile tek adımda başlatılabilir.

### Docker Compose Yapılandırması

yaml
blockchain-node:
  image: trufflesuite/ganache-cli
  command:
    - --networkId
    - "1337"
    - --port
    - "8545"
    - --host
    - "0.0.0.0"
    - --db
    - "/data"
  ports:
    - "8545:8545"
  volumes:
    - ./ganache_data:/data
  networks:
    - app-network


## 🔧 BlockchainService

BlockchainService, container bazlı görevlerin sistem kaynak kullanımına dair metriklerini toplayan ve bu verileri blockchain ağına işleyen özel bir mikroservistir. Node.js tabanlıdır ve Ethereum akıllı sözleşmeleriyle etkileşime geçmek için ethers.js kütüphanesini kullanır.

### Görevleri

* Ethereum ağına bağlanmak (Ganache node üzerinden)
* Akıllı sözleşmeyi (smart contract) ilk çalışmada deploy etmek
* Gelen REST API çağrılarıyla metrikleri almak
* Bu metrikleri recordMetric fonksiyonu ile kontrata yazmak
* Zincirdeki mevcut verileri okuma endpoint'leri sunmak

### Kullanılan Teknolojiler

* *Node.js*: Mikroservis çatısı
* *Ethers.js*: Ethereum ile etkileşim
* *Express.js*: REST API altyapısı
* *Solidity*: Akıllı sözleşme dili
* *Docker*: Konteyner ortamı

### Docker Compose Yapılandırması

yaml
blockchainservice:
  build: ./backend/BlockchainService
  depends_on:
    - blockchain-node
  environment:
    RPC_URL: http://blockchain-node:8545
    MNEMONIC: "test test test test test test test test test test test junk"
  ports:
    - "4000:4000"
  networks:
    - app-network


### REST API Endpoint’leri

| Yöntem | Endpoint                    | Açıklama                                                        |
| ------ | --------------------------- | --------------------------------------------------------------- |
| POST   | /api/metrics              | Yeni bir metrik alır ve zincire yazar                           |
| GET    | /api/metrics              | Tüm zincirdeki metrikleri listeler                              |
| GET    | /api/metrics/:containerId | Belirli bir container'a ait metrikleri filtreler                |
| GET    | /api/metrics/count        | Zincirde kaç metrik kaydı olduğunu döner                        |
| GET    | /health                   | Servisin ve Ethereum node’un aktif olup olmadığını kontrol eder |

### Solidity Akıllı Sözleşme Fonksiyonları

solidity
function recordMetric(
  string calldata containerId,
  uint256 memoryMB,
  uint256 cpuUsage,
  uint256 timestamp
) external;

function getMetricCount() external view returns (uint256);

function metrics(uint256 index) external view returns (
  string memory containerId,
  uint256 memoryMB,
  uint256 cpuUsage,
  uint256 timestamp
);


### Kullanım Akışı (Sistemsel İşleyiş)

1. *Görev Silme:* ResourceManagerService görev sonlandığında, RAM ve CPU kullanım verilerini alır.
2. *Veri Gönderimi:* Bu metrikler, POST /api/metrics endpoint’ine JSON olarak gönderilir.
3. *Blockchain’e Yazım:* BlockchainService, recordMetric fonksiyonunu çağırarak metrikleri zincire yazar.
4. *Sorgulama:* Kullanıcı veya sistem, zincirdeki verileri GET endpoint’leri üzerinden okuyabilir.

### Örnek POST /api/metrics isteği

json
{
  "containerId": "abc123",
  "memoryMB": 150.25,
  "cpuUsage": 430, // yüzde 4.30
  "timestamp": 1714890123
}


Bu sayede zincire kaydedilen her işlem hem merkeziyetsiz hem de değiştirilemez bir yapıda güvence altına alınır. Smart contract aracılığıyla metriklerin doğruluğu ve geçmişi şeffaf biçimde denetlenebilir.