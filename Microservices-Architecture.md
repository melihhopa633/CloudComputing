# Mikroservis Mimarisi ve Altyapı Servisleri

## Identity Service

### Genel Bakış

Identity Service, kullanıcı kimlik doğrulama ve yetkilendirme işlemlerini yöneten merkezi bir servistir. Bu servis, kullanıcı kaydı, giriş, token yönetimi ve rol tabanlı yetkilendirme gibi temel güvenlik işlevlerini sağlar.

### Temel Özellikleri

- **Kullanıcı Yönetimi**: Kullanıcı hesaplarının oluşturulması, güncellenmesi ve silinmesi
- **Kimlik Doğrulama**: Kullanıcı kimlik bilgilerinin doğrulanması ve JWT token üretimi
- **Yetkilendirme**: Rol tabanlı erişim kontrolü (RBAC)
- **Kullanıcı Profili**: Kullanıcı bilgilerinin saklanması ve yönetilmesi
- **Single Sign-On (SSO)**: Tek giriş ile tüm sistemlere erişim

### Teknik Altyapı

- ASP.NET Core Identity framework kullanımı
- JWT (JSON Web Token) tabanlı kimlik doğrulama
- Entity Framework Core ile veritabanı entegrasyonu
- RESTful API endpoints

### Diğer Servislerle İlişkisi

Identity Service, diğer tüm mikroservislere kullanıcı kimlik doğrulama ve yetkilendirme hizmetleri sunar. Kullanıcı bilgileri ve rolleri merkezi olarak yönetilir ve diğer servisler tarafından kullanılır.

## Resource Manager Service

### Genel Bakış

Resource Manager Service, sistem kaynaklarının tahsisi, izlenmesi ve yönetilmesinden sorumludur. Bu servis, Docker konteynerları, veritabanları, depolama ve diğer sistem kaynaklarının yaşam döngüsünü yönetir.

### Temel Özellikleri

- **Kaynak Tahsisi**: Kullanıcılara veya uygulamalara sistem kaynaklarının atanması
- **Konteyner Yönetimi**: Docker konteynerlarının oluşturulması, başlatılması, durdurulması ve izlenmesi
- **Kaynak İzleme**: Sistem kaynaklarının kullanımının izlenmesi ve raporlanması
- **Ölçeklendirme**: Sistem yükü değişikliklerine göre kaynakların otomatik ölçeklendirilmesi
- **Hata Toleransı**: Arıza durumunda kaynakların otomatik yeniden yapılandırılması

### Teknik Altyapı

- Docker API ve Docker.DotNet entegrasyonu
- Asenkron işlem modeli (Task-based)
- Mesaj kuyrukları ile dağıtık işlem yönetimi
- Prometheus entegrasyonu ile metrik toplama

### Diğer Servislerle İlişkisi

Resource Manager Service, BlockchainService ve diğer iş mantığı servisleri için altyapı kaynakları sağlar. Kullanıcı istekleri doğrultusunda kaynaklar oluşturur ve bu kaynakların yaşam döngüsünü yönetir.

## Seq - Merkezi Loglama Sistemi

### Genel Bakış

Seq, yapılandırılmış log olaylarını gerçek zamanlı olarak toplayıp analiz eden güçlü bir merkezi loglama platformudur. Mikroservis mimarisinde, dağıtık sistemlerdeki log yönetimini kolaylaştırır.

### Temel Özellikleri

- **Gerçek Zamanlı Log Toplama**: Tüm servislerden anlık log toplama
- **Yapılandırılmış Loglar**: JSON formatında yapılandırılmış log olayları
- **Güçlü Sorgu Dili**: LINQ benzeri sorgu dili ile logları filtreleme ve analiz etme
- **Alarm ve Bildirimler**: Belirli olaylarda e-posta, Slack veya webhook bildirimleri
- **Görselleştirme**: Log olaylarının grafikler ve tablolar ile görselleştirilmesi

### Entegrasyon

- Serilog ve diğer logging frameworkleri ile kolay entegrasyon
- HTTP API üzerinden log gönderimi
- Mikroservislerin doğrudan Seq'e log göndermesi

### Faydaları

- **Merkezi İzleme**: Tüm sistemdeki olayları tek bir yerden izleme
- **Hızlı Sorun Giderme**: Sorunları hızlıca tespit etme ve çözme
- **Performans Analizi**: Sistem performansını anlık olarak izleme
- **Güvenlik İzleme**: Güvenlikle ilgili olayları takip etme

## Prometheus - Metrik Toplama ve İzleme

### Genel Bakış

Prometheus, sistem ve uygulama metriklerini toplayan, depolayan ve sorgulayan açık kaynaklı bir izleme sistemidir. Özellikle konteyner tabanlı mikroservis mimarilerinde yaygın olarak kullanılır.

### Temel Özellikleri

- **Metrik Toplama**: Sistem ve uygulama metriklerinin toplanması
- **Veri Modeli**: Zaman serisi veritabanı ile metrik depolama
- **PromQL**: Güçlü sorgu dili ile metrikleri analiz etme
- **Uyarı Yönetimi**: Belirli koşullarda uyarı oluşturma
- **Servis Keşfi**: Dinamik ortamlarda hedeflerin otomatik keşfi

### Entegrasyon

- .NET uygulamaları için Prometheus.Client kütüphanesi
- HTTP endpoint üzerinden metrik toplama
- Grafana ile görselleştirme entegrasyonu

### İzlenen Metrikler

- **Sistem Metrikleri**: CPU, bellek, disk, ağ kullanımı
- **Uygulama Metrikleri**: İstek sayısı, yanıt süresi, hata oranı
- **İş Metrikleri**: Kullanıcı aktiviteleri, iş akışı durumları
- **Konteyner Metrikleri**: Docker konteyner durumları ve kaynakları

### Faydaları

- **Proaktif İzleme**: Sorunları önlemek için sistem durumunu sürekli izleme
- **Kapasite Planlaması**: Sistem kullanımını analiz ederek kapasite planlaması yapma
- **Performans Optimizasyonu**: Darboğazları tespit etme ve giderme
- **SLA İzleme**: Hizmet seviyesi anlaşmalarına uyumu izleme

## Mikroservis Mimarisi Entegrasyonu

### Genel Mimari

Tüm bu servisler birlikte çalışarak güvenli, ölçeklenebilir ve izlenebilir bir mikroservis mimarisi oluşturur:

- **Identity Service**: Tüm kullanıcı kimlik ve yetkilendirme işlemlerini yönetir
- **Resource Manager Service**: Sistem kaynaklarını tahsis eder ve yönetir
- **Seq**: Tüm sistemdeki log olaylarını toplar ve analiz eder
- **Prometheus**: Sistem ve uygulama metriklerini izler

### İletişim Modeli

- RESTful API'ler üzerinden servisler arası iletişim
- Mesaj kuyrukları ile asenkron iletişim
- Event-driven mimari ile servisler arası olayların yayılması

### Güvenlik Katmanı

- JWT tabanlı kimlik doğrulama
- API Gateway ile erişim kontrolü
- HTTPS ile güvenli iletişim
- Rol tabanlı yetkilendirme

### Devops ve CI/CD

- Konteynerizasyon ile servis dağıtımı
- Sürekli entegrasyon ve sürekli dağıtım pipeline'ları
- Otomatik test ve kalite kontrol süreçleri
- Altyapı-as-code ile sistem konfigürasyonu
