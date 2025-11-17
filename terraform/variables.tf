variable "bucket_name" {
  description = "Simulated bucket name"
  type        = string
  default     = "vamshi-demo-bucket"
}

variable "bucket_location" {
  description = "Simulated bucket location"
  type        = string
  default     = "US-CENTRAL1"
}

variable "bucket_storage_class" {
  description = "Storage class"
  type        = string
  default     = "STANDARD"
}

variable "bq_dataset_id" {
  description = "Simulated BigQuery dataset id"
  type        = string
  default     = "demo_dataset_vamshi"
}

variable "bq_location" {
  description = "BigQuery location"
  type        = string
  default     = "US"
}
