# Task API Endpoints

Bu doküman, Task ile ilgili API uç noktalarını ve nasıl kullanılacaklarını açıklar. Tüm yanıtlar `ApiResponse` formatındadır.

## 1. Görev Oluştur (Create Task)

**POST** `/api/tasks`

Yeni bir görev (ör. Jupyter container) başlatır.

### Request Body (JSON)

```json
{
  "userId": "<kullanıcı-id>",
  "serviceType": "jupyter", // veya başka bir servis
  "containerId": "", // opsiyonel, genelde boş bırakılır
  "port": 8888 // kullanılacak port
}
```

### Response

- **201 Created**

```json
{
  "success": true,
  "message": "Task created",
  "data": "<task-id>"
}
```

---

## 2. Tekil Görev Getir (Get Task by ID)

**GET** `/api/tasks/{id}`

Belirli bir görevin detaylarını getirir.

### Response

- **200 OK**

```json
{
  "success": true,
  "message": "Task found",
  "data": {
    /* Task objesi */
  }
}
```

- **404 Not Found**

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## 3. Tüm Görevleri Listele (List All Tasks)

**GET** `/api/tasks`

Kullanıcıya ait tüm görevleri listeler.

### Response

- **200 OK**

```json
{
  "success": true,
  "message": "Tasks listed",
  "data": [
    /* Task listesi */
  ]
}
```

---

## 4. Görev Sil (Delete Task)

**DELETE** `/api/tasks/{id}`

Bir görevi siler (veya durdurur).

### Response

- **200 OK**

```json
{
  "success": true,
  "message": "Task deleted"
}
```

- **404 Not Found**

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

Herhangi bir sorunda backend ekibiyle iletişime geçebilirsiniz.
