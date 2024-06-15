package main

import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "net/http"
)

var db *gorm.DB

func initDatabase() {
    var err error
    db, err = gorm.Open(sqlite.Open("records.db"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }
    db.AutoMigrate(&Record{})
}

type Record struct {
    ID        uint   `json:"id" gorm:"primaryKey"`
    Name      string `json:"name"`
    IsActive  bool   `json:"is_active"`
    CreatedAt int64  `json:"created_at" gorm:"autoCreateTime"`
    UpdatedAt int64  `json:"updated_at" gorm:"autoUpdateTime"`
}

func main() {
    initDatabase()

    router := gin.Default()

    // Add CORS middleware
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    router.POST("/records", addRecord)
    router.GET("/records", getRecords)
    router.PUT("/records/:id", updateRecord)
    router.DELETE("/records/:id", deleteRecord)
    router.PATCH("/records/:id/activate", activateRecord)
    router.PATCH("/records/:id/deactivate", deactivateRecord)

    router.Run(":8080")
}

func addRecord(c *gin.Context) {
    var record Record
    if err := c.ShouldBindJSON(&record); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    record.IsActive = true
    db.Create(&record)
    c.JSON(http.StatusOK, record)
}

func getRecords(c *gin.Context) {
    var records []Record
    db.Find(&records)
    c.JSON(http.StatusOK, records)
}

func updateRecord(c *gin.Context) {
    var record Record
    id := c.Param("id")
    if err := db.First(&record, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    }
    if err := c.ShouldBindJSON(&record); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    db.Save(&record)
    c.JSON(http.StatusOK, record)
}

func deleteRecord(c *gin.Context) {
    var record Record
    id := c.Param("id")
    if err := db.First(&record, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    }
    db.Delete(&record)
    c.JSON(http.StatusOK, gin.H{"message": "Record deleted"})
}

func activateRecord(c *gin.Context) {
    var record Record
    id := c.Param("id")
    if err := db.First(&record, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    }
    record.IsActive = true
    db.Save(&record)
    c.JSON(http.StatusOK, record)
}

func deactivateRecord(c *gin.Context) {
    var record Record
    id := c.Param("id")
    if err := db.First(&record, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    }
    record.IsActive = false
    db.Save(&record)
    c.JSON(http.StatusOK, record)
}
