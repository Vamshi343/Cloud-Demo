terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "2.4.0"
    }
  }
  required_version = ">= 1.0.0"
}

provider "local" {}

# Simulated Cloud Storage bucket metadata as a local JSON file
resource "local_file" "bucket_metadata" {
  filename = "${path.module}/state/bucket_metadata.json"
  content  = jsonencode({
    bucket_name   = var.bucket_name
    location      = var.bucket_location
    storage_class = var.bucket_storage_class
    created_at    = timestamp()
  })
}

# Simulated BigQuery dataset metadata as a local JSON file
resource "local_file" "bigquery_dataset" {
  filename = "${path.module}/state/bigquery_dataset.json"
  content  = jsonencode({
    dataset_id = var.bq_dataset_id
    location   = var.bq_location
    created_at = timestamp()
  })
}

# small helper resource to "record" a sample table row as a JSON file to simulate data load
resource "local_file" "bigquery_sample_rows" {
  filename = "${path.module}/state/bigquery_sample_rows.json"
  content  = jsonencode([
    { id = 1, name = "Vamshi", score = 95 },
    { id = 2, name = "Test",  score = 88 }
  ])
}
